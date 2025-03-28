'use server'

import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';

export async function googleSignIn() {
    await signIn("google", { redirectTo: '/', redirect: true });
};

export async function credentialsSignIn(formData: FormData) {
    try {
        const result = await signIn("credentials", {
            email: formData.get('email'),
            password: formData.get('password'),
            redirectTo: '/',
            redirect: true,
        });

        if (!result) {
            return { message: 'Invalid credentials!' };
        }

        redirect('/');
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { message: 'Invalid credentials!' };
                default:
                    return { message: 'Something went wrong!' };
            }
        }
        throw error;
    }
};

