import { redirect } from 'next/navigation';
import { auth, signIn } from '@/auth';

export default async function Login() {
    const session = await auth();
    if (session) {
        redirect('/');
    }

    return (
        <div className="block w-full max-w-[500px] m-auto sm-md:rounded-3xl bg-white sm-md:border sm-md:border-slate-100 dark:border-dark-secondary">
            <h2 className="block w-full text-center text-xl font-semibold border-b border-slate-100 dark:border-dark-secondary p-4">Login</h2>
            <form action={signIn}> 
                <input type="email" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}