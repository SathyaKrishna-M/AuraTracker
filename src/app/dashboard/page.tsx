import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getAuraTitle, getAuraProgress } from "@/lib/aura-utils";
import { Shield, Zap, TrendingUp, Clock, ArrowRight } from "lucide-react";


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
    const { progress, nextTitle, remaining, nextThreshold } = getAuraProgress(user.aura);

    // Circle config for Professional Look
    // Inner Circle is w-40 h-40 (160px)
    // We want a gap of 16px
    // Inner Ring Radius = 80 + 16 = 96px
    // Stroke = 12px
    // Center Radius (r) = 96 + 6 = 102px
    const radius = 102;
    const stroke = 12;
    const normalizedRadius = radius;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const size = (radius + stroke) * 2 + 40; // Total SVG size with padding

    return (
        <div className="flex min-h-screen flex-col p-6 pb-24 space-y-8 bg-aura-black">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back,</h1>
                    <p className="text-accent font-medium">{user.name?.split(' ')[0]}</p>
                </div>
                <div className="h-10 w-10 rounded-full overflow-hidden border border-aura-border bg-aura-dark">
                    {session.user.image && <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />}
                </div>
            </div>

            {/* Circular Progress Aura Card */}
            <div className="relative flex flex-col items-center justify-center py-8">
                <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>

                    {/* Background Glow behind the whole unit */}
                    <div className="absolute inset-0 bg-accent/10 blur-[100px] rounded-full pointer-events-none opacity-30" />

                    <svg
                        height={size}
                        width={size}
                        className="transform -rotate-90 absolute inset-0 m-auto"
                        viewBox={`0 0 ${size} ${size}`}
                    >
                        <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {/* Track Circle */}
                        <circle
                            stroke="#1e293b" // aura-darker
                            strokeWidth={stroke}
                            fill="transparent"
                            r={normalizedRadius}
                            cx={size / 2}
                            cy={size / 2}
                            strokeLinecap="round"
                            className="opacity-40"
                        />

                        {/* Progress Circle with Gradient & Glow */}
                        <circle
                            stroke="url(#progressGradient)"
                            strokeWidth={stroke}
                            strokeDasharray={circumference + ' ' + circumference}
                            style={{ strokeDashoffset }}
                            strokeLinecap="round"
                            fill="transparent"
                            r={normalizedRadius}
                            cx={size / 2}
                            cy={size / 2}
                            className="transition-[stroke-dashoffset] duration-[1.5s] ease-out drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                        />
                    </svg>

                    {/* Inner Content - Floating Circle Card */}
                    {/* w-40 = 160px. Gap calculations ensure ring is outside this. */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-40 h-40 rounded-full bg-linear-to-b from-aura-dark to-black border border-white/5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col items-center justify-center gap-0.5 z-10">

                            <span className="text-5xl font-black text-white monospace-num tracking-tighter drop-shadow-lg">
                                {user.aura}
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                                {auraTitle}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress Label */}
                {nextThreshold !== null && (
                    <div className="mt-2 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                        <div className="px-4 py-1.5 rounded-full bg-aura-dark border border-white/5 shadow-sm">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                <span className="text-accent">{remaining} Aura</span> to {nextTitle}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
                <Link
                    href="/groups/create"
                    className="bg-aura-dark hover:bg-aura-card border border-aura-border p-5 rounded-2xl transition-all group flex flex-col gap-3 active:scale-95"
                >
                    <div className="bg-accent/10 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">New Group</h3>
                        <p className="text-[10px] text-gray-500 mt-0.5">Start a fresh circle</p>
                    </div>
                </Link>
                <Link
                    href="/dashboard/history"
                    className="bg-aura-dark hover:bg-aura-card border border-aura-border p-5 rounded-2xl transition-all group flex flex-col gap-3 active:scale-95"
                >
                    <div className="bg-emerald-500/10 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                        <Clock className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">History</h3>
                        <p className="text-[10px] text-gray-500 mt-0.5">View your logs</p>
                    </div>
                </Link>
            </div>

            {/* Stats / Info - Flat Design */}
            <div className="bg-aura-dark border border-aura-border rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-500/10 p-2 rounded-lg">
                            <TrendingUp className="text-orange-500 w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Trend</h3>
                            <p className="text-[10px] text-gray-500">Last 7 days</p>
                        </div>
                    </div>
                    <span className="text-white font-mono font-bold">+0</span>
                </div>

                <div className="h-px bg-aura-border" />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-500/10 p-2 rounded-lg">
                            <Zap className="text-purple-500 w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Status</h3>
                            <p className="text-[10px] text-gray-500">Active effects</p>
                        </div>
                    </div>
                    <span className="text-xs text-gray-500">None</span>
                </div>
            </div>

            {/* Settings Link */}
            {/* Removed SignOutButton from Dashboard */}
        </div>
    );
}
