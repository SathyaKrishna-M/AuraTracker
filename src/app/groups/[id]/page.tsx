import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireGroupAccess } from "@/lib/auth-utils";
import Link from "next/link";
import { ArrowLeft, Users, Shield, Copy, Plus } from "lucide-react";
import { getAuraTitle } from "@/lib/aura-utils";
import CreateIncidentForm from "@/components/create-incident-form";
import VoteButton from "@/components/vote-button";

export default async function GroupDetailPage({
    params,
}: {
    params: { id: string };
}) {
    // @ts-ignore
    const session = await getServerSession(authOptions);

    if (!session) redirect("/login");

    try {
        await requireGroupAccess(session.user.id, session.user.role, params.id);
    } catch (error) {
        redirect("/groups");
    }

    const group = await prisma.group.findUnique({
        where: { id: params.id },
        include: {
            owner: { select: { id: true, name: true, email: true } },
            members: {
                include: {
                    user: { select: { id: true, name: true, image: true, aura: true, role: true } },
                },
                orderBy: { user: { aura: 'desc' } }
            },
        },
    });

    if (!group) return <div>Group not found</div>;

    const incidents = await prisma.incident.findMany({
        where: { groupId: params.id },
        include: {
            targetUser: { select: { name: true } },
            votes: { select: { userId: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20
    });

    return (
        <div className="min-h-screen pb-24 p-4 md:p-8 space-y-6">
            {/* Header */}
            <header className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <Link href="/dashboard" className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-1 mb-4">
                            <ArrowLeft size={14} /> BACK
                        </Link>
                        <h1 className="text-3xl font-black text-white leading-tight">{group.name}</h1>
                        <div className="flex items-center gap-2 mt-2 text-xs font-bold text-neutral-500 uppercase tracking-widest">
                            <Shield size={12} />
                            <span>Owner: {group.owner.name}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Link
                            href={`/groups/${group.id}/leaderboard`}
                            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 transition-all"
                        >
                            <span>🏆 Leaderboard</span>
                        </Link>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase mb-1">Invite Code</span>
                            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                                <code className="text-lg font-mono font-bold text-accent-glow">{group.inviteCode}</code>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Members Section */}
            <section>
                <div className="flex items-center justify-between mb-3 px-1">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <Users size={16} className="text-accent" />
                        MEMBERS
                    </h2>
                    <span className="text-xs text-neutral-500 font-bold">{group.members.length} Total</span>
                </div>

                {/* Horizontal Scroll List */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {group.members.map((member) => (
                        <div key={member.user.id} className="glass-panel p-4 rounded-xl min-w-[140px] flex flex-col items-center gap-2 border-l-4 border-l-transparent hover:border-l-accent transition-all hover:bg-white/5">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
                                    {member.user.image ? (
                                        <img src={member.user.image} alt={member.user.name || ""} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-800" />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-aura-black text-[10px] font-bold px-1.5 rounded border border-white/10 text-white">
                                    {member.user.aura}
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-white truncate max-w-[100px]">{member.user.name}</p>
                                <p className="text-[10px] text-neutral-500 uppercase font-bold">{getAuraTitle(member.user.aura)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Actions & Incidents */}
            <div className="space-y-6">
                <CreateIncidentForm groupId={group.id} members={group.members} />

                <section>
                    <h2 className="text-sm font-bold text-white mb-4 px-1">RECENT ACTIVITY</h2>
                    <div className="space-y-3">
                        {incidents.length === 0 ? (
                            <div className="text-center py-10 glass-panel rounded-xl text-neutral-500 text-sm">
                                No incidents yet. Be the first to stir the pot!
                            </div>
                        ) : incidents.map((incident) => {
                            const hasVoted = incident.votes.some(v => v.userId === session.user.id);
                            const isTarget = incident.targetUserId === session.user.id;
                            return (
                                <div key={incident.id} className="glass-panel p-4 rounded-xl border-l-[3px] border-l-white/10 transition-colors hover:bg-white/5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-white text-sm">{incident.title}</h3>
                                            <p className="text-xs text-neutral-400 mt-0.5">
                                                Target: <span className="text-white">{incident.targetUser.name}</span>
                                            </p>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${incident.category.includes('GAIN')
                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                            : "bg-red-500/10 text-red-400 border-red-500/20"
                                            }`}>
                                            {incident.category.includes('GAIN') ? '+' : ''}
                                            {incident.category.includes('SMALL') ? '5' : incident.category.includes('MODERATE') ? '10' : '20'} Aura
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                        <span className="text-[10px] text-neutral-600 font-bold uppercase">
                                            {new Date(incident.createdAt).toLocaleDateString()}
                                        </span>
                                        <VoteButton
                                            incidentId={incident.id}
                                            hasVoted={hasVoted}
                                            isTarget={isTarget}
                                            status={incident.status}
                                            currentVotes={incident.votes.length}
                                            requiredVotes={incident.requiredVotes}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}
