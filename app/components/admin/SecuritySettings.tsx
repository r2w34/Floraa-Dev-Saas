import { Form } from '@remix-run/react';

interface SecuritySettingsProps {
  settings: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    requireEmailVerification: boolean;
    enableTwoFactor: boolean;
    passwordMinLength: number;
    rateLimitEnabled: boolean;
    rateLimitRequests: number;
    rateLimitWindow: number;
  };
}

export function SecuritySettings({ settings }: SecuritySettingsProps) {
  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-floraa-elements-borderColor">
        <h3 className="text-lg font-semibold text-floraa-elements-textPrimary">Security Settings</h3>
      </div>

      <Form method="post" className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="sessionTimeout" className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
              Session Timeout (hours)
            </label>
            <input
              type="number"
              name="sessionTimeout"
              id="sessionTimeout"
              min="1"
              max="168"
              defaultValue={settings.sessionTimeout}
              className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>

          <div>
            <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
              Max Login Attempts
            </label>
            <input
              type="number"
              name="maxLoginAttempts"
              id="maxLoginAttempts"
              min="3"
              max="10"
              defaultValue={settings.maxLoginAttempts}
              className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="passwordMinLength" className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
            Minimum Password Length
          </label>
          <input
            type="number"
            name="passwordMinLength"
            id="passwordMinLength"
            min="6"
            max="32"
            defaultValue={settings.passwordMinLength}
            className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-floraa-elements-textPrimary">Email Verification Required</div>
              <div className="text-sm text-floraa-elements-textSecondary">Require email verification for new accounts</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="requireEmailVerification"
                defaultChecked={settings.requireEmailVerification}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-floraa-elements-bg-depth-3 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-floraa-elements-textPrimary">Two-Factor Authentication</div>
              <div className="text-sm text-floraa-elements-textSecondary">Enable 2FA for enhanced security</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="enableTwoFactor"
                defaultChecked={settings.enableTwoFactor}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-floraa-elements-bg-depth-3 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-floraa-elements-textPrimary">Rate Limiting</div>
              <div className="text-sm text-floraa-elements-textSecondary">Enable API rate limiting</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="rateLimitEnabled"
                defaultChecked={settings.rateLimitEnabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-floraa-elements-bg-depth-3 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
            </label>
          </div>
        </div>

        {settings.rateLimitEnabled && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-floraa-elements-bg-depth-1 rounded-lg">
            <div>
              <label htmlFor="rateLimitRequests" className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
                Requests per Window
              </label>
              <input
                type="number"
                name="rateLimitRequests"
                id="rateLimitRequests"
                min="10"
                max="1000"
                defaultValue={settings.rateLimitRequests}
                className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-2 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>

            <div>
              <label htmlFor="rateLimitWindow" className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
                Window (minutes)
              </label>
              <input
                type="number"
                name="rateLimitWindow"
                id="rateLimitWindow"
                min="1"
                max="60"
                defaultValue={settings.rateLimitWindow}
                className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-2 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>
          </div>
        )}

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