interface Transaction {
  id: string;
  user: string;
  amount: number;
  plan: string;
  status: string;
  gateway: string;
  timestamp: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'refunded':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getGatewayIcon = (gateway: string) => {
    switch (gateway.toLowerCase()) {
      case 'stripe':
        return 'i-ph:credit-card-duotone';
      case 'paypal':
        return 'i-ph:paypal-logo-duotone';
      case 'razorpay':
        return 'i-ph:wallet-duotone';
      default:
        return 'i-ph:bank-duotone';
    }
  };

  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-floraa-elements-borderColor">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-floraa-elements-textPrimary">Recent Transactions</h3>
          <button className="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors">
            View All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-floraa-elements-borderColor">
          <thead className="bg-floraa-elements-bg-depth-1">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                Gateway
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-floraa-elements-borderColor">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-floraa-elements-bg-depth-1 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-floraa-elements-textPrimary">
                    {transaction.user}
                  </div>
                  <div className="text-sm text-floraa-elements-textSecondary">
                    {transaction.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-floraa-elements-textPrimary">
                  {transaction.plan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-floraa-elements-textPrimary">
                  ${transaction.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className={`${getGatewayIcon(transaction.gateway)} text-lg text-floraa-elements-textSecondary`} />
                    <span className="text-sm text-floraa-elements-textPrimary capitalize">
                      {transaction.gateway}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(transaction.status)}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-floraa-elements-textSecondary">
                  {new Date(transaction.timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-accent-600 hover:text-accent-700 transition-colors">
                      View
                    </button>
                    <button className="text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary transition-colors">
                      <div className="i-ph:dots-three-vertical text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}