import { createCookieSessionStorage } from '@remix-run/cloudflare';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__floraa_session',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET || 'default-secret-change-in-production'],
    secure: process.env.NODE_ENV === 'production',
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;