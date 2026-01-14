"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut()}
            className="w-full glass-button p-4 rounded-xl flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/20"
        >
            <LogOut size={18} />
            <span>Sign Out</span>
        </button>
    );
}
