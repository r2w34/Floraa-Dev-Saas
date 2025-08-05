import type { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { authenticator, getUserRepositories } from '~/lib/auth/github.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const repositories = await getUserRepositories(user.access_token);
    return json({ repositories });
  } catch (error) {
    console.error('Failed to fetch repositories:', error);
    return json({ error: 'Failed to fetch repositories' }, { status: 500 });
  }
}