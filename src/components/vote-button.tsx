"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, Clock, ThumbsUp } from "lucide-react";

interface VoteButtonProps {
    incidentId: string;
    hasVoted: boolean;
    isTarget: boolean;
    status: "PENDING" | "VALIDATED" | "EXPIRED";
    currentVotes: number;
    requiredVotes: number;
}

export default function VoteButton({
    incidentId,
    hasVoted: initialHasVoted,
    isTarget,
    status: initialStatus,
    currentVotes: initialVotes,
    requiredVotes
}: VoteButtonProps) {
    const [loading, setLoading] = useState(false);
    const [hasVoted, setHasVoted] = useState(initialHasVoted);
    const [currentVotes, setCurrentVotes] = useState(initialVotes);
    const [status, setStatus] = useState(initialStatus);
    const router = useRouter();

    const handleVote = async () => {
        if (loading || hasVoted || isTarget || status !== "PENDING") return;

        setLoading(true);
        try {
            const res = await fetch("/api/incidents/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ incidentId }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Vote failed");
            }

            setHasVoted(true);
            setCurrentVotes(prev => prev + 1);

            if (currentVotes + 1 >= requiredVotes) {
                setStatus("VALIDATED");
            }

            router.refresh();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (status === "VALIDATED") {
        return (
            <div className="flex items-center text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Check className="w-3 h-3 mr-1" />
                Validated
            </div>
        );
    }

    if (status === "EXPIRED") {
        return (
            <div className="flex items-center text-neutral-500 bg-neutral-800 border border-neutral-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Clock className="w-3 h-3 mr-1" />
                Expired
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className="text-[10px] uppercase font-bold text-neutral-500">
                {currentVotes}/{requiredVotes} votes
            </div>

            {isTarget ? (
                <span className="text-[10px] text-neutral-600 font-bold uppercase">Target</span>
            ) : hasVoted ? (
                <span className="text-[10px] text-accent-glow font-bold uppercase flex items-center gap-1">
                    <Check size={12} />
                    Voted
                </span>
            ) : (
                <button
                    onClick={handleVote}
                    disabled={loading}
                    className="flex items-center px-3 py-1.5 bg-accent hover:bg-accent/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-accent/20 disabled:opacity-50 active:scale-95"
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : (
                        <span className="flex items-center gap-1"><ThumbsUp size={12} /> Approve</span>
                    )}
                </button>
            )}
        </div>
    );
}
