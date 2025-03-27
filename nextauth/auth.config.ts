import type { AuthOptions } from 'next-auth';

export const authConfig: AuthOptions = {
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [], // Add providers with an empty array for now
} satisfies AuthOptions;