'use client'

import { credentialsSignIn, googleSignIn } from '@/src/lib/auth/auth';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Input } from './Input';

export default function LoginForm() {
    const [formState, setFormState] = useState({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);

    const SubmitButton = () => {
        const { pending } = useFormStatus();

        return (
            <button type="submit" className="block mt-4 w-full p-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl cursor-pointer">
                {pending ? (
                    <svg className="block m-auto bg-transparent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="24" height="24">
                        <g>
                            <circle strokeLinecap="round" fill="none" strokeDasharray="50.26548245743669 50.26548245743669" stroke="#ffffff" strokeWidth="8" r="32" cy="50" cx="50">
                                <animateTransform values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"></animateTransform>
                            </circle>
                        </g>
                    </svg>
                ) : 'Login'}
            </button>
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', formState.email);
        formData.append('password', formState.password);

        const result = await credentialsSignIn(formData);
        if (result && result.message) {
            setError(result.message);
        }
    };

    return (
        <div className="block w-full max-w-[450px] m-auto mt-4 bg-white">
            <h2 className="block w-full text-center text-2xl font-semibold p-4">Login</h2>
            {error && (
                <div
                    role="alert"
                    className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
                    aria-live="assertive"
                    aria-label="Error Alert"
                >
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div>
                    <div>
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formState.email}
                            onChange={handleInputChange}
                            required
                            aria-label="Email"
                        />
                    </div>

                    <div className="mt-4">
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formState.password}
                            onChange={handleInputChange}
                            required
                            aria-label="Password"
                        />
                    </div>

                    <div className="text-center text-sm mt-2">
                        <span className="text-gray-500">Already have an account?</span>{" "}
                        <Link href="/register" className="text-emerald-500 hover:underline">
                            Register
                        </Link>
                    </div>
                </div>

                <SubmitButton />
            </form>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">OR</span>
                </div>
            </div>

            <div className="">
                <button
                    className="inline-flex px-3 py-4 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-black outline-none cursor-pointer focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => googleSignIn()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Continue with Google
                </button>
            </div>
        </div>
    );
}