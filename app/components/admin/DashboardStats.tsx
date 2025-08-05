interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    totalConversations: number;
    systemUptime: number;
    activeAgents: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: 'i-ph:users-duotone',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Active Subscriptions',
      value: stats.activeSubscriptions.toLocaleString(),
      icon: 'i-ph:credit-card-duotone',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      name: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: 'i-ph:money-duotone',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+23%',
      changeType: 'positive' as const,
    },
    {
      name: 'Total Conversations',
      value: stats.totalConversations.toLocaleString(),
      icon: 'i-ph:chat-circle-duotone',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      name: 'System Uptime',
      value: `${stats.systemUptime}%`,
      icon: 'i-ph:activity-duotone',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: '+0.1%',
      changeType: 'positive' as const,
    },
    {
      name: 'Active Agents',
      value: stats.activeAgents.toString(),
      icon: 'i-ph:robot-duotone',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      change: '0%',
      changeType: 'neutral' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat) => (
        <div
          key={stat.name}
          className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-floraa-elements-textSecondary">
                {stat.name}
              </p>
              <p className="text-2xl font-bold text-floraa-elements-textPrimary mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <div className={`${stat.icon} text-xl ${stat.color}`} />
            </div>
          </div>
          
          <div className="mt-4 flex items-center">
            <span
              className={`text-sm font-medium ${
                stat.changeType === 'positive'
                  ? 'text-green-600'
                  : stat.changeType === 'negative'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {stat.change}
            </span>
            <span className="text-sm text-floraa-elements-textSecondary ml-2">
              from last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}