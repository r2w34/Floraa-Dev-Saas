import { useState } from 'react';
import { Link, useLocation } from '@remix-run/react';
import { classNames } from '~/utils/classNames';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: 'i-ph:chart-pie-duotone' },
  { name: 'Users', href: '/admin/users', icon: 'i-ph:users-duotone' },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: 'i-ph:credit-card-duotone' },
  { name: 'AI Models', href: '/admin/models', icon: 'i-ph:robot-duotone' },
  { name: 'Agents', href: '/admin/agents', icon: 'i-ph:brain-duotone' },
  { name: 'Analytics', href: '/admin/analytics', icon: 'i-ph:chart-line-duotone' },
  { name: 'Billing', href: '/admin/billing', icon: 'i-ph:money-duotone' },
  { name: 'Configuration', href: '/admin/config', icon: 'i-ph:sliders-duotone' },
  { name: 'Updates', href: '/admin/updates', icon: 'i-ph:download-duotone' },
  { name: 'Settings', href: '/admin/settings', icon: 'i-ph:gear-duotone' },
  { name: 'Templates', href: '/admin/templates', icon: 'i-ph:file-code-duotone' },
  { name: 'Reports', href: '/admin/reports', icon: 'i-ph:file-text-duotone' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-floraa-elements-bg-depth-1">
      {/* Mobile sidebar */}
      <div className={classNames(
        'fixed inset-0 z-50 lg:hidden',
        sidebarOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-floraa-elements-bg-depth-2 border-r border-floraa-elements-borderColor">
          <AdminSidebar navigation={navigation} currentPath={location.pathname} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <div className="h-full bg-floraa-elements-bg-depth-2 border-r border-floraa-elements-borderColor">
          <AdminSidebar navigation={navigation} currentPath={location.pathname} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-floraa-elements-bg-depth-1 border-b border-floraa-elements-borderColor px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-floraa-elements-textSecondary hover:bg-floraa-elements-bg-depth-3"
              onClick={() => setSidebarOpen(true)}
            >
              <div className="i-ph:list text-xl" />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-floraa-elements-textSecondary">
                Admin Panel
              </div>
              <Link
                to="/"
                className="text-sm text-accent-600 hover:text-accent-700 font-medium"
              >
                ← Back to App
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

interface AdminSidebarProps {
  navigation: Array<{ name: string; href: string; icon: string }>;
  currentPath: string;
}

function AdminSidebar({ navigation, currentPath }: AdminSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-floraa-elements-borderColor">
        <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-pink-500 rounded-lg flex items-center justify-center">
          <div className="i-ph:crown-simple text-white text-lg" />
        </div>
        <div>
          <div className="font-bold text-floraa-elements-textPrimary">Floraa Admin</div>
          <div className="text-xs text-floraa-elements-textSecondary">Management Panel</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = currentPath === item.href || 
            (item.href !== '/admin' && currentPath.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent-100 text-accent-700 border border-accent-200'
                  : 'text-floraa-elements-textSecondary hover:bg-floraa-elements-bg-depth-3 hover:text-floraa-elements-textPrimary'
              )}
            >
              <div className={classNames(item.icon, 'text-lg')} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-floraa-elements-borderColor">
        <div className="text-xs text-floraa-elements-textTertiary">
          Floraa.dev v1.0.0
        </div>
      </div>
    </div>
  );
}