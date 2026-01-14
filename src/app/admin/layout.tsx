import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // @ts-ignore
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/"); // Or a 403 page, but redirect is safer/simpler
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
            <header className="border-b border-neutral-800 bg-neutral-900 p-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                        AuraTracker Admin
                    </h1>
                    <nav className="flex gap-4 text-sm font-medium">
                        <Link href="/admin" className="hover:text-white text-neutral-400">Dashboard</Link>
                        <Link href="/admin/users" className="hover:text-white text-neutral-400">Users</Link>
                        <Link href="/admin/groups" className="hover:text-white text-neutral-400">Groups</Link>
                        <Link href="/admin/incidents" className="hover:text-white text-neutral-400">Incidents</Link>
                        <Link href="/dashboard" className="hover:text-white text-neutral-400">Back to App</Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
