import { Form, Link } from '@remix-run/react';
import type { GitHubUser } from '~/lib/auth/github.server';

interface UserProfileProps {
  user: GitHubUser;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-floraa-elements-bg-depth-3 transition-colors">
        <img
          src={user.avatar_url}
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-floraa-elements-textPrimary">
            {user.name}
          </div>
          <div className="text-xs text-floraa-elements-textSecondary">
            @{user.login}
          </div>
        </div>
        <div className="i-ph:caret-down text-floraa-elements-textSecondary" />
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 top-full mt-2 w-64 bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-4 border-b border-floraa-elements-borderColor">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-medium text-floraa-elements-textPrimary">
                {user.name}
              </div>
              <div className="text-sm text-floraa-elements-textSecondary">
                @{user.login}
              </div>
              <div className="text-xs text-floraa-elements-textSecondary">
                {user.email}
              </div>
            </div>
          </div>
        </div>

        <div className="p-2">
          <Link
            to="/dashboard/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-floraa-elements-bg-depth-3 transition-colors"
          >
            <div className="i-ph:user-circle text-floraa-elements-textSecondary" />
            <span className="text-sm text-floraa-elements-textPrimary">Profile</span>
          </Link>
          
          <Link
            to="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-floraa-elements-bg-depth-3 transition-colors"
          >
            <div className="i-ph:gear text-floraa-elements-textSecondary" />
            <span className="text-sm text-floraa-elements-textPrimary">Settings</span>
          </Link>
          
          <Link
            to="/dashboard/billing"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-floraa-elements-bg-depth-3 transition-colors"
          >
            <div className="i-ph:credit-card text-floraa-elements-textSecondary" />
            <span className="text-sm text-floraa-elements-textPrimary">Billing</span>
          </Link>
          
          <div className="border-t border-floraa-elements-borderColor my-2" />
          
          <a
            href={`https://github.com/${user.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-floraa-elements-bg-depth-3 transition-colors"
          >
            <div className="i-ph:github-logo text-floraa-elements-textSecondary" />
            <span className="text-sm text-floraa-elements-textPrimary">GitHub Profile</span>
            <div className="i-ph:arrow-square-out text-xs text-floraa-elements-textSecondary ml-auto" />
          </a>
          
          <Form method="post" action="/auth/logout">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors text-left"
            >
              <div className="i-ph:sign-out text-floraa-elements-textSecondary" />
              <span className="text-sm text-floraa-elements-textPrimary">Sign out</span>
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}