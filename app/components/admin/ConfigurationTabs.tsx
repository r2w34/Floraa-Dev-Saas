import { useState } from 'react';
import { Form } from '@remix-run/react';
import { classNames } from '~/utils/classNames';
import type { Config } from '~/lib/config/ConfigManager.server';

interface ConfigSection {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface ConfigurationTabsProps {
  config: Config;
  sections: ConfigSection[];
  isSubmitting: boolean;
}

export function ConfigurationTabs({ config, sections, isSubmitting }: ConfigurationTabsProps) {
  const [activeTab, setActiveTab] = useState(sections[0]?.id || 'app');
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleNestedInputChange = (section: string, parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section]?.[parent],
          [field]: value,
        },
      },
    }));
    setHasChanges(true);
  };

  const getCurrentSectionData = (sectionId: string) => {
    return {
      ...config[sectionId as keyof Config],
      ...formData[sectionId],
    };
  };

  const renderAppConfig = () => {
    const data = getCurrentSectionData('app');
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
              Application Name
            </label>
            <input
              type="text"
              value={data.name || ''}
              onChange={(e) => handleInputChange('app', 'name', e.target.value)}
              className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
              Application URL
            </label>
            <input
              type="url"
              value={data.url || ''}
              onChange={(e) => handleInputChange('app', 'url', e.target.value)}
              className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
            Description
          </label>
          <textarea
            rows={3}
            value={data.description || ''}
            onChange={(e) => handleInputChange('app', 'description', e.target.value)}
            className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-floraa-elements-bg-depth-1 rounded-lg">
          <div>
            <div className="text-sm font-medium text-floraa-elements-textPrimary">
              Maintenance Mode
            </div>
            <div className="text-sm text-floraa-elements-textSecondary">
              Temporarily disable the application for maintenance
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.maintenanceMode || false}
              onChange={(e) => handleInputChange('app', 'maintenanceMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-floraa-elements-bg-depth-3 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
          </label>
        </div>

        {data.maintenanceMode && (
          <div>
            <label className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
              Maintenance Message
            </label>
            <textarea
              rows={2}
              value={data.maintenanceMessage || ''}
              onChange={(e) => handleInputChange('app', 'maintenanceMessage', e.target.value)}
              className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>
        )}
      </div>
    );
  };

  const renderAuthConfig = () => {
    const data = getCurrentSectionData('auth');
    
    return (
      <div className="space-y-6">
        <div className="bg-floraa-elements-bg-depth-1 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-floraa-elements-textPrimary mb-4">
            GitHub OAuth
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
                Client ID
              </label>
              <input
                type="text"
                value={data.github?.clientId || ''}
                onChange={(e) => handleNestedInputChange('auth', 'github', 'clientId', e.target.value)}
                className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-2 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
                Client Secret
              </label>
              <input
                type="password"
                value={data.github?.clientSecret || ''}
                onChange={(e) => handleNestedInputChange('auth', 'github', 'clientSecret', e.target.value)}
                className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-2 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
              Callback URL
            </label>
            <input
              type="url"
              value={data.github?.callbackUrl || ''}
              onChange={(e) => handleNestedInputChange('auth', 'github', 'callbackUrl', e.target.value)}
              className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-2 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-floraa-elements-textPrimary">
                Enable GitHub Authentication
              </div>
              <div className="text-sm text-floraa-elements-textSecondary">
                Allow users to sign in with GitHub
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.github?.enabled || false}
                onChange={(e) => handleNestedInputChange('auth', 'github', 'enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-floraa-elements-bg-depth-3 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
            </label>
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors"
            >
              Test GitHub Connection
            </button>
          </div>
        </div>

        <div className="bg-floraa-elements-bg-depth-1 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-floraa-elements-textPrimary mb-4">
            Session Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
                Session Secret
              </label>
              <input
                type="password"
                value={data.session?.secret || ''}
                onChange={(e) => handleNestedInputChange('auth', 'session', 'secret', e.target.value)}
                className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-2 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
                Max Age (seconds)
              </label>
              <input
                type="number"
                value={data.session?.maxAge || ''}
                onChange={(e) => handleNestedInputChange('auth', 'session', 'maxAge', parseInt(e.target.value))}
                className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-2 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAIConfig = () => {
    const data = getCurrentSectionData('ai');
    
    return (
      <div className="space-y-6">
        {Object.entries(data.providers || {}).map(([provider, settings]) => (
          <div key={provider} className="bg-floraa-elements-bg-depth-1 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-floraa-elements-textPrimary capitalize">
                {provider}
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enabled || false}
                  onChange={(e) => handleNestedInputChange('ai', `providers.${provider}`, 'enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-floraa-elements-bg-depth-3 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
                API Key
              </label>
              <input
                type="password"
                value={settings.apiKey || ''}
                onChange={(e) => handleNestedInputChange('ai', `providers.${provider}`, 'apiKey', e.target.value)}
                className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-2 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSectionContent = () => {
    switch (activeTab) {
      case 'app':
        return renderAppConfig();
      case 'auth':
        return renderAuthConfig();
      case 'ai':
        return renderAIConfig();
      default:
        return (
          <div className="text-center py-12">
            <div className="i-ph:gear text-4xl text-floraa-elements-textSecondary mb-4" />
            <p className="text-floraa-elements-textSecondary">
              Configuration for {sections.find(s => s.id === activeTab)?.name} coming soon
            </p>
          </div>
        );
    }
  };

  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-floraa-elements-borderColor">
        <div className="flex overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={classNames(
                'flex items-center gap-3 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                activeTab === section.id
                  ? 'border-accent-500 text-accent-600 bg-accent-50'
                  : 'border-transparent text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary hover:bg-floraa-elements-bg-depth-3'
              )}
            >
              <div className={`${section.icon} text-lg`} />
              <div className="text-left">
                <div>{section.name}</div>
                <div className="text-xs text-floraa-elements-textTertiary">
                  {section.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <Form method="post">
          <input type="hidden" name="_action" value="update_config" />
          <input type="hidden" name="section" value={activeTab} />
          <input type="hidden" name="config" value={JSON.stringify(formData[activeTab] || {})} />
          
          {renderSectionContent()}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-floraa-elements-borderColor mt-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary text-sm font-medium transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                type="button"
                className="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors"
              >
                Test Configuration
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({});
                  setHasChanges(false);
                }}
                className="border border-floraa-elements-borderColor hover:bg-floraa-elements-bg-depth-3 text-floraa-elements-textSecondary px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!hasChanges || isSubmitting}
                className={classNames(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  hasChanges && !isSubmitting
                    ? 'bg-accent-600 hover:bg-accent-700 text-white'
                    : 'bg-floraa-elements-bg-depth-3 text-floraa-elements-textTertiary cursor-not-allowed'
                )}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}