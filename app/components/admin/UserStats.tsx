interface UserStatsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    suspendedUsers: number;
    newUsersThisMonth: number;
  };
}

export function UserStats({ stats }: UserStatsProps) {
  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: 'i-ph:users-duotone',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: 'i-ph:user-check-duotone',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Suspended Users',
      value: stats.suspendedUsers.toLocaleString(),
      icon: 'i-ph:user-minus-duotone',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      name: 'New This Month',
      value: stats.newUsersThisMonth.toLocaleString(),
      icon: 'i-ph:user-plus-duotone',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
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