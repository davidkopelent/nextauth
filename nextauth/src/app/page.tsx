import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignOutForm from "@/src/components/SignOutForm";

export default async function Home() {
    const session = await auth();
    if (!session) {
        redirect('/login');
    }

    return (
        <div className="flex flex-col gap-2 w-full max-w-[500px] m-auto mt-4 bg-white">
            <h1 className="block w-full text-3xl font-bold pt-4">Hello {session.user?.name && <span className="font-bold">{session.user.name}</span>}</h1>
            {session.user?.email && <p className="block w-full text-md text-gray-500">Email: {session.user.email}</p>}
            <SignOutForm />
        </div>
    );
}