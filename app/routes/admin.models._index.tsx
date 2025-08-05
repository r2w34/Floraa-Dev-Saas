import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { AdminLayout } from '~/components/admin/AdminLayout';
import { ModelTable } from '~/components/admin/ModelTable';
import { ModelStats } from '~/components/admin/ModelStats';
import { ProviderSettings } from '~/components/admin/ProviderSettings';

export const meta: MetaFunction = () => {
  return [
    { title: 'AI Models Management - Floraa.dev Admin' },
    { name: 'description', content: 'Manage AI models, providers, and API configurations.' }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Mock data - replace with real database queries
  const models = [
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      status: 'active',
      inputCost: 0.01,
      outputCost: 0.03,
      contextLength: 128000,
      usage: 15420,
      revenue: 2340.50,
      lastUsed: '2024-01-20T16:45:00Z',
    },
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      status: 'active',
      inputCost: 0.003,
      outputCost: 0.015,
      contextLength: 200000,
      usage: 23150,
      revenue: 1890.75,
      lastUsed: '2024-01-20T17:22:00Z',
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      status: 'maintenance',
      inputCost: 0.0005,
      outputCost: 0.0015,
      contextLength: 32000,
      usage: 8920,
      revenue: 445.30,
      lastUsed: '2024-01-20T12:15:00Z',
    },
  ];

  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      status: 'active',
      apiKeyConfigured: true,
      modelsCount: 8,
      totalUsage: 45230,
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      status: 'active',
      apiKeyConfigured: true,
      modelsCount: 4,
      totalUsage: 32150,
    },
    {
      id: 'google',
      name: 'Google',
      status: 'maintenance',
      apiKeyConfigured: true,
      modelsCount: 3,
      totalUsage: 12890,
    },
  ];

  const stats = {
    totalModels: 15,
    activeModels: 12,
    totalUsage: 90270,
    totalRevenue: 4676.55,
  };

  return json({ models, providers, stats });
}

export default function AdminModels() {
  const { models, providers, stats } = useLoaderData<typeof loader>();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-floraa-elements-textPrimary">AI Models</h1>
            <p className="text-floraa-elements-textSecondary">Manage AI models, providers, and pricing</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="border border-floraa-elements-borderColor hover:bg-floraa-elements-bg-depth-3 text-floraa-elements-textSecondary px-4 py-2 rounded-lg font-medium transition-colors">
              Sync Models
            </button>
            <button className="bg-accent-600 hover:bg-accent-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Add Model
            </button>
          </div>
        </div>

        <ModelStats stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ModelTable models={models} />
          </div>
          <div>
            <ProviderSettings providers={providers} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}