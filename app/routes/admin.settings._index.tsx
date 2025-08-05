import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { AdminLayout } from '~/components/admin/AdminLayout';
import { GeneralSettings } from '~/components/admin/GeneralSettings';
import { SecuritySettings } from '~/components/admin/SecuritySettings';
import { EmailSettings } from '~/components/admin/EmailSettings';
import { FeatureFlags } from '~/components/admin/FeatureFlags';

export const meta: MetaFunction = () => {
  return [
    { title: 'System Settings - Floraa.dev Admin' },
    { name: 'description', content: 'Configure system settings, security, and features.' }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Mock data - replace with real database queries
  const settings = {
    general: {
      siteName: 'Floraa.dev',
      siteDescription: 'AI-powered web development platform',
      supportEmail: 'support@floraa.dev',
      maintenanceMode: false,
      allowRegistration: true,
      defaultPlan: 'free',
    },
    security: {
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      requireEmailVerification: true,
      enableTwoFactor: true,
      passwordMinLength: 8,
      rateLimitEnabled: true,
      rateLimitRequests: 100,
      rateLimitWindow: 15,
    },
    email: {
      provider: 'resend',
      fromEmail: 'noreply@floraa.dev',
      fromName: 'Floraa.dev',
      smtpConfigured: true,
      welcomeEmailEnabled: true,
      billingEmailsEnabled: true,
      marketingEmailsEnabled: false,
    },
    features: {
      multiAgentSystem: true,
      gitIntegration: true,
      dockerSupport: true,
      teamCollaboration: false,
      whiteLabeling: false,
      customModels: false,
      advancedAnalytics: true,
      apiAccess: true,
    },
  };

  return json({ settings });
}

export default function AdminSettings() {
  const { settings } = useLoaderData<typeof loader>();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-floraa-elements-textPrimary">System Settings</h1>
          <p className="text-floraa-elements-textSecondary">Configure application settings and features</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <GeneralSettings settings={settings.general} />
            <EmailSettings settings={settings.email} />
          </div>
          <div className="space-y-6">
            <SecuritySettings settings={settings.security} />
            <FeatureFlags features={settings.features} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}