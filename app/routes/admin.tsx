import { json, type MetaFunction } from '@remix-run/cloudflare';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Admin Panel - Floraa.dev' }, 
    { name: 'description', content: 'Administrative dashboard for Floraa.dev AI development platform' }
  ];
};

export const loader = () => json({});

export default function Admin() {
  const adminStats = {
    totalUsers: 1247,
    activeProjects: 89,
    aiAgentsActive: 5,
    systemUptime: '99.9%',
    totalRequests: 45678,
    successRate: '98.7%'
  };

  const recentActivity = [
    { id: 1, action: 'New user registered', user: 'john.doe@example.com', time: '2 minutes ago' },
    { id: 2, action: 'Project deployed', user: 'jane.smith@example.com', time: '5 minutes ago' },
    { id: 3, action: 'AI Agent completed task', user: 'System', time: '8 minutes ago' },
    { id: 4, action: 'Security scan completed', user: 'Security Agent', time: '12 minutes ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                🌟 Floraa.dev
              </Link>
              <span className="text-gray-400">|</span>
              <h2 className="text-xl font-semibold">Admin Panel</h2>
            </div>
            <nav className="flex space-x-6">
              <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
              <Link to="/chat" className="hover:text-purple-400 transition-colors">Chat</Link>
              <Link to="/docs" className="hover:text-purple-400 transition-colors">Docs</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            🛠️ System Dashboard
          </h1>
          <p className="text-gray-300">Monitor and manage your Floraa.dev platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Users</h3>
              <div className="text-2xl">👥</div>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-2">{adminStats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-400">+12% from last month</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Projects</h3>
              <div className="text-2xl">🚀</div>
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-2">{adminStats.activeProjects}</div>
            <div className="text-sm text-gray-400">Currently in development</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">AI Agents</h3>
              <div className="text-2xl">🤖</div>
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-2">{adminStats.aiAgentsActive}</div>
            <div className="text-sm text-gray-400">All systems operational</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">System Uptime</h3>
              <div className="text-2xl">⚡</div>
            </div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">{adminStats.systemUptime}</div>
            <div className="text-sm text-gray-400">Last 30 days</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Requests</h3>
              <div className="text-2xl">📊</div>
            </div>
            <div className="text-3xl font-bold text-cyan-400 mb-2">{adminStats.totalRequests.toLocaleString()}</div>
            <div className="text-sm text-gray-400">This month</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Success Rate</h3>
              <div className="text-2xl">✅</div>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-2">{adminStats.successRate}</div>
            <div className="text-sm text-gray-400">API response success</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <span className="mr-2">📋</span>
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    <div className="text-sm text-gray-400">{activity.user}</div>
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <span className="mr-2">🔧</span>
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <span>API Gateway</span>
                </div>
                <span className="text-green-400 text-sm">Operational</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <span>AI Agents</span>
                </div>
                <span className="text-green-400 text-sm">All Active</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <span>Database</span>
                </div>
                <span className="text-green-400 text-sm">Connected</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                  <span>GitHub Integration</span>
                </div>
                <span className="text-yellow-400 text-sm">Demo Mode</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                  <span>AI Providers</span>
                </div>
                <span className="text-yellow-400 text-sm">Demo Keys</span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="mt-8 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <span className="mr-2">⚙️</span>
            Quick Actions
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
              🔄 Restart Services
            </button>
            <button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
              📊 View Analytics
            </button>
            <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
              🔐 Security Scan
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
              🤖 Manage Agents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}