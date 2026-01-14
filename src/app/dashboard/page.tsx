import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getAuraTitle } from "@/lib/aura-utils";
import { Shield, Zap, TrendingUp, LogOut, Clock } from "lucide-react";
import SignOutButton from "@/components/auth/sign-out-button"; // We need to create this

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) redirect("/login");

    const auraTitle = getAuraTitle(user.aura);

    // Calculate progress to next level (mock logic for visual)
    const progress = (user.aura % 100);

    return (
        <div className="flex min-h-screen flex-col p-6 pb-24 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-white">Welcome back,</h1>
                    <p className="text-accent-glow">{user.name?.split(' ')[0]}</p>
                </div>
                <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-accent/50">
                    {session.user.image && <img src={session.user.image} alt="Avatar" />}
                </div>
            </div>

            {/* Main Aura Display */}
            <div className="relative flex flex-col items-center justify-center py-10">
                <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full animate-pulse-slow pointer-events-none" />

                <div className="relative h-48 w-48 rounded-full border-4 border-accent/30 shadow-[0_0_50px_rgba(139,92,246,0.5)] flex items-center justify-center flex-col glass-panel backdrop-blur-xl">
                    <span className="text-5xl font-black text-white px-4 animate-in zoom-in spin-in-3 duration-700">
                        {user.aura}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-accent-glow mt-2 font-bold">
                        {auraTitle}
                    </span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Link
                    href="/groups/create"
                    className="bg-neutral-900 border border-neutral-800 hover:border-accent hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] p-4 rounded-2xl transition-all group"
                >
                    <Shield className="w-6 h-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-white text-sm">Create Group</h3>
                    <p className="text-[10px] text-neutral-500 mt-1">Start a new circle</p>
                </Link>
                <Link
                    href="/dashboard/history"
                    className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] p-4 rounded-2xl transition-all group"
                >
                    <Clock className="w-6 h-6 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-white text-sm">History</h3>
                    <p className="text-[10px] text-neutral-500 mt-1">View aura logs</p>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2">
                    <Shield className="text-emerald-400" size={24} />
                    <span className="text-xs text-neutral-400">Role</span>
                    <span className="font-bold text-white uppercase">{user.role}</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2">
                    <TrendingUp className="text-orange-400" size={24} />
                    <span className="text-xs text-neutral-400">Trend</span>
                    <span className="font-bold text-white">+5 (Today)</span>
                </div>
            </div>

            {/* Quick Actions / Info */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-neutral-300 flex items-center gap-2">
                    <Zap className="text-yellow-400" size={16} />
                    Active Effects
                </h3>
                <p className="text-xs text-neutral-500">
                    No active penalties or boosts currently applied to your account.
                </p>
            </div>

            {/* Settings / Sign Out */}
            <SignOutButton />
        </div>
    );
}
