import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { BaseMessage, HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { configManager } from '../config/ConfigManager.server';
import { contextManager, type ProjectContext } from './ContextManager.server';

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'google';
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface ConversationContext {
  projectId: string;
  agentType: string;
  conversationId: string;
  messages: BaseMessage[];
  systemPrompt: string;
  projectContext?: ProjectContext;
  relevantMemories?: any[];
}

export class LLMProvider {
  private static instance: LLMProvider;
  private models: Map<string, any> = new Map();
  private outputParser = new StringOutputParser();
  
  private constructor() {
    this.initializeModels();
  }
  
  public static getInstance(): LLMProvider {
    if (!LLMProvider.instance) {
      LLMProvider.instance = new LLMProvider();
    }
    return LLMProvider.instance;
  }
  
  private async initializeModels(): Promise<void> {
    const config = configManager.getConfig();
    
    // Initialize OpenAI models
    if (config.ai.providers.openai.enabled && config.ai.providers.openai.apiKey && config.ai.providers.openai.apiKey !== 'demo_openai_key') {
      const openaiModels = ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'];
      openaiModels.forEach(model => {
        this.models.set(`openai:${model}`, new ChatOpenAI({
          openAIApiKey: config.ai.providers.openai.apiKey,
          modelName: model,
          temperature: 0.7,
          maxTokens: 4000,
        }));
      });
    }
    
    // Initialize Anthropic models
    if (config.ai.providers.anthropic.enabled && config.ai.providers.anthropic.apiKey && config.ai.providers.anthropic.apiKey !== 'demo_anthropic_key') {
      const anthropicModels = ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'];
      anthropicModels.forEach(model => {
        this.models.set(`anthropic:${model}`, new ChatAnthropic({
          anthropicApiKey: config.ai.providers.anthropic.apiKey,
          modelName: model,
          temperature: 0.7,
          maxTokens: 4000,
        }));
      });
    }
    
    // Initialize Google models
    if (config.ai.providers.google.enabled && config.ai.providers.google.apiKey && config.ai.providers.google.apiKey !== 'demo_google_key') {
      const googleModels = ['gemini-pro', 'gemini-pro-vision'];
      googleModels.forEach(model => {
        this.models.set(`google:${model}`, new ChatGoogleGenerativeAI({
          apiKey: config.ai.providers.google.apiKey,
          model: model,
          temperature: 0.7,
          maxOutputTokens: 4000,
        }));
      });
    }
  }
  
  async generateResponse(
    context: ConversationContext,
    config?: LLMConfig
  ): Promise<string> {
    try {
      // Get the appropriate model
      const model = await this.getModel(config);
      
      // Create enhanced prompt with context
      const prompt = await this.createContextualPrompt(context);
      
      // Create the chain
      const chain = RunnableSequence.from([
        prompt,
        model,
        this.outputParser,
      ]);
      
      // Generate response
      const response = await chain.invoke({
        messages: context.messages,
        system_prompt: context.systemPrompt,
        project_context: JSON.stringify(context.projectContext, null, 2),
        relevant_memories: JSON.stringify(context.relevantMemories, null, 2),
      });
      
      // Store the interaction for learning
      await this.storeInteraction(context, response);
      
      return response;
      
    } catch (error) {
      console.error('LLM generation error:', error);
      throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async generateCodeWithContext(
    request: string,
    projectContext: ProjectContext,
    agentType: string,
    conversationId: string
  ): Promise<{
    code: string;
    explanation: string;
    suggestions: string[];
    tests?: string;
  }> {
    try {
      // Get relevant context
      const relevantContext = await contextManager.getRelevantContext(
        projectContext.id,
        request,
        agentType
      );
      
      // Create specialized prompt for code generation
      const codePrompt = ChatPromptTemplate.fromMessages([
        ['system', this.getCodeGenerationSystemPrompt(projectContext, agentType)],
        ['human', `Generate code for: ${request}
        
        Project Context: {project_context}
        Relevant Memories: {relevant_memories}
        
        Please provide:
        1. The complete code implementation
        2. A clear explanation of what the code does
        3. Suggestions for improvements or alternatives
        4. Unit tests (if applicable)
        
        Format your response as JSON with the following structure:
        {{
          "code": "...",
          "explanation": "...",
          "suggestions": ["...", "..."],
          "tests": "..."
        }}`],
      ]);
      
      const model = await this.getModel();
      const chain = RunnableSequence.from([codePrompt, model, this.outputParser]);
      
      const response = await chain.invoke({
        project_context: JSON.stringify(projectContext, null, 2),
        relevant_memories: JSON.stringify(relevantContext.relevantMemories, null, 2),
      });
      
      // Parse JSON response
      try {
        const parsed = JSON.parse(response);
        return {
          code: parsed.code || '',
          explanation: parsed.explanation || '',
          suggestions: parsed.suggestions || [],
          tests: parsed.tests || undefined,
        };
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          code: response,
          explanation: 'Code generated successfully',
          suggestions: [],
        };
      }
      
    } catch (error) {
      console.error('Code generation error:', error);
      throw error;
    }
  }
  
  async reviewCodeWithContext(
    code: string,
    projectContext: ProjectContext,
    conversationId: string
  ): Promise<{
    score: number;
    issues: Array<{
      type: 'error' | 'warning' | 'suggestion';
      message: string;
      line?: number;
      severity: 'low' | 'medium' | 'high';
    }>;
    suggestions: string[];
    summary: string;
  }> {
    try {
      const reviewPrompt = ChatPromptTemplate.fromMessages([
        ['system', this.getCodeReviewSystemPrompt(projectContext)],
        ['human', `Please review the following code:

\`\`\`
${code}
\`\`\`

Project Context: {project_context}

Provide a comprehensive code review with:
1. Overall quality score (0-100)
2. Specific issues found (errors, warnings, suggestions)
3. Improvement suggestions
4. Summary of the review

Format as JSON:
{{
  "score": 85,
  "issues": [
    {{
      "type": "warning",
      "message": "Consider adding error handling",
      "line": 10,
      "severity": "medium"
    }}
  ],
  "suggestions": ["Add unit tests", "Improve variable naming"],
  "summary": "Overall good code quality with minor improvements needed"
}}`],
      ]);
      
      const model = await this.getModel();
      const chain = RunnableSequence.from([reviewPrompt, model, this.outputParser]);
      
      const response = await chain.invoke({
        project_context: JSON.stringify(projectContext, null, 2),
      });
      
      try {
        return JSON.parse(response);
      } catch (parseError) {
        return {
          score: 70,
          issues: [],
          suggestions: [response],
          summary: 'Code review completed',
        };
      }
      
    } catch (error) {
      console.error('Code review error:', error);
      throw error;
    }
  }
  
  async explainCodeWithContext(
    code: string,
    projectContext: ProjectContext,
    conversationId: string
  ): Promise<{
    explanation: string;
    keyComponents: string[];
    flowDescription: string;
    relatedConcepts: string[];
  }> {
    try {
      const explainPrompt = ChatPromptTemplate.fromMessages([
        ['system', this.getCodeExplanationSystemPrompt(projectContext)],
        ['human', `Please explain the following code in detail:

\`\`\`
${code}
\`\`\`

Project Context: {project_context}

Provide:
1. A clear, comprehensive explanation
2. Key components and their purposes
3. Flow description (how the code executes)
4. Related concepts and patterns used

Format as JSON:
{{
  "explanation": "This code implements...",
  "keyComponents": ["Component 1", "Component 2"],
  "flowDescription": "The execution flow is...",
  "relatedConcepts": ["Pattern 1", "Concept 2"]
}}`],
      ]);
      
      const model = await this.getModel();
      const chain = RunnableSequence.from([explainPrompt, model, this.outputParser]);
      
      const response = await chain.invoke({
        project_context: JSON.stringify(projectContext, null, 2),
      });
      
      try {
        return JSON.parse(response);
      } catch (parseError) {
        return {
          explanation: response,
          keyComponents: [],
          flowDescription: '',
          relatedConcepts: [],
        };
      }
      
    } catch (error) {
      console.error('Code explanation error:', error);
      throw error;
    }
  }
  
  private async getModel(config?: LLMConfig): Promise<any> {
    const defaultConfig = configManager.getConfig();
    const provider = config?.provider || 'anthropic';
    const model = config?.model || 'claude-3-5-sonnet-20241022';
    
    const modelKey = `${provider}:${model}`;
    
    if (!this.models.has(modelKey)) {
      await this.initializeModels();
    }
    
    const selectedModel = this.models.get(modelKey);
    if (!selectedModel) {
      throw new Error(`Model not available: ${modelKey}`);
    }
    
    return selectedModel;
  }
  
  private async createContextualPrompt(context: ConversationContext): Promise<ChatPromptTemplate> {
    return ChatPromptTemplate.fromMessages([
      ['system', `{system_prompt}

Project Context:
{project_context}

Relevant Memories:
{relevant_memories}

You are an expert AI assistant specialized in software development. Use the provided context to give accurate, helpful, and contextually relevant responses.`],
      new MessagesPlaceholder('messages'),
    ]);
  }
  
  private getCodeGenerationSystemPrompt(projectContext: ProjectContext, agentType: string): string {
    return `You are a ${agentType} AI agent working on the project "${projectContext.name}".

Project Details:
- Architecture: ${projectContext.architecture.type}
- Framework: ${projectContext.architecture.framework}
- Tech Stack: ${JSON.stringify(projectContext.techStack)}
- Current Phase: ${projectContext.development.phase}

Your role is to generate high-quality, production-ready code that:
1. Follows the project's architecture and patterns
2. Uses the established tech stack appropriately
3. Adheres to best practices and coding standards
4. Is well-documented and maintainable
5. Includes proper error handling
6. Is optimized for performance and security

Always consider the project context and existing codebase when generating code.`;
  }
  
  private getCodeReviewSystemPrompt(projectContext: ProjectContext): string {
    return `You are a senior code reviewer working on the project "${projectContext.name}".

Project Standards:
- Architecture: ${projectContext.architecture.type}
- Framework: ${projectContext.architecture.framework}
- Tech Stack: ${JSON.stringify(projectContext.techStack)}

Review the code for:
1. Code quality and maintainability
2. Security vulnerabilities
3. Performance issues
4. Adherence to project standards
5. Best practices compliance
6. Potential bugs or edge cases
7. Documentation and comments
8. Test coverage considerations

Provide constructive, actionable feedback that helps improve the code quality.`;
  }
  
  private getCodeExplanationSystemPrompt(projectContext: ProjectContext): string {
    return `You are an expert code educator working on the project "${projectContext.name}".

Project Context:
- Architecture: ${projectContext.architecture.type}
- Framework: ${projectContext.architecture.framework}
- Tech Stack: ${JSON.stringify(projectContext.techStack)}

Explain code in a way that is:
1. Clear and easy to understand
2. Contextually relevant to the project
3. Educational and informative
4. Comprehensive but not overwhelming
5. Suitable for developers at different skill levels

Focus on helping developers understand not just what the code does, but why it's structured that way and how it fits into the larger project.`;
  }
  
  private async storeInteraction(
    context: ConversationContext,
    response: string
  ): Promise<void> {
    try {
      // Store the interaction for learning and context
      await contextManager.learnFromInteraction(
        context.projectId,
        {
          query: context.messages[context.messages.length - 1]?.content?.toString() || '',
          response,
          outcome: 'success', // This would be determined by user feedback in a real system
        }
      );
    } catch (error) {
      console.error('Failed to store interaction:', error);
    }
  }
  
  // Utility methods
  async getAvailableModels(): Promise<string[]> {
    return Array.from(this.models.keys());
  }
  
  async testModelConnection(provider: string, model: string): Promise<boolean> {
    try {
      const modelKey = `${provider}:${model}`;
      const selectedModel = this.models.get(modelKey);
      
      if (!selectedModel) {
        return false;
      }
      
      // Test with a simple prompt
      const testResponse = await selectedModel.invoke([
        new HumanMessage('Hello, please respond with "Connection successful"')
      ]);
      
      return testResponse.content.includes('Connection successful');
    } catch (error) {
      console.error(`Model connection test failed for ${provider}:${model}:`, error);
      return false;
    }
  }
  
  async refreshModels(): Promise<void> {
    this.models.clear();
    await this.initializeModels();
  }
}

export const llmProvider = LLMProvider.getInstance();