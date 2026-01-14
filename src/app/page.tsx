import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[500px] w-[500px] animate-pulse-slow rounded-full bg-accent/20 blur-[100px]" />
            <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] animate-pulse-slow rounded-full bg-accent-secondary/10 blur-[100px] delay-1000" />

            <div className="z-10 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-accent to-accent-glow shadow-[0_0_40px_rgba(139,92,246,0.3)] animate-float">
                    <Sparkles className="text-white" size={40} />
                </div>

                <div className="space-y-4 max-w-lg">
                    <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-neutral-400">
                        AuraTracker
                    </h1>
                    <p className="text-lg text-neutral-400 font-medium">
                        The definitive tool for tracking your group's karma, reputation, and social standing.
                    </p>
                </div>

                <div className="flex flex-col w-full max-w-xs gap-4">
                    <Link
                        href="/login"
                        className="group relative flex items-center justify-center w-full gap-2 overflow-hidden rounded-xl bg-white text-black px-8 py-4 text-base font-bold shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-white/20"
                    >
                        <span>Enter the Aura</span>
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="pt-12 grid grid-cols-3 gap-8 text-center text-neutral-500 text-xs font-bold uppercase tracking-widest">
                    <div>
                        <span className="block text-xl text-white mb-1">Live</span>
                        Updates
                    </div>
                    <div>
                        <span className="block text-xl text-white mb-1">Secure</span>
                        Voting
                    </div>
                    <div>
                        <span className="block text-xl text-white mb-1">Mobile</span>
                        First
                    </div>
                </div>
            </div>
        </main>
    );
}
