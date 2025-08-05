import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { authenticator } from '~/lib/auth/github.server';

export async function loader({ request }: LoaderFunctionArgs) {
  return authenticator.authenticate('github', request, {
    successRedirect: '/dashboard',
    failureRedirect: '/login?error=github_auth_failed',
  });
}