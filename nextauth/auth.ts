import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Google from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInSchema } from "@/src/lib/zod"
import { createUser, getUserByEmail } from '@/src/utils/db';
import bcrypt from 'bcrypt';

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
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: any) {
                try {
                    const { email, password } = await signInSchema.parseAsync(credentials);
                    const user = await getUserByEmail(email);

                    if (!user || !await bcrypt.compare(password, user.password)) {
                        throw new Error("Invalid credentials.")
                    }

                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: `${user.firstname} ${user.lastname}`,
                    };
                } catch (error) {
                    console.error('Authentication error: ', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            // Handle Google sign-in
            if (account && account.provider === "google") {
                try {
                    if (!profile || !profile.name || !profile.email)
                        return '/login';

                    // Check if the user already exists in the database
                    const existingUser = await getUserByEmail(profile.email);

                    if (existingUser && existingUser.provider !== "google") {
                        const redirectURL = `/login?provider=${existingUser.provider}`;
                        return redirectURL;
                    }

                    if (!existingUser) {
                        await createUser(profile.email, profile.name.split(" ")[0], profile.name.split(" ")[1] || "", '', 'google');
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
        async jwt({ token, trigger, user, account, session }) {
            if (account?.provider === "google" && user?.email) {
                try {
                    const dbUser = await getUserByEmail(user.email);

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
