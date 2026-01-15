"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreateGroupPage() {
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("👥");
    const [color, setColor] = useState("#3B82F6"); // Default Blue
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const PRESET_COLORS = [
        "#3B82F6", // Blue
        "#22C55E", // Green
        "#8B5CF6", // Violet
        "#F97316", // Orange
        "#EF4444", // Red
        "#14B8A6", // Teal
        "#64748B"  // Slate
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/groups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, emoji, bgColor: color }),
            });

            if (!res.ok) throw new Error("Failed to create group");

            const group = await res.json();
            router.push(`/groups/${group.id}`);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-aura-black">
            <div className="w-full max-w-md bg-aura-dark p-8 rounded-2xl border border-aura-border shadow-lg">
                <Link
                    href="/groups"
                    className="flex items-center text-sm text-gray-500 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Groups
                </Link>

                <h1 className="text-2xl font-bold mb-6 text-white tracking-tight">Create a New Group</h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Icon Selection */}
                    <div className="flex flex-col items-center gap-4 mb-6">
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-2xl border-4 border-aura-black transition-all duration-300"
                            style={{ backgroundColor: color }}
                        >
                            {emoji}
                        </div>

                        <div className="w-full space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Group Icon Emoji</label>
                                <input
                                    type="text"
                                    value={emoji}
                                    onChange={(e) => setEmoji(e.target.value)}
                                    maxLength={2}
                                    className="w-full bg-aura-black border border-aura-border rounded-lg px-3 py-2 text-center text-xl text-white focus:border-accent focus:outline-none"
                                    placeholder="Emoji"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Background Color</label>
                                <div className="flex justify-center gap-2 flex-wrap">
                                    {PRESET_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setColor(c)}
                                            className={cn(
                                                "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                                                color === c ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                                            )}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-bold text-gray-300 mb-1">
                            Group Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-aura-black block w-full rounded-lg border border-aura-border px-4 py-3 text-white shadow-sm focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none sm:text-sm placeholder-gray-600 transition-colors"
                            placeholder="e.g. The Avengers"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center btn-primary"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Group"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
