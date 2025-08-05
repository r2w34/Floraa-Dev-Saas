interface BillingStatsProps {
  stats: {
    totalRevenue: number;
    monthlyRecurring: number;
    activeSubscriptions: number;
    churnRate: number;
  };
}

export function BillingStats({ stats }: BillingStatsProps) {
  const statCards = [
    {
      name: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: 'i-ph:money-duotone',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+12.5%',
      changeType: 'positive' as const,
    },
    {
      name: 'Monthly Recurring Revenue',
      value: `$${stats.monthlyRecurring.toLocaleString()}`,
      icon: 'i-ph:repeat-duotone',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+8.3%',
      changeType: 'positive' as const,
    },
    {
      name: 'Active Subscriptions',
      value: stats.activeSubscriptions.toLocaleString(),
      icon: 'i-ph:credit-card-duotone',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+15.2%',
      changeType: 'positive' as const,
    },
    {
      name: 'Churn Rate',
      value: `${stats.churnRate}%`,
      icon: 'i-ph:trend-down-duotone',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '-0.5%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  : 'text-red-600'
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