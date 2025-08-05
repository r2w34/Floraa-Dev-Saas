import { Form } from '@remix-run/react';

interface FeatureFlagsProps {
  features: {
    multiAgentSystem: boolean;
    gitIntegration: boolean;
    dockerSupport: boolean;
    teamCollaboration: boolean;
    whiteLabeling: boolean;
    customModels: boolean;
    advancedAnalytics: boolean;
    apiAccess: boolean;
  };
}

export function FeatureFlags({ features }: FeatureFlagsProps) {
  const featureList = [
    {
      key: 'multiAgentSystem',
      name: 'Multi-Agent System',
      description: 'Enable specialized AI agents for different tasks',
      enabled: features.multiAgentSystem,
      category: 'core',
    },
    {
      key: 'gitIntegration',
      name: 'Git Integration',
      description: 'Allow users to connect and sync with Git repositories',
      enabled: features.gitIntegration,
      category: 'core',
    },
    {
      key: 'dockerSupport',
      name: 'Docker Support',
      description: 'Enable Docker container support for projects',
      enabled: features.dockerSupport,
      category: 'core',
    },
    {
      key: 'teamCollaboration',
      name: 'Team Collaboration',
      description: 'Allow multiple users to collaborate on projects',
      enabled: features.teamCollaboration,
      category: 'premium',
    },
    {
      key: 'whiteLabeling',
      name: 'White Labeling',
      description: 'Allow enterprise customers to customize branding',
      enabled: features.whiteLabeling,
      category: 'enterprise',
    },
    {
      key: 'customModels',
      name: 'Custom Models',
      description: 'Allow users to add their own AI models',
      enabled: features.customModels,
      category: 'enterprise',
    },
    {
      key: 'advancedAnalytics',
      name: 'Advanced Analytics',
      description: 'Detailed usage analytics and reporting',
      enabled: features.advancedAnalytics,
      category: 'premium',
    },
    {
      key: 'apiAccess',
      name: 'API Access',
      description: 'Programmatic access to Floraa services',
      enabled: features.apiAccess,
      category: 'premium',
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core':
        return 'bg-blue-50 text-blue-700';
      case 'premium':
        return 'bg-purple-50 text-purple-700';
      case 'enterprise':
        return 'bg-orange-50 text-orange-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-floraa-elements-borderColor">
        <h3 className="text-lg font-semibold text-floraa-elements-textPrimary">Feature Flags</h3>
        <p className="text-sm text-floraa-elements-textSecondary mt-1">
          Control which features are available to users
        </p>
      </div>

      <Form method="post" className="p-6 space-y-4">
        {featureList.map((feature) => (
          <div key={feature.key} className="flex items-start justify-between p-4 bg-floraa-elements-bg-depth-1 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-sm font-medium text-floraa-elements-textPrimary">
                  {feature.name}
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(feature.category)}`}>
                  {feature.category}
                </span>
              </div>
              <div className="text-sm text-floraa-elements-textSecondary">
                {feature.description}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                name={feature.key}
                defaultChecked={feature.enabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-floraa-elements-bg-depth-3 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
            </label>
          </div>
        ))}

        <div className="flex items-center gap-3 pt-4 border-t border-floraa-elements-borderColor">
          <button
            type="submit"
            className="bg-accent-600 hover:bg-accent-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Save Changes
          </button>
          <button
            type="button"
            className="border border-floraa-elements-borderColor hover:bg-floraa-elements-bg-depth-3 text-floraa-elements-textSecondary px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Reset
          </button>
        </div>
      </Form>
    </div>
  );
}