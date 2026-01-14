import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Users } from "lucide-react";

export default async function GroupsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    // Fetch groups where user is a member
    // If Admin, fetch all? Requirement says: "Admin sees ALL groups"
    // Let's check logic:
    // "USER: Fetch groups via GroupMember"
    // "ADMIN: Fetch all groups"

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
        <div className="flex min-h-screen flex-col items-center p-8 md:p-24">
            <div className="w-full max-w-5xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Groups</h1>
                    <div className="space-x-4">
                        <Link
                            href="/groups/join"
                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        >
                            Join Group
                        </Link>
                        <Link
                            href="/groups/create"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Group
                        </Link>
                    </div>
                </div>

                {groups.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                        <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No groups yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Join a group or create a new one to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.map((group) => (
                            <Link key={group.id} href={`/groups/${group.id}`}>
                                <div className="block p-6 bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors shadow-sm hover:shadow-md">
                                    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white truncate">
                                        {group.name}
                                    </h2>
                                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                                        <span className="flex items-center">
                                            <Users className="w-4 h-4 mr-1" />
                                            {group._count.members} Members
                                        </span>
                                        {group.isFrozen && (
                                            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full dark:bg-red-900/30 dark:text-red-300">
                                                Frozen
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
