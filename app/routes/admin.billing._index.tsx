import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { AdminLayout } from '~/components/admin/AdminLayout';
import { BillingStats } from '~/components/admin/BillingStats';
import { PaymentGateways } from '~/components/admin/PaymentGateways';
import { SubscriptionPlans } from '~/components/admin/SubscriptionPlans';
import { RecentTransactions } from '~/components/admin/RecentTransactions';

export const meta: MetaFunction = () => {
  return [
    { title: 'Billing Management - Floraa.dev Admin' },
    { name: 'description', content: 'Manage billing, subscriptions, and payment settings.' }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Mock data - replace with real database queries
  const stats = {
    totalRevenue: 126750,
    monthlyRecurring: 89420,
    activeSubscriptions: 1247,
    churnRate: 2.3,
  };

  const paymentGateways = [
    {
      id: 'stripe',
      name: 'Stripe',
      status: 'active',
      configured: true,
      transactionFee: 2.9,
      volume: 98500,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      status: 'active',
      configured: true,
      transactionFee: 3.5,
      volume: 28250,
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      status: 'disabled',
      configured: false,
      transactionFee: 2.0,
      volume: 0,
    },
  ];

  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      subscribers: 2450,
      revenue: 0,
      features: ['10 conversations', 'Basic models', '1 project'],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      interval: 'month',
      subscribers: 892,
      revenue: 25868,
      features: ['500 conversations', 'All models', 'Multi-agents', '10 projects'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      interval: 'month',
      subscribers: 156,
      revenue: 15444,
      features: ['Unlimited', 'Custom models', 'Teams', 'White-label'],
    },
  ];

  const recentTransactions = [
    {
      id: 'txn_1',
      user: 'john@example.com',
      amount: 29,
      plan: 'Pro',
      status: 'completed',
      gateway: 'stripe',
      timestamp: '2024-01-20T16:45:00Z',
    },
    {
      id: 'txn_2',
      user: 'sarah@example.com',
      amount: 99,
      plan: 'Enterprise',
      status: 'completed',
      gateway: 'stripe',
      timestamp: '2024-01-20T15:30:00Z',
    },
    {
      id: 'txn_3',
      user: 'mike@example.com',
      amount: 29,
      plan: 'Pro',
      status: 'failed',
      gateway: 'paypal',
      timestamp: '2024-01-20T14:15:00Z',
    },
  ];

  return json({
    stats,
    paymentGateways,
    subscriptionPlans,
    recentTransactions,
  });
}

export default function AdminBilling() {
  const { stats, paymentGateways, subscriptionPlans, recentTransactions } = useLoaderData<typeof loader>();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-floraa-elements-textPrimary">Billing Management</h1>
            <p className="text-floraa-elements-textSecondary">Manage subscriptions, payments, and billing settings</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="border border-floraa-elements-borderColor hover:bg-floraa-elements-bg-depth-3 text-floraa-elements-textSecondary px-4 py-2 rounded-lg font-medium transition-colors">
              Export Data
            </button>
            <button className="bg-accent-600 hover:bg-accent-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Create Coupon
            </button>
          </div>
        </div>

        <BillingStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PaymentGateways gateways={paymentGateways} />
          <SubscriptionPlans plans={subscriptionPlans} />
        </div>

        <RecentTransactions transactions={recentTransactions} />
      </div>
    </AdminLayout>
  );
}