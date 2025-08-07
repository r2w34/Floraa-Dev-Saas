import { json, type MetaFunction } from '@remix-run/cloudflare';
import { Link } from '@remix-run/react';
import { useState } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'AI Chat - Floraa.dev' }, 
    { name: 'description', content: 'Multi-agent AI chat interface for Floraa.dev development platform' }
  ];
};

export const loader = () => json({});

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: 'Welcome to Floraa.dev! I\'m your AI development assistant. I have access to multiple specialized agents:',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      type: 'system',
      content: '🧠 **Architect Agent** - System design and architecture\n🛠️ **Developer Agent** - Code generation and implementation\n🔍 **Reviewer Agent** - Code review and quality assurance\n🔐 **Security Agent** - Security analysis\n🚀 **DevOps Agent** - Deployment and infrastructure',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('auto');
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const agents = [
    { id: 'auto', name: 'Auto-Select', icon: '🤖', description: 'Automatically choose the best agent' },
    { id: 'architect', name: 'Architect', icon: '🧠', description: 'System design and architecture' },
    { id: 'developer', name: 'Developer', icon: '🛠️', description: 'Code generation and implementation' },
    { id: 'reviewer', name: 'Reviewer', icon: '🔍', description: 'Code review and quality assurance' },
    { id: 'security', name: 'Security', icon: '🔐', description: 'Security analysis and vulnerability detection' },
    { id: 'devops', name: 'DevOps', icon: '🚀', description: 'Deployment and infrastructure management' }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      agent: selectedAgent,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const selectedAgentInfo = agents.find(a => a.id === selectedAgent);
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: `${selectedAgentInfo?.icon} **${selectedAgentInfo?.name} Agent**: I understand you want to "${inputMessage}". In a production environment, I would analyze this request and provide detailed assistance. Currently running in demo mode with simulated responses.`,
        agent: selectedAgent,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                🌟 Floraa.dev
              </Link>
              <span className="text-gray-400">|</span>
              <h2 className="text-xl font-semibold">Multi-Agent AI Chat</h2>
            </div>
            <nav className="flex space-x-6">
              <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
              <Link to="/admin" className="hover:text-purple-400 transition-colors">Admin</Link>
              <Link to="/docs" className="hover:text-purple-400 transition-colors">Docs</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar - Agent Selection */}
        <div className="w-80 bg-black/20 backdrop-blur-lg border-r border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">🤖</span>
            AI Agents
          </h3>
          
          <div className="space-y-3 mb-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedAgent === agent.id
                    ? 'bg-purple-600/30 border border-purple-400/50'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
                onClick={() => setSelectedAgent(agent.id)}
              >
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-3">{agent.icon}</span>
                  <span className="font-medium">{agent.name}</span>
                </div>
                <p className="text-sm text-gray-400">{agent.description}</p>
              </div>
            ))}
          </div>

          {/* Voice Mode Toggle */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">🎤 Voice Mode</span>
              <button
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  isVoiceMode ? 'bg-purple-600' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  isVoiceMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
            <p className="text-sm text-gray-400">
              {isVoiceMode ? 'Voice-to-code enabled' : 'Text input mode'}
            </p>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-purple-600/30 border border-purple-400/50'
                      : message.type === 'system'
                      ? 'bg-blue-600/20 border border-blue-400/30'
                      : 'bg-white/10 border border-white/20'
                  }`}
                >
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                  />
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isVoiceMode ? "🎤 Speak your request..." : "Type your message..."}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 focus:bg-white/15"
                />
                {isVoiceMode && (
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-300">
                    🎤
                  </button>
                )}
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100"
              >
                Send
              </button>
            </div>
            
            <div className="mt-3 text-sm text-gray-400 text-center">
              Selected Agent: <span className="text-purple-400 font-medium">
                {agents.find(a => a.id === selectedAgent)?.name}
              </span>
              {isVoiceMode && <span className="ml-2">| 🎤 Voice Mode Active</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}