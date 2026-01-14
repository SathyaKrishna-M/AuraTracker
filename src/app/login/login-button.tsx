"use client";

import { signIn } from "next-auth/react";
import { ArrowRight } from "lucide-react";

export default function LoginButton() {
    return (
        <button
            onClick={() => signIn("google")}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-accent to-accent-glow px-8 py-3.5 text-sm font-bold text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-accent/50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-aura-black"
        >
            <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            <span>Sign in with Google</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
    );
}
