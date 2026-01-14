import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginButton from "./login-button";
import { Sparkles } from "lucide-react";

export default async function LoginPage() {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
            {/* Background Effects */}
            <div className="pointer-events-none absolute -top-20 right-0 h-96 w-96 animate-pulse-slow rounded-full bg-accent-glow/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 animate-pulse-slow rounded-full bg-accent-secondary/10 blur-3xl delay-1000" />

            {/* Main Card */}
            <div className="glass-panel relative z-10 w-full max-w-sm overflow-hidden rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="mb-8 flex justify-center">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-accent to-accent-glow shadow-lg animate-float">
                        <Sparkles className="text-white" size={32} />
                    </div>
                </div>

                <h1 className="mb-2 text-3xl font-black tracking-tight text-white">
                    AuraTracker
                </h1>
                <p className="mb-8 text-sm text-neutral-400">
                    Enter the realm. Track your group's karma.
                </p>

                <LoginButton />

                <p className="mt-6 text-xs text-neutral-600">
                    By entering, you agree to respect the Aura.
                </p>
            </div>
        </div>
    );
}
