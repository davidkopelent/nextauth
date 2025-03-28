import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/src/components/Providers";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "NextAuth",
    description: "NextAuth",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased bg-white`}>
                <Providers>
                    <div className="flex flex-col min-h-screen">
                        <header className="block w-full px-6 py-4 bg-white border-b border-slate-200">
                            <h2 className="text-2xl font-bold"><Link href="/">NextAuth</Link></h2>
                        </header>

                        <main className="flex-grow bg-white">
                            {children}
                        </main>

                        <footer className="block w-full p-4 bg-white">
                            <p className="text-center text-sm text-gray-500">© 2025 NextAuth</p>
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
