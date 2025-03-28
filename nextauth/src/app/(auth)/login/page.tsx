import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import LoginForm from '@/src/components/LoginForm';

export default async function Login() {
    const session = await auth();
    if (session) {
        redirect('/');
    }

    return (
        <LoginForm />
    );
}