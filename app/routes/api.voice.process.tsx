import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { z } from 'zod';
import { multiAgentSystem } from '~/lib/ai/MultiAgentSystem.server';
import { contextManager } from '~/lib/ai/ContextManager.server';
import { VoiceCommandSchema } from '~/lib/ai/VoiceToCode.client';

// Request schema
const VoiceProcessRequestSchema = z.object({
  command: VoiceCommandSchema,
  context: z.array(VoiceCommandSchema).optional(),
  projectId: z.string().optional(),
  conversationId: z.string().optional(),
});

// Response schema
const VoiceProcessResponseSchema = z.object({
  response: z.string(),
  actions: z.array(z.object({
    type: z.string(),
    data: z.record(z.any()),
  })).optional(),
  shouldSpeak: z.boolean().default(true),
  confidence: z.number(),
  processingTime: z.number(),
});

export async function action({ request }: ActionFunctionArgs) {
  const startTime = Date.now();
  
  try {
    // Parse request body
    const body = await request.json();
    const { command, context, projectId, conversationId } = VoiceProcessRequestSchema.parse(body);
    
    // Process the voice command
    const result = await processVoiceCommand(command, context, projectId, conversationId);
    
    const processingTime = Date.now() - startTime;
    
    return json({
      ...result,
      processingTime,
    });
    
  } catch (error) {
    console.error('Voice processing error:', error);
    
    return json({
      response: 'Sorry, I encountered an error processing your voice command.',
      shouldSpeak: true,
      confidence: 0,
      processingTime: Date.now() - startTime,
    }, { status: 500 });
  }
}

async function processVoiceCommand(
  command: any,
  context: any[] = [],
  projectId?: string,
  conversationId?: string
): Promise<{
  response: string;
  actions?: Array<{ type: string; data: Record<string, any> }>;
  shouldSpeak: boolean;
  confidence: number;
}> {
  
  // Enhanced command processing with context awareness
  const enhancedCommand = await enhanceCommandWithContext(command, context, projectId);
  
  // Route to appropriate handler based on intent
  switch (enhancedCommand.intent) {
    case 'code_generation':
      return await handleCodeGeneration(enhancedCommand, projectId, conversationId);
    
    case 'code_explanation':
      return await handleCodeExplanation(enhancedCommand, projectId, conversationId);
    
    case 'code_modification':
      return await handleCodeModification(enhancedCommand, projectId, conversationId);
    
    case 'navigation':
      return await handleNavigation(enhancedCommand);
    
    case 'file_operation':
      return await handleFileOperation(enhancedCommand, projectId);
    
    case 'debugging':
      return await handleDebugging(enhancedCommand, projectId, conversationId);
    
    case 'testing':
      return await handleTesting(enhancedCommand, projectId, conversationId);
    
    case 'deployment':
      return await handleDeployment(enhancedCommand, projectId, conversationId);
    
    default:
      return await handleGenericQuery(enhancedCommand, projectId, conversationId);
  }
}

async function enhanceCommandWithContext(
  command: any,
  context: any[],
  projectId?: string
): Promise<any> {
  let enhancedCommand = { ...command };
  
  // Add project context if available
  if (projectId) {
    const projectContext = await contextManager.getProjectContext(projectId);
    if (projectContext) {
      enhancedCommand.projectContext = projectContext;
    }
  }
  
  // Add conversation context
  if (context && context.length > 0) {
    enhancedCommand.conversationContext = context;
    
    // Analyze context for better understanding
    const contextAnalysis = analyzeConversationContext(context);
    enhancedCommand.contextAnalysis = contextAnalysis;
  }
  
  // Enhance intent detection with context
  enhancedCommand.intent = refineIntentWithContext(command.intent, enhancedCommand);
  
  return enhancedCommand;
}

function analyzeConversationContext(context: any[]): {
  recentTopics: string[];
  currentTask: string | null;
  workingFiles: string[];
  patterns: string[];
} {
  const recentTopics: string[] = [];
  let currentTask: string | null = null;
  const workingFiles: string[] = [];
  const patterns: string[] = [];
  
  // Analyze recent commands for patterns
  context.forEach(cmd => {
    // Extract topics from transcript
    const topics = extractTopicsFromTranscript(cmd.transcript);
    recentTopics.push(...topics);
    
    // Identify current task
    if (cmd.intent === 'code_generation' || cmd.intent === 'code_modification') {
      currentTask = cmd.transcript;
    }
    
    // Extract file references
    const files = extractFileReferences(cmd.transcript);
    workingFiles.push(...files);
  });
  
  return {
    recentTopics: [...new Set(recentTopics)],
    currentTask,
    workingFiles: [...new Set(workingFiles)],
    patterns: [...new Set(patterns)],
  };
}

function extractTopicsFromTranscript(transcript: string): string[] {
  const topics: string[] = [];
  const lowerTranscript = transcript.toLowerCase();
  
  // Programming concepts
  const concepts = ['function', 'component', 'class', 'interface', 'api', 'database', 'authentication'];
  concepts.forEach(concept => {
    if (lowerTranscript.includes(concept)) {
      topics.push(concept);
    }
  });
  
  return topics;
}

function extractFileReferences(transcript: string): string[] {
  const files: string[] = [];
  
  // Simple pattern matching for file references
  const filePattern = /(\w+\.(js|ts|jsx|tsx|py|java|cpp|css|html))/gi;
  let match;
  while ((match = filePattern.exec(transcript)) !== null) {
    files.push(match[1]);
  }
  
  return files;
}

function refineIntentWithContext(originalIntent: string, enhancedCommand: any): string {
  // Use context to refine intent detection
  const contextAnalysis = enhancedCommand.contextAnalysis;
  
  if (contextAnalysis?.currentTask && originalIntent === 'code_generation') {
    // If we're in the middle of a task, this might be a modification
    if (enhancedCommand.transcript.includes('add') || enhancedCommand.transcript.includes('modify')) {
      return 'code_modification';
    }
  }
  
  return originalIntent;
}

async function handleCodeGeneration(
  command: any,
  projectId?: string,
  conversationId?: string
): Promise<any> {
  try {
    // Use multi-agent system for code generation
    const response = await multiAgentSystem.processUserQuery(
      projectId || 'default',
      `Generate code: ${command.transcript}`,
      conversationId || crypto.randomUUID()
    );
    
    // Parse entities to determine what to generate
    const entities = command.entities || [];
    const languageEntity = entities.find((e: any) => e.type === 'programming_language');
    const typeEntity = entities.find((e: any) => e.type === 'file_type');
    
    const actions = [];
    
    // Add action to create/modify file if specific type mentioned
    if (typeEntity) {
      actions.push({
        type: 'create_file',
        data: {
          type: typeEntity.value,
          language: languageEntity?.value || 'javascript',
          content: response,
        },
      });
    }
    
    // Add action to open code editor
    actions.push({
      type: 'open_editor',
      data: {
        content: response,
        language: languageEntity?.value || 'javascript',
      },
    });
    
    return {
      response: `I've generated the code for you. ${response}`,
      actions,
      shouldSpeak: true,
      confidence: 0.9,
    };
    
  } catch (error) {
    console.error('Code generation error:', error);
    return {
      response: 'I encountered an error while generating the code. Could you please try rephrasing your request?',
      shouldSpeak: true,
      confidence: 0.3,
    };
  }
}

async function handleCodeExplanation(
  command: any,
  projectId?: string,
  conversationId?: string
): Promise<any> {
  try {
    // Use reviewer agent for code explanation
    const response = await multiAgentSystem.processUserQuery(
      projectId || 'default',
      `Explain code: ${command.transcript}`,
      conversationId || crypto.randomUUID()
    );
    
    const actions = [{
      type: 'highlight_code',
      data: {
        explanation: response,
      },
    }];
    
    return {
      response: `Let me explain that for you. ${response}`,
      actions,
      shouldSpeak: true,
      confidence: 0.85,
    };
    
  } catch (error) {
    console.error('Code explanation error:', error);
    return {
      response: 'I had trouble explaining that code. Could you be more specific about what you\'d like me to explain?',
      shouldSpeak: true,
      confidence: 0.3,
    };
  }
}

async function handleCodeModification(
  command: any,
  projectId?: string,
  conversationId?: string
): Promise<any> {
  try {
    const response = await multiAgentSystem.processUserQuery(
      projectId || 'default',
      `Modify code: ${command.transcript}`,
      conversationId || crypto.randomUUID()
    );
    
    const actions = [{
      type: 'modify_code',
      data: {
        modification: response,
        context: command.contextAnalysis,
      },
    }];
    
    return {
      response: `I've made the requested modifications. ${response}`,
      actions,
      shouldSpeak: true,
      confidence: 0.8,
    };
    
  } catch (error) {
    console.error('Code modification error:', error);
    return {
      response: 'I couldn\'t complete the modification. Could you provide more details about what you\'d like to change?',
      shouldSpeak: true,
      confidence: 0.3,
    };
  }
}

async function handleNavigation(command: any): Promise<any> {
  const transcript = command.transcript.toLowerCase();
  const actions = [];
  
  // Parse navigation commands
  if (transcript.includes('open') || transcript.includes('go to')) {
    // Extract target from transcript
    const target = extractNavigationTarget(transcript);
    
    if (target) {
      actions.push({
        type: 'navigate',
        data: { target },
      });
      
      return {
        response: `Navigating to ${target}`,
        actions,
        shouldSpeak: true,
        confidence: 0.9,
      };
    }
  }
  
  return {
    response: 'I\'m not sure where you\'d like to navigate. Could you be more specific?',
    shouldSpeak: true,
    confidence: 0.3,
  };
}

function extractNavigationTarget(transcript: string): string | null {
  // Simple pattern matching for navigation targets
  const patterns = [
    /(?:open|go to|navigate to)\s+(.+)/i,
    /show me\s+(.+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = transcript.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
}

async function handleFileOperation(command: any, projectId?: string): Promise<any> {
  const transcript = command.transcript.toLowerCase();
  const actions = [];
  
  if (transcript.includes('create file') || transcript.includes('new file')) {
    const fileName = extractFileName(transcript);
    
    if (fileName) {
      actions.push({
        type: 'create_file',
        data: { fileName },
      });
      
      return {
        response: `Creating file ${fileName}`,
        actions,
        shouldSpeak: true,
        confidence: 0.9,
      };
    }
  }
  
  return {
    response: 'I\'m not sure what file operation you\'d like to perform. Could you be more specific?',
    shouldSpeak: true,
    confidence: 0.3,
  };
}

function extractFileName(transcript: string): string | null {
  const patterns = [
    /(?:create file|new file)\s+(.+)/i,
    /file called\s+(.+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = transcript.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
}

async function handleDebugging(
  command: any,
  projectId?: string,
  conversationId?: string
): Promise<any> {
  try {
    const response = await multiAgentSystem.processUserQuery(
      projectId || 'default',
      `Debug: ${command.transcript}`,
      conversationId || crypto.randomUUID()
    );
    
    const actions = [{
      type: 'debug_code',
      data: {
        analysis: response,
      },
    }];
    
    return {
      response: `I've analyzed the issue. ${response}`,
      actions,
      shouldSpeak: true,
      confidence: 0.8,
    };
    
  } catch (error) {
    console.error('Debugging error:', error);
    return {
      response: 'I had trouble debugging that issue. Could you provide more details about the problem?',
      shouldSpeak: true,
      confidence: 0.3,
    };
  }
}

async function handleTesting(
  command: any,
  projectId?: string,
  conversationId?: string
): Promise<any> {
  try {
    const response = await multiAgentSystem.processUserQuery(
      projectId || 'default',
      `Generate tests: ${command.transcript}`,
      conversationId || crypto.randomUUID()
    );
    
    const actions = [{
      type: 'create_tests',
      data: {
        tests: response,
      },
    }];
    
    return {
      response: `I've created tests for you. ${response}`,
      actions,
      shouldSpeak: true,
      confidence: 0.85,
    };
    
  } catch (error) {
    console.error('Testing error:', error);
    return {
      response: 'I had trouble creating tests. Could you specify what you\'d like to test?',
      shouldSpeak: true,
      confidence: 0.3,
    };
  }
}

async function handleDeployment(
  command: any,
  projectId?: string,
  conversationId?: string
): Promise<any> {
  try {
    const response = await multiAgentSystem.processUserQuery(
      projectId || 'default',
      `Deploy: ${command.transcript}`,
      conversationId || crypto.randomUUID()
    );
    
    const actions = [{
      type: 'deploy',
      data: {
        deployment: response,
      },
    }];
    
    return {
      response: `I've initiated the deployment process. ${response}`,
      actions,
      shouldSpeak: true,
      confidence: 0.8,
    };
    
  } catch (error) {
    console.error('Deployment error:', error);
    return {
      response: 'I encountered an issue with the deployment. Could you check the deployment configuration?',
      shouldSpeak: true,
      confidence: 0.3,
    };
  }
}

async function handleGenericQuery(
  command: any,
  projectId?: string,
  conversationId?: string
): Promise<any> {
  try {
    const response = await multiAgentSystem.processUserQuery(
      projectId || 'default',
      command.transcript,
      conversationId || crypto.randomUUID()
    );
    
    return {
      response,
      shouldSpeak: true,
      confidence: 0.7,
    };
    
  } catch (error) {
    console.error('Generic query error:', error);
    return {
      response: 'I\'m not sure how to help with that. Could you try rephrasing your request?',
      shouldSpeak: true,
      confidence: 0.3,
    };
  }
}