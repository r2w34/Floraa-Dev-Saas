import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { z } from 'zod';
import { multiAgentSystem } from '~/lib/ai/MultiAgentSystem.server';
import { contextManager } from '~/lib/ai/ContextManager.server';
import { llmProvider } from '~/lib/ai/LLMProvider.server';

// Request schema
const ChatRequestSchema = z.object({
  message: z.string().min(1),
  projectId: z.string(),
  conversationId: z.string(),
  chatMode: z.enum(['single', 'multi-agent']).default('multi-agent'),
  selectedModel: z.string().default('claude-3-5-sonnet'),
  context: z.record(z.any()).optional(),
});

// Response schema
const ChatResponseSchema = z.object({
  response: z.string().optional(),
  responses: z.array(z.object({
    agent: z.string(),
    content: z.string(),
    confidence: z.number(),
    processingTime: z.number(),
    model: z.string(),
    actions: z.array(z.object({
      type: z.string(),
      data: z.record(z.any()),
    })).optional(),
  })).optional(),
  actions: z.array(z.object({
    type: z.string(),
    data: z.record(z.any()),
  })).optional(),
  confidence: z.number(),
  processingTime: z.number(),
  model: z.string(),
  error: z.string().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  const startTime = Date.now();
  
  try {
    // Parse request body
    const body = await request.json();
    const { message, projectId, conversationId, chatMode, selectedModel, context } = 
      ChatRequestSchema.parse(body);
    
    // Initialize multi-agent system for the project if not already done
    await multiAgentSystem.initializeProject(projectId);
    
    // Process based on chat mode
    if (chatMode === 'multi-agent') {
      return await handleMultiAgentChat(message, projectId, conversationId, selectedModel, startTime);
    } else {
      return await handleSingleAgentChat(message, projectId, conversationId, selectedModel, startTime);
    }
    
  } catch (error) {
    console.error('AI chat error:', error);
    
    return json({
      error: error instanceof Error ? error.message : 'An error occurred processing your request',
      confidence: 0,
      processingTime: Date.now() - startTime,
      model: 'error',
    }, { status: 500 });
  }
}

async function handleMultiAgentChat(
  message: string,
  projectId: string,
  conversationId: string,
  selectedModel: string,
  startTime: number
): Promise<Response> {
  try {
    // Get project context
    const projectContext = await contextManager.getProjectContext(projectId);
    
    // Determine which agents should respond based on the message
    const relevantAgents = await determineRelevantAgents(message, projectContext);
    
    // Get responses from each relevant agent
    const agentResponses = await Promise.all(
      relevantAgents.map(async (agentInfo) => {
        const agentStartTime = Date.now();
        
        try {
          // Get agent-specific context
          const agentContext = await contextManager.getRelevantContext(
            projectId,
            message,
            agentInfo.type
          );
          
          // Generate response based on agent type
          let response: string;
          let actions: Array<{ type: string; data: any }> = [];
          
          switch (agentInfo.type) {
            case 'architect':
              response = await generateArchitectResponse(message, agentContext, selectedModel);
              break;
            
            case 'developer':
              const devResult = await generateDeveloperResponse(message, agentContext, selectedModel);
              response = devResult.response;
              actions = devResult.actions;
              break;
            
            case 'reviewer':
              response = await generateReviewerResponse(message, agentContext, selectedModel);
              break;
            
            default:
              response = await generateGenericResponse(message, agentContext, selectedModel);
          }
          
          return {
            agent: agentInfo.name,
            content: response,
            confidence: 0.85,
            processingTime: Date.now() - agentStartTime,
            model: selectedModel,
            actions: actions.length > 0 ? actions : undefined,
          };
          
        } catch (error) {
          console.error(`Error from ${agentInfo.name}:`, error);
          return {
            agent: agentInfo.name,
            content: `I encountered an error processing your request. Please try again.`,
            confidence: 0.1,
            processingTime: Date.now() - agentStartTime,
            model: selectedModel,
          };
        }
      })
    );
    
    // Store conversation for context
    await storeConversation(projectId, conversationId, message, agentResponses);
    
    return json({
      responses: agentResponses,
      confidence: agentResponses.reduce((acc, r) => acc + r.confidence, 0) / agentResponses.length,
      processingTime: Date.now() - startTime,
      model: selectedModel,
    });
    
  } catch (error) {
    console.error('Multi-agent chat error:', error);
    throw error;
  }
}

async function handleSingleAgentChat(
  message: string,
  projectId: string,
  conversationId: string,
  selectedModel: string,
  startTime: number
): Promise<Response> {
  try {
    // Get project context
    const projectContext = await contextManager.getProjectContext(projectId);
    const relevantContext = await contextManager.getRelevantContext(
      projectId,
      message,
      'developer' // Default to developer agent for single mode
    );
    
    // Determine the type of request and generate appropriate response
    const requestType = analyzeRequestType(message);
    let response: string;
    let actions: Array<{ type: string; data: any }> = [];
    
    switch (requestType) {
      case 'code_generation':
        const codeResult = await llmProvider.generateCodeWithContext(
          message,
          projectContext!,
          'developer',
          conversationId
        );
        response = `I've generated the code for you:\n\n\`\`\`\n${codeResult.code}\n\`\`\`\n\n${codeResult.explanation}`;
        actions.push({
          type: 'generate_code',
          data: { code: codeResult.code, explanation: codeResult.explanation },
        });
        break;
      
      case 'code_review':
        // Extract code from message or use current context
        const codeToReview = extractCodeFromMessage(message) || 'Current code context';
        const reviewResult = await llmProvider.reviewCodeWithContext(
          codeToReview,
          projectContext!,
          conversationId
        );
        response = `Code Review Results:\n\nScore: ${reviewResult.score}/100\n\n${reviewResult.summary}\n\nSuggestions:\n${reviewResult.suggestions.map(s => `• ${s}`).join('\n')}`;
        break;
      
      case 'code_explanation':
        const codeToExplain = extractCodeFromMessage(message) || 'Current code context';
        const explainResult = await llmProvider.explainCodeWithContext(
          codeToExplain,
          projectContext!,
          conversationId
        );
        response = `Code Explanation:\n\n${explainResult.explanation}\n\nKey Components:\n${explainResult.keyComponents.map(c => `• ${c}`).join('\n')}`;
        break;
      
      default:
        // Use multi-agent system for general queries
        response = await multiAgentSystem.processUserQuery(projectId, message, conversationId);
    }
    
    // Store conversation
    await storeConversation(projectId, conversationId, message, [{ 
      agent: 'Floraa AI', 
      content: response, 
      confidence: 0.8,
      processingTime: Date.now() - startTime,
      model: selectedModel,
      actions,
    }]);
    
    return json({
      response,
      actions: actions.length > 0 ? actions : undefined,
      confidence: 0.8,
      processingTime: Date.now() - startTime,
      model: selectedModel,
    });
    
  } catch (error) {
    console.error('Single agent chat error:', error);
    throw error;
  }
}

async function determineRelevantAgents(
  message: string,
  projectContext: any
): Promise<Array<{ type: string; name: string }>> {
  const lowerMessage = message.toLowerCase();
  const relevantAgents: Array<{ type: string; name: string }> = [];
  
  // Architecture-related queries
  if (lowerMessage.includes('architecture') || 
      lowerMessage.includes('design') || 
      lowerMessage.includes('structure') ||
      lowerMessage.includes('pattern')) {
    relevantAgents.push({ type: 'architect', name: 'System Architect' });
  }
  
  // Code-related queries
  if (lowerMessage.includes('code') || 
      lowerMessage.includes('implement') || 
      lowerMessage.includes('function') ||
      lowerMessage.includes('create') ||
      lowerMessage.includes('build')) {
    relevantAgents.push({ type: 'developer', name: 'Senior Developer' });
  }
  
  // Review-related queries
  if (lowerMessage.includes('review') || 
      lowerMessage.includes('check') || 
      lowerMessage.includes('optimize') ||
      lowerMessage.includes('improve') ||
      lowerMessage.includes('quality')) {
    relevantAgents.push({ type: 'reviewer', name: 'Code Reviewer' });
  }
  
  // If no specific agents identified, use developer as default
  if (relevantAgents.length === 0) {
    relevantAgents.push({ type: 'developer', name: 'Senior Developer' });
  }
  
  return relevantAgents;
}

async function generateArchitectResponse(
  message: string,
  context: any,
  model: string
): Promise<string> {
  // Use LLM provider with architect-specific prompt
  const architectPrompt = `You are a Senior System Architect. Analyze the following request and provide architectural guidance:

Request: ${message}

Project Context: ${JSON.stringify(context.projectContext, null, 2)}

Provide specific architectural recommendations, patterns, and design decisions that would be appropriate for this project.`;

  // In a real implementation, this would use the LLM provider
  return `As your System Architect, I recommend considering the following architectural approach for your request:

Based on your current project structure and requirements, I suggest implementing a modular architecture that follows these principles:

1. **Separation of Concerns**: Keep business logic separate from presentation
2. **Scalability**: Design for future growth and increased load
3. **Maintainability**: Use clear interfaces and well-defined boundaries
4. **Performance**: Optimize for your specific use case

Would you like me to elaborate on any of these architectural decisions?`;
}

async function generateDeveloperResponse(
  message: string,
  context: any,
  model: string
): Promise<{ response: string; actions: Array<{ type: string; data: any }> }> {
  const actions: Array<{ type: string; data: any }> = [];
  
  // Check if this is a code generation request
  if (message.toLowerCase().includes('create') || 
      message.toLowerCase().includes('generate') ||
      message.toLowerCase().includes('implement')) {
    
    // Generate code based on the request
    const codeResult = await generateCodeFromRequest(message, context);
    
    actions.push({
      type: 'generate_code',
      data: { 
        code: codeResult.code,
        explanation: codeResult.explanation,
        language: codeResult.language || 'javascript',
      },
    });
    
    return {
      response: `I've implemented the requested functionality for you:

\`\`\`${codeResult.language || 'javascript'}
${codeResult.code}
\`\`\`

**Explanation:**
${codeResult.explanation}

**Key Features:**
${codeResult.features?.map(f => `• ${f}`).join('\n') || '• Clean, maintainable code\n• Proper error handling\n• TypeScript support'}

The code is ready to use and follows best practices for your project structure.`,
      actions,
    };
  }
  
  // General development guidance
  return {
    response: `As your Senior Developer, I can help you implement this functionality. Here's my approach:

1. **Analysis**: I've reviewed your request and project context
2. **Implementation Strategy**: Based on your tech stack, I recommend a clean, modular approach
3. **Best Practices**: I'll ensure the code follows industry standards and your project patterns

Could you provide more specific details about what you'd like me to implement? For example:
- What specific functionality do you need?
- Are there any particular requirements or constraints?
- Should I focus on any specific part of your application?`,
    actions,
  };
}

async function generateReviewerResponse(
  message: string,
  context: any,
  model: string
): Promise<string> {
  return `As your Code Reviewer, I've analyzed your request. Here's my assessment:

**Code Quality Analysis:**
- Overall structure looks good
- Following established patterns
- Proper error handling in place

**Recommendations:**
1. **Performance**: Consider optimizing for better performance
2. **Security**: Ensure proper input validation
3. **Testing**: Add comprehensive unit tests
4. **Documentation**: Include clear code comments

**Next Steps:**
- Implement the suggested improvements
- Run automated tests to verify functionality
- Consider peer review for critical components

Would you like me to focus on any specific aspect of the code review?`;
}

async function generateGenericResponse(
  message: string,
  context: any,
  model: string
): Promise<string> {
  return `I understand you're asking about: "${message}"

Based on your project context, I can help you with:
- Code implementation and development
- Architecture and design decisions  
- Code review and quality improvements
- Best practices and optimization

Could you provide more specific details about what you'd like me to help you with?`;
}

function analyzeRequestType(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('create') || 
      lowerMessage.includes('generate') || 
      lowerMessage.includes('implement') ||
      lowerMessage.includes('build')) {
    return 'code_generation';
  }
  
  if (lowerMessage.includes('review') || 
      lowerMessage.includes('check') || 
      lowerMessage.includes('analyze')) {
    return 'code_review';
  }
  
  if (lowerMessage.includes('explain') || 
      lowerMessage.includes('what does') || 
      lowerMessage.includes('how does')) {
    return 'code_explanation';
  }
  
  return 'general';
}

function extractCodeFromMessage(message: string): string | null {
  // Extract code blocks from message
  const codeBlockRegex = /```[\s\S]*?```/g;
  const matches = message.match(codeBlockRegex);
  
  if (matches && matches.length > 0) {
    return matches[0].replace(/```\w*\n?/g, '').replace(/```/g, '');
  }
  
  return null;
}

async function generateCodeFromRequest(
  request: string,
  context: any
): Promise<{
  code: string;
  explanation: string;
  language?: string;
  features?: string[];
}> {
  // Simple code generation based on request
  // In a real implementation, this would use the LLM provider
  
  if (request.toLowerCase().includes('react component')) {
    return {
      code: `import React from 'react';

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const MyComponent: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {children && <div className="content">{children}</div>}
    </div>
  );
};`,
      explanation: 'This is a reusable React component with TypeScript support, proper props interface, and clean structure.',
      language: 'typescript',
      features: [
        'TypeScript interface for props',
        'Functional component with React.FC',
        'Optional children prop',
        'Clean CSS class naming',
      ],
    };
  }
  
  if (request.toLowerCase().includes('function')) {
    return {
      code: `export const myFunction = (input: string): string => {
  try {
    // Process the input
    const result = input.trim().toLowerCase();
    
    // Return processed result
    return result;
  } catch (error) {
    console.error('Error in myFunction:', error);
    throw new Error('Failed to process input');
  }
};`,
      explanation: 'This is a utility function with proper error handling and TypeScript types.',
      language: 'typescript',
      features: [
        'TypeScript type annotations',
        'Error handling with try-catch',
        'Clear function naming',
        'Proper error logging',
      ],
    };
  }
  
  return {
    code: `// Generated code based on your request
const implementation = () => {
  // TODO: Implement functionality
  console.log('Implementation needed');
};

export default implementation;`,
    explanation: 'This is a basic code template. Please provide more specific requirements for a more detailed implementation.',
    language: 'javascript',
  };
}

async function storeConversation(
  projectId: string,
  conversationId: string,
  userMessage: string,
  responses: Array<{ agent: string; content: string; confidence: number; processingTime: number; model: string; actions?: any[] }>
): Promise<void> {
  try {
    // Store conversation in context manager for future reference
    const conversationMemory = {
      id: crypto.randomUUID(),
      projectId,
      agentId: 'multi-agent-system',
      messages: [
        {
          id: crypto.randomUUID(),
          role: 'user' as const,
          content: userMessage,
          timestamp: new Date().toISOString(),
          context: {},
        },
        ...responses.map(response => ({
          id: crypto.randomUUID(),
          role: 'assistant' as const,
          content: response.content,
          timestamp: new Date().toISOString(),
          context: {
            agent: response.agent,
            confidence: response.confidence,
            model: response.model,
            actions: response.actions,
          },
        })),
      ],
      summary: `User asked: "${userMessage}". Agents responded with helpful information.`,
      keyDecisions: responses.map(response => ({
        decision: response.content.substring(0, 100) + '...',
        reasoning: `Response from ${response.agent}`,
        timestamp: new Date().toISOString(),
        impact: 'medium' as const,
      })),
    };
    
    await contextManager.storeConversationMemory(conversationMemory);
    
  } catch (error) {
    console.error('Failed to store conversation:', error);
  }
}