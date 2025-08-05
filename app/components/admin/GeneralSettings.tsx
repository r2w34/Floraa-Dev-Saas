import { Form } from '@remix-run/react';

interface GeneralSettingsProps {
  settings: {
    siteName: string;
    siteDescription: string;
    supportEmail: string;
    maintenanceMode: boolean;
    allowRegistration: boolean;
    defaultPlan: string;
  };
}

export function GeneralSettings({ settings }: GeneralSettingsProps) {
  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-floraa-elements-borderColor">
        <h3 className="text-lg font-semibold text-floraa-elements-textPrimary">General Settings</h3>
      </div>

      <Form method="post" className="p-6 space-y-6">
        <div>
          <label htmlFor="siteName" className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
            Site Name
          </label>
          <input
            type="text"
            name="siteName"
            id="siteName"
            defaultValue={settings.siteName}
            className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary placeholder-floraa-elements-textTertiary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
        </div>

        <div>
          <label htmlFor="siteDescription" className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
            Site Description
          </label>
          <textarea
            name="siteDescription"
            id="siteDescription"
            rows={3}
            defaultValue={settings.siteDescription}
            className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary placeholder-floraa-elements-textTertiary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
        </div>

        <div>
          <label htmlFor="supportEmail" className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
            Support Email
          </label>
          <input
            type="email"
            name="supportEmail"
            id="supportEmail"
            defaultValue={settings.supportEmail}
            className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary placeholder-floraa-elements-textTertiary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
        </div>

        <div>
          <label htmlFor="defaultPlan" className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
            Default Plan for New Users
          </label>
          <select
            name="defaultPlan"
            id="defaultPlan"
            defaultValue={settings.defaultPlan}
            className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          >
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-floraa-elements-textPrimary">Maintenance Mode</div>
              <div className="text-sm text-floraa-elements-textSecondary">Temporarily disable the application</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="maintenanceMode"
                defaultChecked={settings.maintenanceMode}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-floraa-elements-bg-depth-3 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-floraa-elements-textPrimary">Allow Registration</div>
              <div className="text-sm text-floraa-elements-textSecondary">Allow new users to register</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="allowRegistration"
                defaultChecked={settings.allowRegistration}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-floraa-elements-bg-depth-3 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
            </label>
          </div>
        </div>

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