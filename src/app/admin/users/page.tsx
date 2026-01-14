import prisma from "@/lib/prisma";
import UserRow from "./user-row";
import { Users } from "lucide-react";

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { aura: 'desc' },
        take: 50,
        include: {
            _count: {
                select: { createdIncidents: true }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users className="text-emerald-400" />
                        User Management
                    </h2>
                    <p className="text-neutral-400 text-sm mt-1">
                        Viewing top 50 users. Manage roles and correct aura discrepancies.
                    </p>
                </div>
                <div className="text-xs font-mono bg-neutral-900 px-3 py-1 rounded border border-neutral-800 text-neutral-500">
                    Total: {users.length}
                </div>
            </div>

            <div className="space-y-2">
                {users.map((user) => (
                    // @ts-ignore - Prisma types sometimes act up with mapped enums but runtime is fine
                    <UserRow key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
}
