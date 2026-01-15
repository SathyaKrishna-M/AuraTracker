import { Trophy } from "lucide-react";
import Link from "next/link";

export default function RankingsPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-aura-black text-center space-y-6 pb-24">
            <div className="relative">
                <div className="absolute inset-0 bg-accent/20 blur-[60px] rounded-full animate-pulse-slow pointer-events-none" />
                <div className="relative bg-aura-card border border-aura-border p-6 rounded-full inline-flex">
                    <Trophy className="w-12 h-12 text-accent" />
                </div>
            </div>

            <div className="space-y-2 max-w-xs mx-auto">
                <h1 className="text-2xl font-bold text-white tracking-tight">Global Rankings</h1>
                <p className="text-sm text-gray-500">
                    We are building a global leaderboard to see who has the highest Aura across all groups.
                </p>
            </div>

            <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-xs font-mono font-bold text-accent-glow uppercase tracking-widest animate-pulse">
                    Coming Soon
                </span>
            </div>

            <Link href="/groups" className="btn-secondary text-xs">
                View Group Leaderboards
            </Link>
        </div>
    );
}
