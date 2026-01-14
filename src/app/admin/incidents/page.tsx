import prisma from "@/lib/prisma";
import IncidentRow from "./incident-row";
import { AlertTriangle } from "lucide-react";

export default async function AdminIncidentsPage() {
    const incidents = await prisma.incident.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            createdByUser: { select: { name: true, email: true } },
            targetUser: { select: { name: true, email: true } },
            group: { select: { name: true } },
            _count: { select: { votes: true } }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="text-orange-400" />
                        Incident Moderation
                    </h2>
                    <p className="text-neutral-400 text-sm mt-1">
                        Review {incidents.length} incidents across all groups.
                    </p>
                </div>
            </div>

            <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/30">
                <table className="w-full text-sm text-left">
                    <thead className="bg-neutral-900 text-neutral-400 uppercase font-medium border-b border-neutral-800">
                        <tr>
                            <th className="p-4">Incident</th>
                            <th className="p-4">Users</th>
                            <th className="p-4">Category</th>
                            <th className="p-4 text-center">Votes</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Overrides</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                        {incidents.map((incident) => (
                            <IncidentRow key={incident.id} incident={incident} />
                        ))}
                        {incidents.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-neutral-500">
                                    No incidents found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
