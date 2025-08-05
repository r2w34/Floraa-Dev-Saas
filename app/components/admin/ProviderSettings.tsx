import { useState } from 'react';
import { classNames } from '~/utils/classNames';

interface Provider {
  id: string;
  name: string;
  status: string;
  apiKeyConfigured: boolean;
  modelsCount: number;
  totalUsage: number;
}

interface ProviderSettingsProps {
  providers: Provider[];
}

export function ProviderSettings({ providers }: ProviderSettingsProps) {
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-50';
      case 'disabled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getProviderIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'openai':
        return 'i-ph:robot-duotone';
      case 'anthropic':
        return 'i-ph:brain-duotone';
      case 'google':
        return 'i-ph:google-logo-duotone';
      default:
        return 'i-ph:cpu-duotone';
    }
  };

  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-floraa-elements-borderColor">
        <h3 className="text-lg font-semibold text-floraa-elements-textPrimary">Providers</h3>
      </div>

      <div className="divide-y divide-floraa-elements-borderColor">
        {providers.map((provider) => (
          <div key={provider.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-floraa-elements-bg-depth-3 rounded-lg flex items-center justify-center">
                  <div className={`${getProviderIcon(provider.name)} text-lg text-floraa-elements-textSecondary`} />
                </div>
                <div>
                  <div className="font-medium text-floraa-elements-textPrimary">
                    {provider.name}
                  </div>
                  <div className="text-sm text-floraa-elements-textSecondary">
                    {provider.modelsCount} models • {provider.totalUsage.toLocaleString()} calls
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(provider.status)}`}>
                  {provider.status}
                </span>
                <button
                  onClick={() => setExpandedProvider(
                    expandedProvider === provider.id ? null : provider.id
                  )}
                  className="text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary transition-colors"
                >
                  <div className={classNames(
                    'i-ph:caret-down text-lg transition-transform',
                    expandedProvider === provider.id ? 'rotate-180' : ''
                  )} />
                </button>
              </div>
            </div>

            {expandedProvider === provider.id && (
              <div className="mt-4 pt-4 border-t border-floraa-elements-borderColor space-y-4">
                <div>
                  <label className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
                    API Key
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={provider.apiKeyConfigured ? '••••••••••••••••' : ''}
                      placeholder="Enter API key..."
                      className="flex-1 px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary placeholder-floraa-elements-textTertiary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    />
                    <button className="bg-accent-600 hover:bg-accent-700 text-white px-3 py-2 rounded-lg font-medium transition-colors">
                      Save
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={classNames(
                      'w-2 h-2 rounded-full',
                      provider.apiKeyConfigured ? 'bg-green-500' : 'bg-red-500'
                    )} />
                    <span className="text-xs text-floraa-elements-textSecondary">
                      {provider.apiKeyConfigured ? 'API key configured' : 'API key not configured'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-floraa-elements-textSecondary">
                    Provider Status
                  </span>
                  <select
                    value={provider.status}
                    className="px-3 py-1 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary text-sm focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  >
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button className="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors">
                    Test Connection
                  </button>
                  <button className="text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary text-sm font-medium transition-colors">
                    View Models
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}