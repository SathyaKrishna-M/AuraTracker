"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
    "#3B82F6", // Blue (default)
    "#22C55E", // Green
    "#8B5CF6", // Violet
    "#F97316", // Orange
    "#EF4444", // Red
    "#14B8A6", // Teal
    "#64748B"  // Slate
];

interface GroupIconSettingsProps {
    groupId: string;
    initialEmoji: string;
    initialColor: string;
    onClose: () => void;
    onUpdate: (emoji: string, color: string) => void;
}

export default function GroupIconSettings({
    groupId,
    initialEmoji,
    initialColor,
    onClose,
    onUpdate
}: GroupIconSettingsProps) {
    const [emoji, setEmoji] = useState(initialEmoji);
    const [color, setColor] = useState(initialColor);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/groups/${groupId}/icon`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emoji, bgColor: color }),
            });

            if (!res.ok) throw new Error("Failed to update icon");

            const data = await res.json();
            onUpdate(data.emoji, data.bgColor);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to update icon");
        } finally {
            setLoading(false);
        }
    };

    // Use portal to avoid z-index/clipping issues with parent containers
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] animate-in fade-in duration-200">
            {/* Desktop Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm hidden md:block" onClick={onClose} />

            {/* Layout Wrapper - Full screen on mobile, Centered grid on desktop */}
            <div className="absolute inset-0 md:relative md:inset-auto md:flex md:min-h-screen md:items-center md:justify-center pointer-events-none">

                {/* Modal Card / Full Page */}
                <div className="w-full h-full md:h-auto md:max-h-[85vh] md:max-w-sm bg-aura-dark md:border md:border-aura-border md:rounded-2xl shadow-none md:shadow-2xl flex flex-col pointer-events-auto overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 pb-2 shrink-0 bg-aura-dark z-20">
                        <h2 className="text-xl font-bold text-white">Customize Icon</h2>
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 pt-2 bg-aura-dark">
                        <p className="text-sm text-gray-400 mb-8">Choose an emoji and color for your group.</p>

                        {/* Preview */}
                        <div className="flex justify-center mb-10">
                            <div
                                className="w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-2xl transition-all duration-300 ring-4 ring-aura-black"
                                style={{ backgroundColor: color }}
                            >
                                {emoji}
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Emoji Input */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Emoji</label>
                                <input
                                    type="text"
                                    value={emoji}
                                    onChange={(e) => setEmoji(e.target.value)}
                                    maxLength={2}
                                    className="w-full bg-aura-black border border-aura-border rounded-xl px-4 py-4 text-center text-3xl text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                    placeholder="Enter Emoji"
                                />
                                <p className="text-[10px] text-gray-600 text-center">
                                    Type any emoji (Windows: Win + .)
                                </p>
                            </div>

                            {/* Color Palette */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Background Color</label>
                                <div className="grid grid-cols-7 gap-2">
                                    {PRESET_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={cn(
                                                "aspect-square rounded-full border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50",
                                                color === c ? "border-white scale-110 shadow-lg ring-2 ring-white/20" : "border-transparent opacity-60 hover:opacity-100"
                                            )}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-aura-border bg-aura-dark shrink-0 safe-area-bottom z-20">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full btn-primary py-4 text-lg font-bold flex justify-center items-center shadow-lg active:scale-[0.98] transition-all"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
