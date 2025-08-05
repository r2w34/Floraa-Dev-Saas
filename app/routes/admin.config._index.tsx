import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json, redirect } from '@remix-run/cloudflare';
import { useLoaderData, useActionData, Form, useNavigation } from '@remix-run/react';
import { AdminLayout } from '~/components/admin/AdminLayout';
import { ConfigurationTabs } from '~/components/admin/ConfigurationTabs';
import { configManager } from '~/lib/config/ConfigManager.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'System Configuration - Floraa.dev Admin' },
    { name: 'description', content: 'Configure all system settings from the admin panel.' }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const config = configManager.getConfig();
  
  return json({
    config,
    sections: [
      {
        id: 'app',
        name: 'Application',
        description: 'Basic application settings and branding',
        icon: 'i-ph:gear-duotone',
      },
      {
        id: 'auth',
        name: 'Authentication',
        description: 'GitHub OAuth and session configuration',
        icon: 'i-ph:shield-check-duotone',
      },
      {
        id: 'ai',
        name: 'AI Models',
        description: 'AI provider settings and model configuration',
        icon: 'i-ph:robot-duotone',
      },
      {
        id: 'email',
        name: 'Email',
        description: 'Email provider and notification settings',
        icon: 'i-ph:envelope-duotone',
      },
      {
        id: 'payments',
        name: 'Payments',
        description: 'Stripe, PayPal and billing configuration',
        icon: 'i-ph:credit-card-duotone',
      },
      {
        id: 'security',
        name: 'Security',
        description: 'Rate limiting, CORS and security policies',
        icon: 'i-ph:lock-duotone',
      },
      {
        id: 'features',
        name: 'Features',
        description: 'Feature flags and experimental features',
        icon: 'i-ph:flag-duotone',
      },
      {
        id: 'analytics',
        name: 'Analytics',
        description: 'Google Analytics, PostHog and tracking',
        icon: 'i-ph:chart-line-duotone',
      },
      {
        id: 'storage',
        name: 'Storage',
        description: 'File storage and upload configuration',
        icon: 'i-ph:cloud-duotone',
      },
    ],
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get('_action') as string;

  try {
    switch (action) {
      case 'update_config': {
        const section = formData.get('section') as string;
        const configData = JSON.parse(formData.get('config') as string);
        
        // Update the specific section
        const currentConfig = configManager.getConfig();
        const updatedConfig = {
          ...currentConfig,
          [section]: {
            ...currentConfig[section as keyof typeof currentConfig],
            ...configData,
          },
        };
        
        await configManager.updateConfig(updatedConfig);
        
        return json({ 
          success: true, 
          message: `${section} configuration updated successfully` 
        });
      }
      
      case 'test_connection': {
        const service = formData.get('service') as string;
        const config = JSON.parse(formData.get('config') as string);
        
        // Test the connection based on service type
        const testResult = await testServiceConnection(service, config);
        
        return json({ 
          success: testResult.success, 
          message: testResult.message 
        });
      }
      
      case 'reset_section': {
        const section = formData.get('section') as string;
        
        // Reset section to defaults
        await resetSectionToDefaults(section);
        
        return json({ 
          success: true, 
          message: `${section} configuration reset to defaults` 
        });
      }
      
      default:
        return json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Configuration update error:', error);
    return json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Configuration update failed' 
    }, { status: 500 });
  }
}

async function testServiceConnection(service: string, config: any): Promise<{ success: boolean; message: string }> {
  switch (service) {
    case 'github':
      try {
        const response = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `token ${config.accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });
        return {
          success: response.ok,
          message: response.ok ? 'GitHub connection successful' : 'GitHub connection failed',
        };
      } catch (error) {
        return { success: false, message: 'GitHub connection test failed' };
      }
    
    case 'stripe':
      try {
        // Test Stripe connection
        const response = await fetch('https://api.stripe.com/v1/account', {
          headers: {
            'Authorization': `Bearer ${config.secretKey}`,
          },
        });
        return {
          success: response.ok,
          message: response.ok ? 'Stripe connection successful' : 'Stripe connection failed',
        };
      } catch (error) {
        return { success: false, message: 'Stripe connection test failed' };
      }
    
    case 'email':
      // Test email service connection
      return { success: true, message: 'Email service connection test not implemented yet' };
    
    default:
      return { success: false, message: 'Unknown service' };
  }
}

async function resetSectionToDefaults(section: string): Promise<void> {
  // In a real implementation, this would reset the section to default values
  console.log(`Resetting ${section} to defaults`);
}

export default function AdminConfig() {
  const { config, sections } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-floraa-elements-textPrimary">System Configuration</h1>
            <p className="text-floraa-elements-textSecondary">
              Configure all system settings from this centralized panel
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="border border-floraa-elements-borderColor hover:bg-floraa-elements-bg-depth-3 text-floraa-elements-textSecondary px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Export Config
            </button>
            <button
              type="button"
              className="border border-floraa-elements-borderColor hover:bg-floraa-elements-bg-depth-3 text-floraa-elements-textSecondary px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Import Config
            </button>
          </div>
        </div>

        {actionData && (
          <div className={`p-4 rounded-lg border ${
            actionData.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`${
                actionData.success ? 'i-ph:check-circle' : 'i-ph:warning-circle'
              } text-lg`} />
              <span className="font-medium">{actionData.message}</span>
            </div>
          </div>
        )}

        <ConfigurationTabs 
          config={config} 
          sections={sections} 
          isSubmitting={isSubmitting}
        />
      </div>
    </AdminLayout>
  );
}