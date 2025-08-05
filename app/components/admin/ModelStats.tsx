interface ModelStatsProps {
  stats: {
    totalModels: number;
    activeModels: number;
    totalUsage: number;
    totalRevenue: number;
  };
}

export function ModelStats({ stats }: ModelStatsProps) {
  const statCards = [
    {
      name: 'Total Models',
      value: stats.totalModels.toString(),
      icon: 'i-ph:cpu-duotone',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Active Models',
      value: stats.activeModels.toString(),
      icon: 'i-ph:check-circle-duotone',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Total Usage',
      value: stats.totalUsage.toLocaleString(),
      icon: 'i-ph:chart-line-duotone',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: 'i-ph:money-duotone',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div
          key={stat.name}
          className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl p-6"
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
        </div>
      ))}
    </div>
  );
}