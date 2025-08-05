import { z } from 'zod';
import { contextManager, type ProjectContext } from './ContextManager.server';

// Agent Types and Capabilities
export const AgentTypeSchema = z.enum([
  'architect',
  'developer',
  'reviewer',
  'tester',
  'devops',
  'designer',
  'security',
  'performance',
  'coordinator'
]);

export type AgentType = z.infer<typeof AgentTypeSchema>;

// Message Schema for inter-agent communication
export const AgentMessageSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string().optional(), // If undefined, broadcast to all agents
  type: z.enum(['request', 'response', 'notification', 'collaboration']),
  content: z.string(),
  data: z.record(z.any()).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  timestamp: z.string(),
  projectId: z.string(),
  conversationId: z.string(),
});

export type AgentMessage = z.infer<typeof AgentMessageSchema>;

// Task Schema
export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['code', 'review', 'test', 'deploy', 'design', 'architecture', 'security']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed', 'blocked']),
  assignedTo: z.string(),
  dependencies: z.array(z.string()),
  estimatedTime: z.number().optional(),
  actualTime: z.number().optional(),
  context: z.record(z.any()),
  result: z.record(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;

// Base Agent Interface
export abstract class BaseAgent {
  protected id: string;
  protected type: AgentType;
  protected name: string;
  protected capabilities: string[];
  protected isActive: boolean = false;
  protected currentTasks: Map<string, Task> = new Map();
  protected messageQueue: AgentMessage[] = [];
  protected context: ProjectContext | null = null;
  
  constructor(id: string, type: AgentType, name: string, capabilities: string[]) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.capabilities = capabilities;
  }
  
  // Abstract methods that each agent must implement
  abstract processMessage(message: AgentMessage): Promise<AgentMessage | null>;
  abstract executeTask(task: Task): Promise<Task>;
  abstract getSystemPrompt(): string;
  
  // Common agent methods
  async initialize(projectId: string): Promise<void> {
    this.context = await contextManager.getProjectContext(projectId);
    this.isActive = true;
    console.log(`${this.name} agent initialized for project ${projectId}`);
  }
  
  async receiveMessage(message: AgentMessage): Promise<void> {
    this.messageQueue.push(message);
    await this.processMessageQueue();
  }
  
  private async processMessageQueue(): Promise<void> {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;
      const response = await this.processMessage(message);
      
      if (response) {
        await this.sendMessage(response);
      }
    }
  }
  
  protected async sendMessage(message: AgentMessage): Promise<void> {
    // Send message through the multi-agent system
    await MultiAgentSystem.getInstance().routeMessage(message);
  }
  
  protected async updateContext(projectId: string, updates: Partial<ProjectContext>): Promise<void> {
    await contextManager.updateProjectContext(projectId, updates);
    this.context = await contextManager.getProjectContext(projectId);
  }
  
  protected async getRelevantContext(query: string): Promise<any> {
    if (!this.context) return null;
    
    return await contextManager.getRelevantContext(
      this.context.id,
      query,
      this.type
    );
  }
  
  // Getters
  getId(): string { return this.id; }
  getType(): AgentType { return this.type; }
  getName(): string { return this.name; }
  getCapabilities(): string[] { return this.capabilities; }
  isAgentActive(): boolean { return this.isActive; }
}

// Architect Agent - Designs system architecture
export class ArchitectAgent extends BaseAgent {
  constructor(id: string) {
    super(id, 'architect', 'System Architect', [
      'system_design',
      'architecture_patterns',
      'technology_selection',
      'scalability_planning',
      'integration_design'
    ]);
  }
  
  getSystemPrompt(): string {
    return `You are a Senior System Architect AI agent. Your role is to:
    
    1. Design robust, scalable system architectures
    2. Select appropriate technology stacks
    3. Plan system integrations and data flows
    4. Ensure architectural best practices
    5. Consider performance, security, and maintainability
    
    You work collaboratively with other AI agents and always consider the project context, business requirements, and technical constraints.
    
    Current project context: ${JSON.stringify(this.context, null, 2)}`;
  }
  
  async processMessage(message: AgentMessage): Promise<AgentMessage | null> {
    const relevantContext = await this.getRelevantContext(message.content);
    
    switch (message.type) {
      case 'request':
        if (message.content.includes('architecture') || message.content.includes('design')) {
          return await this.handleArchitectureRequest(message, relevantContext);
        }
        break;
      
      case 'collaboration':
        return await this.handleCollaboration(message, relevantContext);
    }
    
    return null;
  }
  
  async executeTask(task: Task): Promise<Task> {
    task.status = 'in_progress';
    task.updatedAt = new Date().toISOString();
    
    try {
      switch (task.type) {
        case 'architecture':
          task.result = await this.designArchitecture(task);
          break;
        default:
          throw new Error(`Unsupported task type: ${task.type}`);
      }
      
      task.status = 'completed';
      return task;
    } catch (error) {
      task.status = 'failed';
      task.result = { error: error instanceof Error ? error.message : 'Unknown error' };
      return task;
    }
  }
  
  private async handleArchitectureRequest(
    message: AgentMessage,
    context: any
  ): Promise<AgentMessage> {
    // Process architecture request with context
    const architectureAdvice = await this.generateArchitectureAdvice(message.content, context);
    
    return {
      id: crypto.randomUUID(),
      from: this.id,
      to: message.from,
      type: 'response',
      content: architectureAdvice,
      priority: message.priority,
      timestamp: new Date().toISOString(),
      projectId: message.projectId,
      conversationId: message.conversationId,
    };
  }
  
  private async handleCollaboration(
    message: AgentMessage,
    context: any
  ): Promise<AgentMessage | null> {
    // Handle collaboration requests from other agents
    return null;
  }
  
  private async designArchitecture(task: Task): Promise<any> {
    // Implementation for architecture design
    return {
      architecture: 'microservices',
      components: [],
      integrations: [],
      recommendations: []
    };
  }
  
  private async generateArchitectureAdvice(query: string, context: any): Promise<string> {
    // In a real implementation, this would call the LLM with the system prompt
    return `Based on your requirements and project context, I recommend a microservices architecture with the following components...`;
  }
}

// Developer Agent - Writes and implements code
export class DeveloperAgent extends BaseAgent {
  constructor(id: string) {
    super(id, 'developer', 'Senior Developer', [
      'code_generation',
      'implementation',
      'debugging',
      'refactoring',
      'api_development'
    ]);
  }
  
  getSystemPrompt(): string {
    return `You are a Senior Developer AI agent. Your role is to:
    
    1. Write clean, efficient, and maintainable code
    2. Implement features based on specifications
    3. Debug and fix issues in existing code
    4. Refactor code for better performance and readability
    5. Develop APIs and integrations
    
    You follow best practices, write comprehensive tests, and collaborate with other agents for optimal results.
    
    Current project context: ${JSON.stringify(this.context, null, 2)}`;
  }
  
  async processMessage(message: AgentMessage): Promise<AgentMessage | null> {
    const relevantContext = await this.getRelevantContext(message.content);
    
    switch (message.type) {
      case 'request':
        if (message.content.includes('code') || message.content.includes('implement')) {
          return await this.handleCodeRequest(message, relevantContext);
        }
        break;
    }
    
    return null;
  }
  
  async executeTask(task: Task): Promise<Task> {
    task.status = 'in_progress';
    task.updatedAt = new Date().toISOString();
    
    try {
      switch (task.type) {
        case 'code':
          task.result = await this.generateCode(task);
          break;
        default:
          throw new Error(`Unsupported task type: ${task.type}`);
      }
      
      task.status = 'completed';
      return task;
    } catch (error) {
      task.status = 'failed';
      task.result = { error: error instanceof Error ? error.message : 'Unknown error' };
      return task;
    }
  }
  
  private async handleCodeRequest(
    message: AgentMessage,
    context: any
  ): Promise<AgentMessage> {
    const code = await this.generateCodeFromRequest(message.content, context);
    
    return {
      id: crypto.randomUUID(),
      from: this.id,
      to: message.from,
      type: 'response',
      content: code,
      priority: message.priority,
      timestamp: new Date().toISOString(),
      projectId: message.projectId,
      conversationId: message.conversationId,
    };
  }
  
  private async generateCode(task: Task): Promise<any> {
    // Implementation for code generation
    return {
      files: [],
      tests: [],
      documentation: ''
    };
  }
  
  private async generateCodeFromRequest(query: string, context: any): Promise<string> {
    // In a real implementation, this would call the LLM with the system prompt
    return `// Generated code based on your request\n// ${query}\n\nfunction implementFeature() {\n  // Implementation here\n}`;
  }
}

// Reviewer Agent - Reviews code and provides feedback
export class ReviewerAgent extends BaseAgent {
  constructor(id: string) {
    super(id, 'reviewer', 'Code Reviewer', [
      'code_review',
      'quality_analysis',
      'security_review',
      'performance_analysis',
      'best_practices'
    ]);
  }
  
  getSystemPrompt(): string {
    return `You are a Senior Code Reviewer AI agent. Your role is to:
    
    1. Review code for quality, security, and performance
    2. Identify bugs, vulnerabilities, and code smells
    3. Suggest improvements and optimizations
    4. Ensure adherence to coding standards
    5. Provide constructive feedback to developers
    
    You are thorough, constructive, and focused on helping improve code quality.
    
    Current project context: ${JSON.stringify(this.context, null, 2)}`;
  }
  
  async processMessage(message: AgentMessage): Promise<AgentMessage | null> {
    const relevantContext = await this.getRelevantContext(message.content);
    
    switch (message.type) {
      case 'request':
        if (message.content.includes('review') || message.content.includes('check')) {
          return await this.handleReviewRequest(message, relevantContext);
        }
        break;
    }
    
    return null;
  }
  
  async executeTask(task: Task): Promise<Task> {
    task.status = 'in_progress';
    task.updatedAt = new Date().toISOString();
    
    try {
      switch (task.type) {
        case 'review':
          task.result = await this.reviewCode(task);
          break;
        default:
          throw new Error(`Unsupported task type: ${task.type}`);
      }
      
      task.status = 'completed';
      return task;
    } catch (error) {
      task.status = 'failed';
      task.result = { error: error instanceof Error ? error.message : 'Unknown error' };
      return task;
    }
  }
  
  private async handleReviewRequest(
    message: AgentMessage,
    context: any
  ): Promise<AgentMessage> {
    const review = await this.performCodeReview(message.content, context);
    
    return {
      id: crypto.randomUUID(),
      from: this.id,
      to: message.from,
      type: 'response',
      content: review,
      priority: message.priority,
      timestamp: new Date().toISOString(),
      projectId: message.projectId,
      conversationId: message.conversationId,
    };
  }
  
  private async reviewCode(task: Task): Promise<any> {
    // Implementation for code review
    return {
      issues: [],
      suggestions: [],
      score: 0,
      summary: ''
    };
  }
  
  private async performCodeReview(code: string, context: any): Promise<string> {
    // In a real implementation, this would call the LLM with the system prompt
    return `Code Review Results:\n\n✅ Overall quality: Good\n⚠️ Suggestions:\n- Consider adding error handling\n- Add unit tests\n- Improve variable naming`;
  }
}

// Multi-Agent System Coordinator
export class MultiAgentSystem {
  private static instance: MultiAgentSystem;
  private agents: Map<string, BaseAgent> = new Map();
  private messageRouter: MessageRouter;
  private taskQueue: Task[] = [];
  private activeConversations: Map<string, Conversation> = new Map();
  
  private constructor() {
    this.messageRouter = new MessageRouter();
    this.initializeDefaultAgents();
  }
  
  public static getInstance(): MultiAgentSystem {
    if (!MultiAgentSystem.instance) {
      MultiAgentSystem.instance = new MultiAgentSystem();
    }
    return MultiAgentSystem.instance;
  }
  
  private initializeDefaultAgents(): void {
    // Initialize default agents
    const architectAgent = new ArchitectAgent('architect-001');
    const developerAgent = new DeveloperAgent('developer-001');
    const reviewerAgent = new ReviewerAgent('reviewer-001');
    
    this.agents.set(architectAgent.getId(), architectAgent);
    this.agents.set(developerAgent.getId(), developerAgent);
    this.agents.set(reviewerAgent.getId(), reviewerAgent);
  }
  
  async initializeProject(projectId: string): Promise<void> {
    // Initialize all agents for the project
    for (const agent of this.agents.values()) {
      await agent.initialize(projectId);
    }
    
    console.log(`Multi-agent system initialized for project ${projectId}`);
  }
  
  async processUserQuery(
    projectId: string,
    query: string,
    conversationId: string
  ): Promise<string> {
    // Determine which agents should handle the query
    const relevantAgents = await this.determineRelevantAgents(query);
    
    // Create conversation if it doesn't exist
    if (!this.activeConversations.has(conversationId)) {
      this.activeConversations.set(conversationId, new Conversation(conversationId, projectId));
    }
    
    const conversation = this.activeConversations.get(conversationId)!;
    
    // Send query to relevant agents
    const responses: string[] = [];
    
    for (const agentId of relevantAgents) {
      const agent = this.agents.get(agentId);
      if (agent) {
        const message: AgentMessage = {
          id: crypto.randomUUID(),
          from: 'user',
          to: agentId,
          type: 'request',
          content: query,
          priority: 'medium',
          timestamp: new Date().toISOString(),
          projectId,
          conversationId,
        };
        
        await agent.receiveMessage(message);
        // In a real implementation, we'd wait for and collect responses
        responses.push(`${agent.getName()}: Processing your request...`);
      }
    }
    
    // Store conversation
    conversation.addMessage('user', query);
    conversation.addMessage('system', responses.join('\n\n'));
    
    return responses.join('\n\n');
  }
  
  async routeMessage(message: AgentMessage): Promise<void> {
    await this.messageRouter.routeMessage(message, this.agents);
  }
  
  private async determineRelevantAgents(query: string): Promise<string[]> {
    const relevantAgents: string[] = [];
    
    // Simple keyword-based routing (in production, use more sophisticated NLP)
    if (query.includes('architecture') || query.includes('design')) {
      relevantAgents.push('architect-001');
    }
    
    if (query.includes('code') || query.includes('implement') || query.includes('function')) {
      relevantAgents.push('developer-001');
    }
    
    if (query.includes('review') || query.includes('check') || query.includes('optimize')) {
      relevantAgents.push('reviewer-001');
    }
    
    // If no specific agents identified, use developer as default
    if (relevantAgents.length === 0) {
      relevantAgents.push('developer-001');
    }
    
    return relevantAgents;
  }
  
  getAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }
  
  getAgent(id: string): BaseAgent | undefined {
    return this.agents.get(id);
  }
}

// Message Router for inter-agent communication
class MessageRouter {
  async routeMessage(message: AgentMessage, agents: Map<string, BaseAgent>): Promise<void> {
    if (message.to) {
      // Direct message to specific agent
      const targetAgent = agents.get(message.to);
      if (targetAgent) {
        await targetAgent.receiveMessage(message);
      }
    } else {
      // Broadcast to all agents
      for (const agent of agents.values()) {
        if (agent.getId() !== message.from) {
          await agent.receiveMessage(message);
        }
      }
    }
  }
}

// Conversation Management
class Conversation {
  private id: string;
  private projectId: string;
  private messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  }> = [];
  private createdAt: string;
  
  constructor(id: string, projectId: string) {
    this.id = id;
    this.projectId = projectId;
    this.createdAt = new Date().toISOString();
  }
  
  addMessage(role: 'user' | 'assistant' | 'system', content: string): void {
    this.messages.push({
      role,
      content,
      timestamp: new Date().toISOString(),
    });
  }
  
  getMessages() {
    return this.messages;
  }
  
  getId(): string {
    return this.id;
  }
  
  getProjectId(): string {
    return this.projectId;
  }
}

export const multiAgentSystem = MultiAgentSystem.getInstance();