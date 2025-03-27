import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Google from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import prisma from '@/src/lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        // Google OAuth Provider
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,

            profile(profile) {
                return {
                    name: profile.name,
                    email: profile.email,
                };
            },
        }),

        // Credentials Provider for email/password login
        CredentialsProvider({
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: any) {
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(8),
                    })
                    .safeParse(credentials);

                if (!parsedCredentials.success) {
                    console.error('Invalid credentials format!');
                    return null;
                }

                const { email, password } = parsedCredentials.data;

                try {
                    const user = await prisma.users.findUnique({
                        where: { email: email },
                    });

                    if (user && (await bcrypt.compare(password, user.password))) {
                        return {
                            id: user.id.toString(),
                            email: user.email,
                            name: `${user.firstname} ${user.lastname}`,
                        };
                    } else {
                        console.error('Authentication failed!');
                        return null;
                    }
                } catch (error) {
                    console.error('Authentication error:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ account, profile }: { account: any; profile: any }) {
            // Handle Google sign-in
            if (account && account.provider === "google") {
                try {
                    if (!profile || !profile.name || !profile.email)
                        return '/login';

                    // Check if the user already exists in the database
                    let existingUser = await prisma.users.findUnique({
                        where: { email: profile.email },
                    });

                    if (existingUser && existingUser.provider !== "google") {
                        const redirectURL = `/login?provider=${existingUser.provider}`;
                        return redirectURL;
                    }

                    if (!existingUser) {
                        // Create a new user if they don't exist
                        existingUser = await prisma.users.create({
                            data: {
                                email: profile.email,
                                firstname: profile.name.split(" ")[0],
                                lastname: profile.name.split(" ")[1] || "",
                                password: '',
                                provider: 'google'
                            },
                        });
                    }

                    return true; // Allow sign-in
                } catch (error) {
                    console.error("Error during sign-in:", error);
                    return false; // Deny sign-in on error
                }
            }

            return true; // Allow sign-in for other providers
        },
        async session({ session, token }: { session: any; token: any }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
            }
            return session;
        },
        async jwt({ token, trigger, user, account, session }: { token: any; trigger: any; user: any; account: any; session: any }) {
            if (account?.provider === "google" && user?.email) {
                try {
                    const dbUser = await prisma.users.findUnique({
                        where: { email: user.email },
                    });

                    if (dbUser) {
                        token.id = dbUser.id.toString();
                        token.name = dbUser.firstname + ' ' + dbUser.lastname;
                    }
                } catch (error) {
                    console.error("Error fetching user ID:", error);
                }

                return token;
            }

            if (trigger === 'update') {
                if (session?.name) token.name = session.name;
            }

            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }

            return token;
        },
        authorized({ auth, request: { nextUrl } }: { auth: any; request: { nextUrl: any } }) {
            const isLoggedIn = !!auth?.user;
            const isOnApp = nextUrl.pathname.startsWith('/');
            const isOnRegister = nextUrl.pathname.startsWith('/signup');
            const isOnLogin = nextUrl.pathname.startsWith('/login');

            if (isLoggedIn && (isOnLogin || isOnRegister)) {
                return Response.redirect(new URL('/', nextUrl as unknown as URL));
            }

            if (isOnRegister || isOnLogin) {
                return true; // Always allow access to register and login pages
            }

            if (isOnApp) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }

            if (isLoggedIn) {
                return Response.redirect(new URL('/', nextUrl as unknown as URL));
            }

            return true;
        },
    },
});
