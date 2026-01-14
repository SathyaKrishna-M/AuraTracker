import prisma from "@/lib/prisma";
import GroupRow from "./group-row";
import { Shield } from "lucide-react";

export default async function AdminGroupsPage() {
    const groups = await prisma.group.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            owner: {
                select: { name: true, email: true }
            },
            _count: {
                select: { members: true, incidents: true }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Shield className="text-purple-400" />
                        Group Moderation
                    </h2>
                    <p className="text-neutral-400 text-sm mt-1">
                        Manage all {groups.length} groups. Frozen groups cannot engage in new incidents.
                    </p>
                </div>
            </div>

            <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/30">
                <table className="w-full text-sm text-left">
                    <thead className="bg-neutral-900 text-neutral-400 uppercase font-medium border-b border-neutral-800">
                        <tr>
                            <th className="p-4">Group</th>
                            <th className="p-4">Owner</th>
                            <th className="p-4">Code</th>
                            <th className="p-4">Members</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                        {groups.map((group) => (
                            <GroupRow key={group.id} group={group} />
                        ))}
                        {groups.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-neutral-500">
                                    No groups found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
