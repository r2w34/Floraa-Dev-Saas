import { z } from 'zod';

// Context Schema for type safety and validation
export const ProjectContextSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  
  // Project Architecture
  architecture: z.object({
    type: z.enum(['monolith', 'microservices', 'serverless', 'jamstack']),
    framework: z.string(),
    database: z.string(),
    deployment: z.string(),
    patterns: z.array(z.string()),
  }),
  
  // Technical Stack
  techStack: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    database: z.array(z.string()),
    infrastructure: z.array(z.string()),
    tools: z.array(z.string()),
  }),
  
  // Business Context
  business: z.object({
    goals: z.array(z.string()),
    targetAudience: z.string(),
    budget: z.number().optional(),
    timeline: z.string().optional(),
    constraints: z.array(z.string()),
  }),
  
  // Development Context
  development: z.object({
    phase: z.enum(['planning', 'development', 'testing', 'deployment', 'maintenance']),
    currentFeatures: z.array(z.string()),
    completedFeatures: z.array(z.string()),
    nextFeatures: z.array(z.string()),
    blockers: z.array(z.string()),
  }),
  
  // Team Context
  team: z.object({
    members: z.array(z.object({
      id: z.string(),
      name: z.string(),
      role: z.string(),
      skills: z.array(z.string()),
      preferences: z.record(z.any()),
    })),
    workingHours: z.string(),
    timezone: z.string(),
    communicationStyle: z.string(),
  }),
  
  // AI Context
  ai: z.object({
    preferences: z.record(z.any()),
    learnings: z.array(z.object({
      timestamp: z.string(),
      context: z.string(),
      decision: z.string(),
      outcome: z.string(),
    })),
    patterns: z.array(z.object({
      pattern: z.string(),
      frequency: z.number(),
      success_rate: z.number(),
    })),
  }),
  
  // Version Control
  version: z.object({
    current: z.string(),
    history: z.array(z.object({
      version: z.string(),
      timestamp: z.string(),
      changes: z.array(z.string()),
      author: z.string(),
    })),
  }),
  
  // Metadata
  metadata: z.object({
    created_at: z.string(),
    updated_at: z.string(),
    last_accessed: z.string(),
    access_count: z.number(),
  }),
});

export type ProjectContext = z.infer<typeof ProjectContextSchema>;

// Memory Types for different contexts
export interface ConversationMemory {
  id: string;
  projectId: string;
  agentId: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    context: Record<string, any>;
    embeddings?: number[];
  }>;
  summary: string;
  keyDecisions: Array<{
    decision: string;
    reasoning: string;
    timestamp: string;
    impact: 'low' | 'medium' | 'high';
  }>;
}

export interface CodeMemory {
  id: string;
  projectId: string;
  filePath: string;
  content: string;
  purpose: string;
  dependencies: string[];
  relatedFiles: string[];
  lastModified: string;
  modificationReason: string;
  embeddings?: number[];
}

export interface DecisionMemory {
  id: string;
  projectId: string;
  decision: string;
  reasoning: string;
  alternatives: string[];
  consequences: string[];
  timestamp: string;
  author: string;
  status: 'active' | 'deprecated' | 'changed';
  relatedDecisions: string[];
}

// Advanced Context Manager with Vector Database Integration
export class ContextManager {
  private static instance: ContextManager;
  private vectorDB: VectorDatabase;
  private graphDB: GraphDatabase;
  private cache: Map<string, ProjectContext> = new Map();
  
  private constructor() {
    this.vectorDB = new VectorDatabase();
    this.graphDB = new GraphDatabase();
  }
  
  public static getInstance(): ContextManager {
    if (!ContextManager.instance) {
      ContextManager.instance = new ContextManager();
    }
    return ContextManager.instance;
  }
  
  // Store and retrieve project context with embeddings
  async storeProjectContext(context: ProjectContext): Promise<void> {
    try {
      // Validate context
      const validatedContext = ProjectContextSchema.parse(context);
      
      // Generate embeddings for semantic search
      const embeddings = await this.generateEmbeddings(
        JSON.stringify(validatedContext)
      );
      
      // Store in vector database for semantic search
      await this.vectorDB.store({
        id: validatedContext.id,
        content: validatedContext,
        embeddings,
        metadata: {
          type: 'project_context',
          projectId: validatedContext.id,
          timestamp: new Date().toISOString(),
        },
      });
      
      // Store relationships in graph database
      await this.graphDB.storeProjectRelationships(validatedContext);
      
      // Cache for quick access
      this.cache.set(validatedContext.id, validatedContext);
      
      console.log(`Project context stored for ${validatedContext.name}`);
    } catch (error) {
      console.error('Failed to store project context:', error);
      throw error;
    }
  }
  
  // Retrieve project context with semantic enhancement
  async getProjectContext(projectId: string): Promise<ProjectContext | null> {
    try {
      // Check cache first
      if (this.cache.has(projectId)) {
        return this.cache.get(projectId)!;
      }
      
      // Retrieve from vector database
      const result = await this.vectorDB.retrieve(projectId);
      if (result) {
        const context = result.content as ProjectContext;
        this.cache.set(projectId, context);
        return context;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to retrieve project context:', error);
      return null;
    }
  }
  
  // Store conversation memory with semantic indexing
  async storeConversationMemory(memory: ConversationMemory): Promise<void> {
    try {
      // Generate embeddings for each message
      for (const message of memory.messages) {
        if (!message.embeddings) {
          message.embeddings = await this.generateEmbeddings(message.content);
        }
      }
      
      // Store in vector database
      await this.vectorDB.store({
        id: memory.id,
        content: memory,
        embeddings: await this.generateEmbeddings(memory.summary),
        metadata: {
          type: 'conversation_memory',
          projectId: memory.projectId,
          agentId: memory.agentId,
          timestamp: new Date().toISOString(),
        },
      });
      
      console.log(`Conversation memory stored for project ${memory.projectId}`);
    } catch (error) {
      console.error('Failed to store conversation memory:', error);
      throw error;
    }
  }
  
  // Semantic search across all project memories
  async semanticSearch(
    projectId: string,
    query: string,
    limit: number = 10
  ): Promise<Array<{
    content: any;
    similarity: number;
    type: string;
  }>> {
    try {
      const queryEmbeddings = await this.generateEmbeddings(query);
      
      const results = await this.vectorDB.search({
        embeddings: queryEmbeddings,
        filter: { projectId },
        limit,
      });
      
      return results.map(result => ({
        content: result.content,
        similarity: result.similarity,
        type: result.metadata.type,
      }));
    } catch (error) {
      console.error('Semantic search failed:', error);
      return [];
    }
  }
  
  // Get relevant context for AI agents
  async getRelevantContext(
    projectId: string,
    query: string,
    agentType: string
  ): Promise<{
    projectContext: ProjectContext | null;
    relevantMemories: any[];
    relatedDecisions: DecisionMemory[];
    codeContext: CodeMemory[];
  }> {
    try {
      // Get project context
      const projectContext = await this.getProjectContext(projectId);
      
      // Semantic search for relevant memories
      const relevantMemories = await this.semanticSearch(projectId, query, 5);
      
      // Get related decisions
      const relatedDecisions = await this.getRelatedDecisions(projectId, query);
      
      // Get relevant code context
      const codeContext = await this.getRelevantCodeContext(projectId, query);
      
      return {
        projectContext,
        relevantMemories,
        relatedDecisions,
        codeContext,
      };
    } catch (error) {
      console.error('Failed to get relevant context:', error);
      return {
        projectContext: null,
        relevantMemories: [],
        relatedDecisions: [],
        codeContext: [],
      };
    }
  }
  
  // Update project context incrementally
  async updateProjectContext(
    projectId: string,
    updates: Partial<ProjectContext>
  ): Promise<void> {
    try {
      const currentContext = await this.getProjectContext(projectId);
      if (!currentContext) {
        throw new Error(`Project context not found: ${projectId}`);
      }
      
      // Merge updates with current context
      const updatedContext = {
        ...currentContext,
        ...updates,
        metadata: {
          ...currentContext.metadata,
          updated_at: new Date().toISOString(),
          access_count: currentContext.metadata.access_count + 1,
        },
      };
      
      // Store updated context
      await this.storeProjectContext(updatedContext);
      
      console.log(`Project context updated for ${projectId}`);
    } catch (error) {
      console.error('Failed to update project context:', error);
      throw error;
    }
  }
  
  // Learn from interactions and update patterns
  async learnFromInteraction(
    projectId: string,
    interaction: {
      query: string;
      response: string;
      outcome: 'success' | 'failure' | 'partial';
      feedback?: string;
    }
  ): Promise<void> {
    try {
      const context = await this.getProjectContext(projectId);
      if (!context) return;
      
      // Add learning to AI context
      const learning = {
        timestamp: new Date().toISOString(),
        context: interaction.query,
        decision: interaction.response,
        outcome: interaction.outcome,
      };
      
      context.ai.learnings.push(learning);
      
      // Update patterns based on success/failure
      await this.updatePatterns(projectId, interaction);
      
      // Store updated context
      await this.storeProjectContext(context);
      
      console.log(`Learning stored for project ${projectId}`);
    } catch (error) {
      console.error('Failed to learn from interaction:', error);
    }
  }
  
  // Private helper methods
  private async generateEmbeddings(text: string): Promise<number[]> {
    // In a real implementation, this would use OpenAI embeddings or similar
    // For now, return a mock embedding
    return new Array(1536).fill(0).map(() => Math.random());
  }
  
  private async getRelatedDecisions(
    projectId: string,
    query: string
  ): Promise<DecisionMemory[]> {
    // Implementation for retrieving related decisions
    return [];
  }
  
  private async getRelevantCodeContext(
    projectId: string,
    query: string
  ): Promise<CodeMemory[]> {
    // Implementation for retrieving relevant code context
    return [];
  }
  
  private async updatePatterns(
    projectId: string,
    interaction: any
  ): Promise<void> {
    // Implementation for updating learned patterns
  }
}

// Vector Database Interface
class VectorDatabase {
  async store(data: {
    id: string;
    content: any;
    embeddings: number[];
    metadata: Record<string, any>;
  }): Promise<void> {
    // Implementation for storing in vector database (Pinecone, Weaviate, etc.)
  }
  
  async retrieve(id: string): Promise<any> {
    // Implementation for retrieving by ID
    return null;
  }
  
  async search(params: {
    embeddings: number[];
    filter?: Record<string, any>;
    limit: number;
  }): Promise<Array<{
    content: any;
    similarity: number;
    metadata: Record<string, any>;
  }>> {
    // Implementation for semantic search
    return [];
  }
}

// Graph Database Interface
class GraphDatabase {
  async storeProjectRelationships(context: ProjectContext): Promise<void> {
    // Implementation for storing relationships in graph database (Neo4j)
  }
}

export const contextManager = ContextManager.getInstance();