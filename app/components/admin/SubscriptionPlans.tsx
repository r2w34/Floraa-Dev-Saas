interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: string;
  subscribers: number;
  revenue: number;
  features: string[];
}

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
}

export function SubscriptionPlans({ plans }: SubscriptionPlansProps) {
  const getPlanColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'free':
        return 'text-gray-600 bg-gray-50';
      case 'pro':
        return 'text-blue-600 bg-blue-50';
      case 'enterprise':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-floraa-elements-borderColor">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-floraa-elements-textPrimary">Subscription Plans</h3>
          <button className="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors">
            Edit Plans
          </button>
        </div>
      </div>

      <div className="divide-y divide-floraa-elements-borderColor">
        {plans.map((plan) => (
          <div key={plan.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(plan.name)}`}>
                    {plan.name}
                  </span>
                  <div className="text-lg font-bold text-floraa-elements-textPrimary">
                    ${plan.price}
                    <span className="text-sm font-normal text-floraa-elements-textSecondary">
                      /{plan.interval}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-floraa-elements-textSecondary">Subscribers</div>
                    <div className="text-lg font-semibold text-floraa-elements-textPrimary">
                      {plan.subscribers.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-floraa-elements-textSecondary">Revenue</div>
                    <div className="text-lg font-semibold text-floraa-elements-textPrimary">
                      ${plan.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-floraa-elements-textSecondary mb-2">Features</div>
                  <div className="flex flex-wrap gap-1">
                    {plan.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-floraa-elements-bg-depth-3 text-floraa-elements-textSecondary"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button className="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors">
                  Edit
                </button>
                <button className="text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary transition-colors">
                  <div className="i-ph:dots-three-vertical text-lg" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-floraa-elements-borderColor">
        <button className="w-full border-2 border-dashed border-floraa-elements-borderColor hover:border-accent-300 text-floraa-elements-textSecondary hover:text-accent-600 py-3 rounded-lg font-medium transition-colors">
          + Add New Plan
        </button>
      </div>
    </div>
  );
}