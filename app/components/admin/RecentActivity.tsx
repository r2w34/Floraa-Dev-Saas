interface Activity {
  id: number;
  type: string;
  user: string;
  plan?: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup':
        return 'i-ph:user-plus-duotone';
      case 'subscription_upgrade':
        return 'i-ph:arrow-up-duotone';
      case 'payment_failed':
        return 'i-ph:warning-duotone';
      case 'subscription_cancelled':
        return 'i-ph:x-circle-duotone';
      default:
        return 'i-ph:info-duotone';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_signup':
        return 'text-green-600 bg-green-50';
      case 'subscription_upgrade':
        return 'text-blue-600 bg-blue-50';
      case 'payment_failed':
        return 'text-red-600 bg-red-50';
      case 'subscription_cancelled':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'user_signup':
        return `New user signed up: ${activity.user}`;
      case 'subscription_upgrade':
        return `${activity.user} upgraded to ${activity.plan} plan`;
      case 'payment_failed':
        return `Payment failed for ${activity.user}`;
      case 'subscription_cancelled':
        return `${activity.user} cancelled subscription`;
      default:
        return `Activity for ${activity.user}`;
    }
  };

  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-floraa-elements-textPrimary">
          Recent Activity
        </h3>
        <button className="text-sm text-accent-600 hover:text-accent-700 font-medium">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
              <div className={`${getActivityIcon(activity.type)} text-sm`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-floraa-elements-textPrimary">
                {getActivityText(activity)}
              </p>
              <p className="text-xs text-floraa-elements-textSecondary mt-1">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <div className="i-ph:activity text-4xl text-floraa-elements-textTertiary mb-2" />
          <p className="text-floraa-elements-textSecondary">No recent activity</p>
        </div>
      )}
    </div>
  );
}