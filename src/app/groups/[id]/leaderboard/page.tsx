import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    params: {
        id: string;
    };
}

export default async function GroupLeaderboardPage({ params }: Props) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const groupId = params.id;

    // 1. Fetch Group & Members
    const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
            members: {
                include: {
                    user: true,
                },
            },
        },
    });

    if (!group) {
        return <div>Group not found</div>;
    }

    // 2. Auth Check: Member or Admin
    // Use 'any' type for find method to avoid strict boolean context issues with complex prisma types if needed, 
    // but standard find should work.
    const isMember = group.members.some((m) => m.userId === session.user.id);
    const isAdmin = session.user.role === "ADMIN";

    if (!isMember && !isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Shield className="mx-auto h-12 w-12 text-zinc-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-zinc-400 mb-4">You must be a member of this group to view the leaderboard.</p>
                    <Link href="/groups" className="text-indigo-400 hover:text-indigo-300">
                        Back to Groups
                    </Link>
                </div>
            </div>
        );
    }

    // 3. Sort Users by Aura DESC
    const rankedMembers = [...group.members].sort((a, b) => b.user.aura - a.user.aura);

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Link
                        href={`/groups/${groupId}`}
                        className="p-2 hover:bg-zinc-900 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            {group.name} Leaderboard
                        </h1>
                        <p className="text-zinc-400 text-sm">
                            Ranked by Aura Score
                        </p>
                    </div>
                </div>

                {/* Leaderboard List */}
                <div className="space-y-3">
                    {rankedMembers.map((member, index) => {
                        const rank = index + 1;
                        const isCurrentUser = member.userId === session.user.id;

                        let rankBadge = null;
                        if (rank === 1) rankBadge = "🥇";
                        else if (rank === 2) rankBadge = "🥈";
                        else if (rank === 3) rankBadge = "🥉";

                        return (
                            <div
                                key={member.userId}
                                className={cn(
                                    "flex items-center p-4 rounded-xl border transition-all",
                                    isCurrentUser
                                        ? "bg-zinc-900/50 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                                        : "bg-zinc-950 border-zinc-900"
                                )}
                            >
                                {/* Rank */}
                                <div className="w-12 flex-shrink-0 flex items-center justify-center text-xl font-bold text-zinc-500">
                                    {rankBadge || `#${rank}`}
                                </div>

                                {/* Avatar & Name */}
                                <div className="flex-1 min-w-0 ml-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium truncate text-zinc-200">
                                            {member.user.name || "Anonymous"}
                                        </span>
                                        {isCurrentUser && (
                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-400/10 rounded-full">
                                                You
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Aura Score */}
                                <div className="text-right">
                                    <span className={cn(
                                        "text-xl font-bold font-mono",
                                        member.user.aura >= 100 ? "text-emerald-400"
                                            : member.user.aura > 50 ? "text-zinc-200"
                                                : "text-red-400"
                                    )}>
                                        {member.user.aura}
                                    </span>
                                    <span className="text-xs text-zinc-500 block">AURA</span>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
