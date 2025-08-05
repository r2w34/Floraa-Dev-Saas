import type { ActionFunctionArgs } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { authenticator } from '~/lib/auth/github.server';

export async function action({ request }: ActionFunctionArgs) {
  return authenticator.logout(request, { redirectTo: '/' });
}

export async function loader() {
  return redirect('/');
}