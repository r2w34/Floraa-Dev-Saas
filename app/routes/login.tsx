import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json, redirect } from '@remix-run/cloudflare';
import { Form, Link, useLoaderData, useSearchParams } from '@remix-run/react';
import { authenticator } from '~/lib/auth/github.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Login - Floraa.dev' },
    { name: 'description', content: 'Sign in to your Floraa.dev account' }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // If user is already authenticated, redirect to dashboard
  const user = await authenticator.isAuthenticated(request);
  if (user) {
    return redirect('/dashboard');
  }

  return json({});
}

export default function Login() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-floraa-elements-bg-depth-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link to="/" className="flex justify-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-pink-500 rounded-xl flex items-center justify-center">
                <div className="i-ph:code-duotone text-2xl text-white" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-accent-500 to-pink-500 bg-clip-text text-transparent">
                Floraa.dev
              </div>
            </div>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold text-floraa-elements-textPrimary">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-floraa-elements-textSecondary">
            Sign in to your account to continue building amazing projects
          </p>
        </div>

        <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="i-ph:warning-circle text-red-500" />
                <p className="text-sm text-red-700">
                  {error === 'github_auth_failed' 
                    ? 'GitHub authentication failed. Please try again.'
                    : 'An error occurred during sign in. Please try again.'
                  }
                </p>
              </div>
            </div>
          )}

          <Form method="post" action="/auth/github" className="space-y-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <div className="i-ph:github-logo text-xl" />
              Continue with GitHub
            </button>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-floraa-elements-borderColor" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-floraa-elements-bg-depth-2 text-floraa-elements-textSecondary">
                Why GitHub?
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="i-ph:git-branch-duotone text-accent-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-floraa-elements-textPrimary">
                  Seamless Repository Integration
                </h4>
                <p className="text-xs text-floraa-elements-textSecondary">
                  Connect your existing repositories and sync your projects automatically
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="i-ph:shield-check-duotone text-green-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-floraa-elements-textPrimary">
                  Secure & Trusted
                </h4>
                <p className="text-xs text-floraa-elements-textSecondary">
                  OAuth 2.0 authentication with industry-standard security
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="i-ph:rocket-launch-duotone text-purple-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-floraa-elements-textPrimary">
                  Quick Setup
                </h4>
                <p className="text-xs text-floraa-elements-textSecondary">
                  Get started in seconds with your existing GitHub profile
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-floraa-elements-textSecondary">
            Don't have a GitHub account?{' '}
            <a
              href="https://github.com/join"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent-600 hover:text-accent-500 transition-colors"
            >
              Create one for free
            </a>
          </p>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}