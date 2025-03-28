'use client'

import { signOut } from "next-auth/react";

export default function SignOutForm() {
        return (
                <button onClick={() => signOut()} className="block w-full mt-4 p-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg cursor-pointer">Sign Out</button>
        );
}