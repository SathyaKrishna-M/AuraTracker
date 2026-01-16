"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, X, Clock } from "lucide-react";
import { useToast } from "@/lib/toast-context";

interface VoteButtonProps {
    incidentId: string;
    userVoteType?: "APPROVE" | "DISAPPROVE" | null;
    isTarget: boolean;
    status: "PENDING" | "VALIDATED" | "EXPIRED";
    approvalsCount: number;
    disapprovalsCount: number;
    requiredVotes: number;
}

export default function VoteButton({
    incidentId,
    userVoteType: initialUserVoteType,
    isTarget,
    status: initialStatus,
    approvalsCount: initialApprovals,
    disapprovalsCount: initialDisapprovals,
    requiredVotes
}: VoteButtonProps) {
    const [loading, setLoading] = useState(false);
    const [userVoteType, setUserVoteType] = useState(initialUserVoteType);
    const [approvals, setApprovals] = useState(initialApprovals);
    const [disapprovals, setDisapprovals] = useState(initialDisapprovals);
    const [status, setStatus] = useState(initialStatus);
    const router = useRouter();
    const toast = useToast();

    const handleVote = async (type: "APPROVE" | "DISAPPROVE") => {
        if (loading || userVoteType || isTarget || status !== "PENDING") return;

        setLoading(true);
        try {
            const res = await fetch("/api/incidents/vote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ incidentId, voteType: type }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Vote failed");
            }

            setUserVoteType(type);
            if (type === "APPROVE") {
                const newCount = approvals + 1;
                setApprovals(newCount);
                if (newCount >= requiredVotes) setStatus("VALIDATED");
            } else {
                const newCount = disapprovals + 1;
                setDisapprovals(newCount);
                if (newCount >= requiredVotes) setStatus("EXPIRED");
            }

            router.refresh();
        } catch (error: any) {
            router.refresh();
            toast.error(error.message);
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
            <div className="flex items-center text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {disapprovals >= requiredVotes ? <X className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                Expired
            </div>
        );
    }

    const hasVoted = !!userVoteType;

    return (
        <div className="flex items-center gap-4">
            {/* Vote Counters */}
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-neutral-500">
                <div className="flex items-center gap-1" title="Approvals">
                    <Check size={12} className="text-emerald-500" />
                    <span className="text-emerald-500/80">{approvals}</span>
                    <span className="text-neutral-700">/</span>
                    <span>{requiredVotes}</span>
                </div>
                <div className="flex items-center gap-1" title="Disapprovals">
                    <X size={12} className="text-red-500" />
                    <span className="text-red-500/80">{disapprovals}</span>
                    <span className="text-neutral-700">/</span>
                    <span>{requiredVotes}</span>
                </div>
            </div>

            {isTarget ? (
                <span className="text-[10px] text-neutral-600 font-bold uppercase">Target</span>
            ) : hasVoted ? (
                <div className="flex items-center gap-2">
                    {userVoteType === 'APPROVE' ? (
                        <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            <Check size={12} /> Approved
                        </span>
                    ) : (
                        <span className="text-[10px] text-red-400 font-bold uppercase flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                            <X size={12} /> Disapproved
                        </span>
                    )}
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    {/* Approve Button */}
                    <button
                        onClick={() => handleVote("APPROVE")}
                        disabled={loading}
                        className="w-10 h-10 flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-500 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                        title="Approve"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    </button>

                    {/* Disapprove Button */}
                    <button
                        onClick={() => handleVote("DISAPPROVE")}
                        disabled={loading}
                        className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                        title="Disapprove"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    </button>
                </div>
            )}
        </div>
    );
}
