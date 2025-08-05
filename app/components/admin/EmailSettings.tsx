import { Form } from '@remix-run/react';

interface EmailSettingsProps {
  settings: {
    provider: string;
    fromEmail: string;
    fromName: string;
    smtpConfigured: boolean;
    welcomeEmailEnabled: boolean;
    billingEmailsEnabled: boolean;
    marketingEmailsEnabled: boolean;
  };
}

export function EmailSettings({ settings }: EmailSettingsProps) {
  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-floraa-elements-borderColor">
        <h3 className="text-lg font-semibold text-floraa-elements-textPrimary">Email Settings</h3>
      </div>

      <Form method="post" className="p-6 space-y-6">
        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
            Email Provider
          </label>
          <select
            name="provider"
            id="provider"
            defaultValue={settings.provider}
            className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          >
            <option value="resend">Resend</option>
            <option value="sendgrid">SendGrid</option>
            <option value="mailgun">Mailgun</option>
            <option value="smtp">Custom SMTP</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fromEmail" className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
              From Email
            </label>
            <input
              type="email"
              name="fromEmail"
              id="fromEmail"
              defaultValue={settings.fromEmail}
              className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary placeholder-floraa-elements-textTertiary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>

          <div>
            <label htmlFor="fromName" className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
              From Name
            </label>
            <input
              type="text"
              name="fromName"
              id="fromName"
              defaultValue={settings.fromName}
              className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary placeholder-floraa-elements-textTertiary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>
        </div>

        <div className="p-4 bg-floraa-elements-bg-depth-1 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${settings.smtpConfigured ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-floraa-elements-textPrimary">
              SMTP Configuration
            </span>
          </div>
          <p className="text-sm text-floraa-elements-textSecondary">
            {settings.smtpConfigured 
              ? 'Email service is properly configured and ready to send emails.'
              : 'Email service is not configured. Please configure your email provider settings.'
            }
          </p>
          <button
            type="button"
            className="mt-2 text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors"
          >
            Test Email Configuration
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-floraa-elements-textPrimary">Welcome Emails</div>
              <div className="text-sm text-floraa-elements-textSecondary">Send welcome email to new users</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="welcomeEmailEnabled"
                defaultChecked={settings.welcomeEmailEnabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-floraa-elements-bg-depth-3 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-floraa-elements-textPrimary">Billing Emails</div>
              <div className="text-sm text-floraa-elements-textSecondary">Send billing and payment notifications</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="billingEmailsEnabled"
                defaultChecked={settings.billingEmailsEnabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-floraa-elements-bg-depth-3 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-floraa-elements-textPrimary">Marketing Emails</div>
              <div className="text-sm text-floraa-elements-textSecondary">Send promotional and feature updates</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="marketingEmailsEnabled"
                defaultChecked={settings.marketingEmailsEnabled}
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