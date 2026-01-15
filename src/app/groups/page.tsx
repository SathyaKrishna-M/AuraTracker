import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Users, Search, FolderOpen } from "lucide-react";

export default async function GroupsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    let groups = [];
    if (session.user.role === "ADMIN") {
        groups = await prisma.group.findMany({
            include: { _count: { select: { members: true } } },
            orderBy: { createdAt: 'desc' }
        });
    } else {
        groups = await prisma.group.findMany({
            where: {
                members: {
                    some: { userId: session.user.id }
                }
            },
            include: { _count: { select: { members: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    return (
        <div className="flex min-h-screen flex-col bg-aura-black pb-24">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-aura-black/80 backdrop-blur-xl border-b border-aura-border px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-white tracking-tight">Your Groups</h1>
                <Link
                    href="/groups/create"
                    className="btn-primary flex items-center gap-1.5"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">New</span>
                </Link>
            </div>

            {/* List Content */}
            <div className="p-6">
                {groups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-aura-dark rounded-full flex items-center justify-center border border-aura-border">
                            <FolderOpen className="w-8 h-8 text-gray-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">No groups yet</h3>
                            <p className="text-sm text-gray-500 max-w-[200px] mx-auto mt-1">Join an existing group or start your own circle.</p>
                        </div>
                        <div className="flex gap-3 mt-2">
                            <Link
                                href="/groups/join"
                                className="btn-secondary"
                            >
                                Join Group
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {groups.map((group) => (
                            <Link key={group.id} href={`/groups/${group.id}`}>
                                <div className="glass-card p-4 hover:border-accent/40 hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-between group">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm border border-aura-border transition-transform group-hover:scale-105"
                                        style={{ backgroundColor: (group as any).bgColor || "#3B82F6" }}
                                    >
                                        {(group as any).emoji || "👥"}
                                    </div>

                                    <div className="flex-1 min-w-0 pr-4 pl-4">
                                        <h2 className="text-base font-bold text-white truncate group-hover:text-accent transition-colors">
                                            {group.name}
                                        </h2>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="flex items-center text-xs text-gray-500 font-medium">
                                                <Users className="w-3 h-3 mr-1.5" />
                                                {group._count.members} Members
                                            </span>
                                            {group.isFrozen && (
                                                <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded border border-red-500/20">
                                                    Frozen
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-8 h-8 rounded-full bg-aura-dark flex items-center justify-center border border-aura-border group-hover:border-accent/30 transition-colors">
                                        <span className="text-gray-400 group-hover:text-accent font-bold text-xs">GO</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Search/Join - If list is long, maybe useful, but sticking to header action for minimal mobile design */}
            {
                groups.length > 0 && (
                    <div className="fixed bottom-24 right-6 left-6 flex justify-center pointer-events-none">
                        <Link
                            href="/groups/join"
                            className="pointer-events-auto shadow-lg shadow-black/40 bg-aura-dark/90 backdrop-blur border border-aura-border text-xs font-bold text-gray-300 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/10 hover:text-white transition-all"
                        >
                            <Search className="w-3 h-3" />
                            Find New Groups
                        </Link>
                    </div>
                )
            }
        </div >
    );
}
