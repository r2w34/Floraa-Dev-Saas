interface SystemHealthProps {
  uptime: number;
}

export function SystemHealth({ uptime }: SystemHealthProps) {
  const healthMetrics = [
    {
      name: 'API Response Time',
      value: '145ms',
      status: 'good',
      icon: 'i-ph:timer-duotone',
    },
    {
      name: 'Database Connections',
      value: '23/100',
      status: 'good',
      icon: 'i-ph:database-duotone',
    },
    {
      name: 'Memory Usage',
      value: '68%',
      status: 'warning',
      icon: 'i-ph:memory-duotone',
    },
    {
      name: 'Active Sessions',
      value: '1,247',
      status: 'good',
      icon: 'i-ph:users-duotone',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'error':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-floraa-elements-textPrimary">
          System Health
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-600 font-medium">
            {uptime}% Uptime
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {healthMetrics.map((metric) => (
          <div key={metric.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getStatusBg(metric.status)}`}>
                <div className={`${metric.icon} text-sm ${getStatusColor(metric.status)}`} />
              </div>
              <span className="text-sm text-floraa-elements-textPrimary">
                {metric.name}
              </span>
            </div>
            <span className={`text-sm font-medium ${getStatusColor(metric.status)}`}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-floraa-elements-borderColor">
        <div className="flex items-center justify-between text-sm">
          <span className="text-floraa-elements-textSecondary">Last updated</span>
          <span className="text-floraa-elements-textPrimary">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}