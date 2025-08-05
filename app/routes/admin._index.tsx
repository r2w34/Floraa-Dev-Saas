import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { AdminLayout } from '~/components/admin/AdminLayout';
import { DashboardStats } from '~/components/admin/DashboardStats';
import { RecentActivity } from '~/components/admin/RecentActivity';
import { SystemHealth } from '~/components/admin/SystemHealth';
import { RevenueChart } from '~/components/admin/RevenueChart';

export const meta: MetaFunction = () => {
  return [
    { title: 'Admin Dashboard - Floraa.dev' },
    { name: 'description', content: 'Floraa.dev admin panel for managing users, subscriptions, and system settings.' }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Add authentication check for admin users
  // const user = await requireAdmin(request);
  
  // Mock data - replace with real database queries
  const stats = {
    totalUsers: 1247,
    activeSubscriptions: 892,
    monthlyRevenue: 26750,
    totalConversations: 45623,
    systemUptime: 99.9,
    activeAgents: 6
  };

  const recentActivity = [
    { id: 1, type: 'user_signup', user: 'john@example.com', timestamp: new Date().toISOString() },
    { id: 2, type: 'subscription_upgrade', user: 'sarah@example.com', plan: 'Pro', timestamp: new Date().toISOString() },
    { id: 3, type: 'payment_failed', user: 'mike@example.com', timestamp: new Date().toISOString() },
  ];

  return json({ stats, recentActivity });
}

export default function AdminDashboard() {
  const { stats, recentActivity } = useLoaderData<typeof loader>();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-floraa-elements-textPrimary">Dashboard</h1>
          <p className="text-floraa-elements-textSecondary">Welcome to Floraa.dev admin panel</p>
        </div>

        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <SystemHealth uptime={stats.systemUptime} />
        </div>

        <RecentActivity activities={recentActivity} />
      </div>
    </AdminLayout>
  );
}