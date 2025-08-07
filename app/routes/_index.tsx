import { json, type MetaFunction } from '@remix-run/cloudflare';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Floraa.dev - AI-Powered Web Development Platform' }, 
    { name: 'description', content: 'Build web applications with AI-powered multi-agent assistance. Code, design, deploy, and optimize with intelligent agents.' }
  ];
};

export const loader = () => json({});

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🌟 Floraa.dev
            </h1>
            <nav className="flex space-x-6">
              <Link to="/admin" className="hover:text-purple-400 transition-colors">Admin</Link>
              <Link to="/chat" className="hover:text-purple-400 transition-colors">Chat</Link>
              <Link to="/docs" className="hover:text-purple-400 transition-colors">Docs</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🚀 Revolutionary AI Development
          </h1>
          <p className="text-2xl mb-12 text-gray-300 max-w-4xl mx-auto">
            The world's first AI platform with persistent memory, multi-agent collaboration, 
            and voice-to-code interface. Never lose context again.
          </p>
          
          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold mb-3">Multi-Agent AI</h3>
              <p className="text-gray-300 text-sm">
                Specialized AI agents collaborate: Architect, Developer, Reviewer, Security, DevOps
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300">
              <div className="text-4xl mb-4">💾</div>
              <h3 className="text-xl font-semibold mb-3">Persistent Memory</h3>
              <p className="text-gray-300 text-sm">
                Never forgets your project decisions, architecture, and context across sessions
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-xl font-semibold mb-3">Voice-to-Code</h3>
              <p className="text-gray-300 text-sm">
                Speak naturally to create applications - no typing required
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all duration-300">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold mb-3">Enterprise Ready</h3>
              <p className="text-gray-300 text-sm">
                Complete admin panel, security, monitoring, and team collaboration
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center space-x-6 mb-16">
            <Link 
              to="/chat/new" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
            >
              🚀 Start Building
            </Link>
            <Link 
              to="/admin" 
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
            >
              ⚙️ Admin Panel
            </Link>
            <Link 
              to="/demo" 
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
            >
              🎮 Live Demo
            </Link>
          </div>

          {/* Platform Status */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-6">🔥 Platform Status</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">50+</div>
                <div className="text-sm text-gray-400">React Components</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">5</div>
                <div className="text-sm text-gray-400">AI Agents</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">20+</div>
                <div className="text-sm text-gray-400">Admin Components</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">∞</div>
                <div className="text-sm text-gray-400">Context Memory</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-400">
            <p>© 2024 Floraa.dev - Revolutionary AI Development Platform</p>
            <p className="text-sm mt-2">Built with ❤️ using Multi-Agent AI Technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
