import { Authenticator } from 'remix-auth';
import { GitHubStrategy } from 'remix-auth-github';
import { sessionStorage } from './session.server';

export interface GitHubUser {
  id: string;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  bio?: string;
  company?: string;
  location?: string;
  blog?: string;
  twitter_username?: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  access_token: string;
}

export const authenticator = new Authenticator<GitHubUser>(sessionStorage);

// Only initialize GitHub strategy if credentials are provided
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (clientID && clientSecret && clientID !== 'demo_client_id') {
  const gitHubStrategy = new GitHubStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:52993/auth/github/callback',
      scope: 'user:email repo read:org', // Permissions for user info, repos, and org access
    },
    async ({ accessToken, extraParams, profile }) => {
      // Store the access token for later API calls
      const user: GitHubUser = {
        id: profile.id,
        login: profile.login,
        name: profile.displayName || profile.login,
        email: profile.emails?.[0]?.value || '',
        avatar_url: profile.photos?.[0]?.value || '',
        bio: profile._json.bio,
        company: profile._json.company,
        location: profile._json.location,
        blog: profile._json.blog,
        twitter_username: profile._json.twitter_username,
        public_repos: profile._json.public_repos,
        followers: profile._json.followers,
        following: profile._json.following,
        created_at: profile._json.created_at,
        access_token: accessToken,
      };

      // Here you would typically save the user to your database
      // await createOrUpdateUser(user);

      return user;
    }
  );

  authenticator.use(gitHubStrategy);
}

// Helper function to get user repositories
export async function getUserRepositories(accessToken: string, page = 1, per_page = 30) {
  const response = await fetch(
    `https://api.github.com/user/repos?page=${page}&per_page=${per_page}&sort=updated&type=all`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch repositories');
  }

  return response.json();
}

// Helper function to get repository contents
export async function getRepositoryContents(
  accessToken: string,
  owner: string,
  repo: string,
  path = ''
) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch repository contents');
  }

  return response.json();
}

// Helper function to create a new repository
export async function createRepository(
  accessToken: string,
  name: string,
  description?: string,
  isPrivate = false
) {
  const response = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      private: isPrivate,
      auto_init: true,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create repository');
  }

  return response.json();
}

// Helper function to get user organizations
export async function getUserOrganizations(accessToken: string) {
  const response = await fetch('https://api.github.com/user/orgs', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch organizations');
  }

  return response.json();
}