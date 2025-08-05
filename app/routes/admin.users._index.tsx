import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { AdminLayout } from '~/components/admin/AdminLayout';
import { UserTable } from '~/components/admin/UserTable';
import { UserFilters } from '~/components/admin/UserFilters';
import { UserStats } from '~/components/admin/UserStats';

export const meta: MetaFunction = () => {
  return [
    { title: 'User Management - Floraa.dev Admin' },
    { name: 'description', content: 'Manage users, subscriptions, and account settings.' }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status') || 'all';
  const plan = url.searchParams.get('plan') || 'all';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 20;

  // Mock data - replace with real database queries
  const users = [
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      plan: 'Pro',
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z',
      lastActive: '2024-01-20T14:22:00Z',
      totalSpent: 299,
      conversations: 45,
    },
    {
      id: '2',
      email: 'sarah@example.com',
      name: 'Sarah Wilson',
      plan: 'Enterprise',
      status: 'active',
      createdAt: '2024-01-10T09:15:00Z',
      lastActive: '2024-01-20T16:45:00Z',
      totalSpent: 999,
      conversations: 128,
    },
    {
      id: '3',
      email: 'mike@example.com',
      name: 'Mike Johnson',
      plan: 'Free',
      status: 'suspended',
      createdAt: '2024-01-18T11:20:00Z',
      lastActive: '2024-01-19T08:30:00Z',
      totalSpent: 0,
      conversations: 8,
    },
  ];

  const stats = {
    totalUsers: 1247,
    activeUsers: 1089,
    suspendedUsers: 158,
    newUsersThisMonth: 89,
  };

  return json({
    users,
    stats,
    pagination: {
      page,
      limit,
      total: users.length,
      totalPages: Math.ceil(users.length / limit),
    },
    filters: { search, status, plan },
  });
}

export default function AdminUsers() {
  const { users, stats, pagination, filters } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-floraa-elements-textPrimary">User Management</h1>
            <p className="text-floraa-elements-textSecondary">Manage user accounts and subscriptions</p>
          </div>
          <button className="bg-accent-600 hover:bg-accent-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Export Users
          </button>
        </div>

        <UserStats stats={stats} />
        <UserFilters filters={filters} />
        <UserTable users={users} pagination={pagination} />
      </div>
    </AdminLayout>
  );
}