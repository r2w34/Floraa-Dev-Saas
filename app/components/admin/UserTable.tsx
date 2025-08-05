import { Link } from '@remix-run/react';
import { classNames } from '~/utils/classNames';

interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
  status: string;
  createdAt: string;
  lastActive: string;
  totalSpent: number;
  conversations: number;
}

interface UserTableProps {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function UserTable({ users, pagination }: UserTableProps) {
  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'suspended':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPlanBadge = (plan: string) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (plan) {
      case 'Enterprise':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'Pro':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Free':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl overflow-hidden">
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
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                Last Active
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-floraa-elements-borderColor">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-floraa-elements-bg-depth-1 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-floraa-elements-textPrimary">
                        {user.name}
                      </div>
                      <div className="text-sm text-floraa-elements-textSecondary">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getPlanBadge(user.plan)}>
                    {user.plan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(user.status)}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-floraa-elements-textPrimary">
                  {user.conversations} conversations
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-floraa-elements-textPrimary">
                  ${user.totalSpent}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-floraa-elements-textSecondary">
                  {new Date(user.lastActive).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/users/${user.id}`}
                      className="text-accent-600 hover:text-accent-700 transition-colors"
                    >
                      View
                    </Link>
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

      {/* Pagination */}
      <div className="bg-floraa-elements-bg-depth-1 px-6 py-3 border-t border-floraa-elements-borderColor">
        <div className="flex items-center justify-between">
          <div className="text-sm text-floraa-elements-textSecondary">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page === 1}
              className={classNames(
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                pagination.page === 1
                  ? 'text-floraa-elements-textTertiary cursor-not-allowed'
                  : 'text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary hover:bg-floraa-elements-bg-depth-3'
              )}
            >
              Previous
            </button>
            <span className="text-sm text-floraa-elements-textSecondary">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page === pagination.totalPages}
              className={classNames(
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                pagination.page === pagination.totalPages
                  ? 'text-floraa-elements-textTertiary cursor-not-allowed'
                  : 'text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary hover:bg-floraa-elements-bg-depth-3'
              )}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}