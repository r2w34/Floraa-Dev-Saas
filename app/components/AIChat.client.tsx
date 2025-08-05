import { useState, useEffect, useRef } from 'react';
import { useFetcher } from '@remix-run/react';
import { VoiceInterface } from './VoiceInterface.client';
import { classNames } from '~/utils/classNames';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agent?: string;
  actions?: Array<{
    type: string;
    data: any;
  }>;
  metadata?: {
    confidence?: number;
    processingTime?: number;
    model?: string;
  };
}

interface AIAgent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'processing';
  capabilities: string[];
}

interface AIChatProps {
  projectId?: string;
  onCodeGenerated?: (code: string) => void;
  onFileCreated?: (fileName: string, content: string) => void;
  onNavigate?: (path: string) => void;
}

export function AIChat({ projectId, onCodeGenerated, onFileCreated, onNavigate }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const [activeAgents, setActiveAgents] = useState<AIAgent[]>([]);
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  const [showAgentPanel, setShowAgentPanel] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-3-5-sonnet');
  const [chatMode, setChatMode] = useState<'single' | 'multi-agent'>('multi-agent');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fetcher = useFetcher();
  
  useEffect(() => {
    // Initialize agents
    initializeAgents();
  }, [projectId]);
  
  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    // Handle fetcher response
    if (fetcher.data && fetcher.state === 'idle') {
      handleAIResponse(fetcher.data);
    }
  }, [fetcher.data, fetcher.state]);
  
  const initializeAgents = async () => {
    // Initialize multi-agent system
    const agents: AIAgent[] = [
      {
        id: 'architect-001',
        name: 'System Architect',
        type: 'architect',
        status: 'active',
        capabilities: ['system_design', 'architecture_patterns', 'technology_selection'],
      },
      {
        id: 'developer-001',
        name: 'Senior Developer',
        type: 'developer',
        status: 'active',
        capabilities: ['code_generation', 'implementation', 'debugging'],
      },
      {
        id: 'reviewer-001',
        name: 'Code Reviewer',
        type: 'reviewer',
        status: 'active',
        capabilities: ['code_review', 'quality_analysis', 'best_practices'],
      },
    ];
    
    setActiveAgents(agents);
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: crypto.randomUUID(),
      role: 'system',
      content: `Welcome to Floraa AI! I'm your multi-agent development assistant. ${agents.length} specialized AI agents are ready to help you:

• **${agents[0].name}** - System design and architecture
• **${agents[1].name}** - Code implementation and debugging  
• **${agents[2].name}** - Code review and quality analysis

You can interact with me through text, voice commands, or quick actions. What would you like to build today?`,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([welcomeMessage]);
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    // Update agent statuses
    setActiveAgents(prev => prev.map(agent => ({ ...agent, status: 'processing' })));
    
    // Send to backend
    fetcher.submit(
      {
        message: inputValue.trim(),
        projectId: projectId || 'default',
        conversationId,
        chatMode,
        selectedModel,
      },
      {
        method: 'POST',
        action: '/api/ai/chat',
      }
    );
  };
  
  const handleAIResponse = (data: any) => {
    setIsProcessing(false);
    
    // Update agent statuses
    setActiveAgents(prev => prev.map(agent => ({ ...agent, status: 'idle' })));
    
    if (data.error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I encountered an error: ${data.error}`,
        timestamp: new Date().toISOString(),
        metadata: { confidence: 0 },
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }
    
    // Handle multi-agent responses
    if (data.responses && Array.isArray(data.responses)) {
      const agentMessages = data.responses.map((response: any) => ({
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: response.content,
        timestamp: new Date().toISOString(),
        agent: response.agent,
        actions: response.actions,
        metadata: {
          confidence: response.confidence,
          processingTime: response.processingTime,
          model: response.model,
        },
      }));
      
      setMessages(prev => [...prev, ...agentMessages]);
    } else {
      // Single response
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response || data.content,
        timestamp: new Date().toISOString(),
        actions: data.actions,
        metadata: {
          confidence: data.confidence,
          processingTime: data.processingTime,
          model: data.model,
        },
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }
    
    // Handle actions
    if (data.actions) {
      handleActions(data.actions);
    }
  };
  
  const handleActions = (actions: Array<{ type: string; data: any }>) => {
    actions.forEach(action => {
      switch (action.type) {
        case 'create_file':
          if (onFileCreated) {
            onFileCreated(action.data.fileName, action.data.content);
          }
          break;
        
        case 'open_editor':
        case 'generate_code':
          if (onCodeGenerated) {
            onCodeGenerated(action.data.content || action.data.code);
          }
          break;
        
        case 'navigate':
          if (onNavigate) {
            onNavigate(action.data.target);
          }
          break;
        
        default:
          console.log('Unhandled action:', action);
      }
    });
  };
  
  const handleVoiceCodeGenerated = (code: string) => {
    if (onCodeGenerated) {
      onCodeGenerated(code);
    }
  };
  
  const handleVoiceAction = (action: { type: string; data: any }) => {
    handleActions([action]);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const clearChat = () => {
    setMessages([]);
    initializeAgents();
  };
  
  const exportChat = () => {
    const chatData = {
      conversationId,
      projectId,
      messages,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `floraa-chat-${conversationId.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const quickActions = [
    {
      label: 'Generate Component',
      prompt: 'Create a React component with props and TypeScript',
      icon: 'i-ph:code',
    },
    {
      label: 'Review Code',
      prompt: 'Review the current code for issues and improvements',
      icon: 'i-ph:magnifying-glass',
    },
    {
      label: 'Add Tests',
      prompt: 'Generate unit tests for the current component',
      icon: 'i-ph:test-tube',
    },
    {
      label: 'Explain Code',
      prompt: 'Explain how this code works and its purpose',
      icon: 'i-ph:question',
    },
    {
      label: 'Optimize Performance',
      prompt: 'Analyze and optimize this code for better performance',
      icon: 'i-ph:lightning',
    },
    {
      label: 'Add Documentation',
      prompt: 'Generate comprehensive documentation for this code',
      icon: 'i-ph:file-text',
    },
  ];
  
  return (
    <div className="flex flex-col h-full bg-floraa-elements-bg-depth-1">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-floraa-elements-borderColor bg-floraa-elements-bg-depth-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-purple-500 rounded-lg flex items-center justify-center">
            <div className="i-ph:robot text-white text-xl" />
          </div>
          <div>
            <h2 className="font-semibold text-floraa-elements-textPrimary">Floraa AI Assistant</h2>
            <p className="text-sm text-floraa-elements-textSecondary">
              {chatMode === 'multi-agent' ? `${activeAgents.length} agents active` : 'Single agent mode'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Chat Mode Toggle */}
          <select
            value={chatMode}
            onChange={(e) => setChatMode(e.target.value as 'single' | 'multi-agent')}
            className="px-3 py-1 text-sm border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500"
          >
            <option value="multi-agent">Multi-Agent</option>
            <option value="single">Single Agent</option>
          </select>
          
          {/* Model Selection */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-1 text-sm border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500"
          >
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gemini-pro">Gemini Pro</option>
          </select>
          
          {/* Voice Toggle */}
          <button
            onClick={() => setShowVoiceInterface(!showVoiceInterface)}
            className={classNames(
              'p-2 rounded-lg transition-colors',
              showVoiceInterface
                ? 'bg-accent-100 text-accent-700'
                : 'hover:bg-floraa-elements-bg-depth-3 text-floraa-elements-textSecondary'
            )}
            title="Toggle Voice Interface"
          >
            <div className="i-ph:microphone" />
          </button>
          
          {/* Agent Panel Toggle */}
          <button
            onClick={() => setShowAgentPanel(!showAgentPanel)}
            className={classNames(
              'p-2 rounded-lg transition-colors',
              showAgentPanel
                ? 'bg-accent-100 text-accent-700'
                : 'hover:bg-floraa-elements-bg-depth-3 text-floraa-elements-textSecondary'
            )}
            title="Toggle Agent Panel"
          >
            <div className="i-ph:users" />
          </button>
          
          {/* Export Chat */}
          <button
            onClick={exportChat}
            className="p-2 hover:bg-floraa-elements-bg-depth-3 text-floraa-elements-textSecondary rounded-lg transition-colors"
            title="Export Chat"
          >
            <div className="i-ph:download" />
          </button>
          
          {/* Clear Chat */}
          <button
            onClick={clearChat}
            className="p-2 hover:bg-floraa-elements-bg-depth-3 text-floraa-elements-textSecondary rounded-lg transition-colors"
            title="Clear Chat"
          >
            <div className="i-ph:trash" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Agent Panel */}
        {showAgentPanel && (
          <div className="w-64 border-r border-floraa-elements-borderColor bg-floraa-elements-bg-depth-2 p-4">
            <h3 className="font-medium text-floraa-elements-textPrimary mb-4">Active Agents</h3>
            <div className="space-y-3">
              {activeAgents.map(agent => (
                <div key={agent.id} className="p-3 bg-floraa-elements-bg-depth-1 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-floraa-elements-textPrimary">{agent.name}</span>
                    <div className={classNames(
                      'w-2 h-2 rounded-full',
                      agent.status === 'active' ? 'bg-green-500' :
                      agent.status === 'processing' ? 'bg-yellow-500 animate-pulse' :
                      'bg-gray-400'
                    )} />
                  </div>
                  <p className="text-sm text-floraa-elements-textSecondary mb-2">{agent.type}</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 2).map(capability => (
                      <span
                        key={capability}
                        className="px-2 py-0.5 bg-accent-100 text-accent-700 text-xs rounded-full"
                      >
                        {capability.replace('_', ' ')}
                      </span>
                    ))}
                    {agent.capabilities.length > 2 && (
                      <span className="px-2 py-0.5 bg-floraa-elements-bg-depth-3 text-floraa-elements-textTertiary text-xs rounded-full">
                        +{agent.capabilities.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Voice Interface */}
          {showVoiceInterface && (
            <div className="border-b border-floraa-elements-borderColor">
              <VoiceInterface
                projectId={projectId}
                conversationId={conversationId}
                onCodeGenerated={handleVoiceCodeGenerated}
                onActionTriggered={handleVoiceAction}
              />
            </div>
          )}
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div key={message.id} className="flex gap-3">
                {/* Avatar */}
                <div className={classNames(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  message.role === 'user' ? 'bg-accent-100' :
                  message.role === 'system' ? 'bg-purple-100' :
                  'bg-green-100'
                )}>
                  <div className={classNames(
                    'text-sm',
                    message.role === 'user' ? 'i-ph:user text-accent-600' :
                    message.role === 'system' ? 'i-ph:info text-purple-600' :
                    'i-ph:robot text-green-600'
                  )} />
                </div>
                
                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-floraa-elements-textPrimary">
                      {message.role === 'user' ? 'You' :
                       message.agent ? message.agent :
                       message.role === 'system' ? 'System' : 'Floraa AI'}
                    </span>
                    <span className="text-xs text-floraa-elements-textTertiary">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                    {message.metadata?.confidence && (
                      <span className="text-xs text-floraa-elements-textTertiary">
                        {Math.round(message.metadata.confidence * 100)}% confidence
                      </span>
                    )}
                  </div>
                  
                  <div className="prose prose-sm max-w-none text-floraa-elements-textSecondary">
                    {message.content.split('\n').map((line, index) => (
                      <p key={index} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>
                  
                  {/* Actions */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.actions.map((action, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {action.type.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="i-ph:robot text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-floraa-elements-textPrimary">Floraa AI</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                  <p className="text-floraa-elements-textSecondary">
                    {chatMode === 'multi-agent' ? 'Agents are collaborating on your request...' : 'Thinking...'}
                  </p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="p-4 border-t border-floraa-elements-borderColor">
              <p className="text-sm text-floraa-elements-textSecondary mb-3">Quick actions to get started:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {quickActions.map(action => (
                  <button
                    key={action.label}
                    onClick={() => setInputValue(action.prompt)}
                    className="flex items-center gap-2 p-3 text-left bg-floraa-elements-bg-depth-2 hover:bg-floraa-elements-bg-depth-3 rounded-lg transition-colors"
                  >
                    <div className={`${action.icon} text-accent-600`} />
                    <span className="text-sm text-floraa-elements-textPrimary">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input Area */}
          <div className="p-4 border-t border-floraa-elements-borderColor">
            <div className="flex gap-3">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about your code, or describe what you'd like to build..."
                  className="block w-full px-4 py-3 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-2 text-floraa-elements-textPrimary placeholder-floraa-elements-textTertiary focus:ring-2 focus:ring-accent-500 focus:border-accent-500 resize-none"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isProcessing}
                className={classNames(
                  'px-4 py-3 rounded-lg font-medium transition-colors',
                  inputValue.trim() && !isProcessing
                    ? 'bg-accent-600 hover:bg-accent-700 text-white'
                    : 'bg-floraa-elements-bg-depth-3 text-floraa-elements-textTertiary cursor-not-allowed'
                )}
              >
                <div className="i-ph:paper-plane-right" />
              </button>
            </div>
            
            <div className="mt-2 text-xs text-floraa-elements-textTertiary text-center">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}