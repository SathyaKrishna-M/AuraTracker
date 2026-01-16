import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Shield, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAuraTitle } from "@/lib/aura-utils";

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

    const isMember = group.members.some((m) => m.userId === session.user.id);
    const isAdmin = session.user.role === "ADMIN";

    if (!isMember && !isAdmin) {
        redirect("/groups");
    }

    const rankedMembers = [...group.members].sort((a, b) => b.user.aura - a.user.aura);

    return (
        <div className="min-h-screen bg-aura-black text-white p-6 pb-24">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center space-x-4 border-b border-aura-border pb-6">
                    <Link
                        href={`/groups/${groupId}`}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors border border-transparent hover:border-aura-border"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>

                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md border border-aura-border"
                            style={{ backgroundColor: (group as any).bgColor || "#3B82F6" }}
                        >
                            {(group as any).emoji || "👥"}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">
                                {group.name}
                            </h1>
                            <p className="text-xs font-medium text-accent uppercase tracking-widest mt-1">
                                Official Rankings
                            </p>
                        </div>
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
                                    "flex items-center p-4 rounded-xl border transition-all duration-300",
                                    isCurrentUser
                                        ? "bg-accent/10 border-accent/40 shadow-[0_0_20px_rgba(59,130,246,0.15)] relative z-10"
                                        : "bg-aura-dark border-aura-border hover:bg-white/5"
                                )}
                            >
                                {/* Rank */}
                                <div className="w-10 flex-shrink-0 flex items-center justify-center text-xl font-bold">
                                    {rankBadge || <span className="text-gray-600 text-sm">#{rank}</span>}
                                </div>

                                {/* Avatar & Name */}
                                <div className="flex-1 min-w-0 ml-3 flex items-center gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full overflow-hidden border-2",
                                        isCurrentUser ? "border-accent" : "border-aura-border"
                                    )}>
                                        {member.user.image ? (
                                            <Image src={member.user.image} alt="Avatar" width={40} height={40} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-aura-black flex items-center justify-center text-xs font-bold text-gray-500">
                                                {member.user.name?.[0]}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "font-bold text-sm truncate",
                                                isCurrentUser ? "text-white" : "text-gray-300"
                                            )}>
                                                {member.user.name || "Anonymous"}
                                            </span>
                                            {isCurrentUser && (
                                                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent bg-accent/10 rounded">
                                                    You
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                                            {getAuraTitle(member.user.aura)}
                                        </span>
                                    </div>
                                </div>

                                {/* Aura Score */}
                                <div className="text-right pl-4">
                                    <span className={cn(
                                        "text-xl font-black monospace-num block leading-none",
                                        member.user.aura >= 100 ? "text-emerald-400"
                                            : member.user.aura > 50 ? "text-gray-100"
                                                : "text-red-400"
                                    )}>
                                        {member.user.aura}
                                    </span>
                                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider">AURA</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
