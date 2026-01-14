"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle, X } from "lucide-react";

interface Member {
    user: {
        id: string;
        name: string | null;
    };
}

interface CreateIncidentFormProps {
    groupId: string;
    members: Member[];
}

const CATEGORIES = [
    { value: "SMALL_GAIN", label: "+5  ● Small Gain", color: "text-green-400" },
    { value: "MODERATE_GAIN", label: "+10 ● Moderate Gain", color: "text-green-300" },
    { value: "HIGH_GAIN", label: "+20 ● High Gain", color: "text-green-200" },
    { value: "SMALL_LOSS", label: "-5  ● Small Loss", color: "text-red-400" },
    { value: "MODERATE_LOSS", label: "-10 ● Moderate Loss", color: "text-red-500" },
    { value: "HIGH_LOSS", label: "-20 ● High Loss", color: "text-red-600" },
];

export default function CreateIncidentForm({ groupId, members }: CreateIncidentFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [targetUserId, setTargetUserId] = useState("");
    const [category, setCategory] = useState("SMALL_GAIN");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/incidents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    groupId,
                    targetUserId,
                    category,
                    title,
                    description,
                }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Failed to create incident");
            }

            setIsOpen(false);
            setTitle("");
            setDescription("");
            setTargetUserId("");
            setCategory("SMALL_GAIN");
            router.refresh();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full py-4 px-4 glass-button rounded-xl text-accent-glow hover:text-white transition-all flex items-center justify-center font-bold tracking-wide"
            >
                <AlertTriangle className="w-5 h-5 mr-2" />
                REPORT INCIDENT
            </button>
        );
    }

    return (
        <div className="glass-panel p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="text-orange-500" />
                    Report Incident
                </h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="text-neutral-400" size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">Target User</label>
                    <select
                        required
                        value={targetUserId}
                        onChange={(e) => setTargetUserId(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white focus:ring-2 focus:ring-accent outline-none"
                    >
                        <option value="">Select a member...</option>
                        {members.map((m) => (
                            <option key={m.user.id} value={m.user.id}>
                                {m.user.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c.value}
                                type="button"
                                onClick={() => setCategory(c.value)}
                                className={`text-left px-3 py-2 rounded-lg text-xs font-bold transition-all border ${category === c.value
                                        ? `bg-white/10 border-accent text-white ring-1 ring-accent`
                                        : "bg-black/30 border-transparent text-neutral-500 hover:bg-white/5"
                                    }`}
                            >
                                <span className={category === c.value ? c.color : ""}>{c.label.split('●')[1]}</span>
                                <span className={`block text-[10px] mt-0.5 ${category === c.value ? "opacity-100" : "opacity-50"}`}>{c.label.split('●')[0]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">Title</label>
                    <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Saved a kitten"
                        className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white focus:ring-2 focus:ring-accent outline-none placeholder:text-neutral-600"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase tracking-wider">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Details..."
                        className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white focus:ring-2 focus:ring-accent outline-none placeholder:text-neutral-600"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-accent to-accent-glow hover:shadow-lg hover:shadow-accent/20 rounded-xl transition-all disabled:opacity-50"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        SUBMIT REPORT
                    </button>
                </div>
            </form>
        </div>
    );
}
