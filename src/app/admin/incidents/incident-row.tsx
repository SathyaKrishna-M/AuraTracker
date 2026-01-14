"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface IncidentRowProps {
    incident: {
        id: string;
        title: string;
        status: string;
        category: string;
        createdAt: Date;
        createdByUser: { email: string | null; name: string | null };
        targetUser: { email: string | null; name: string | null };
        group: { name: string };
        _count: { votes: number };
    };
}

export default function IncidentRow({ incident }: IncidentRowProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async (action: 'expire' | 'override') => {
        const verb = action === 'expire' ? "FORCE EXPIRE" : "FORCE VALIDATE";
        if (!confirm(`Are you sure you want to ${verb} this incident?\nThis cannot be undone.`)) return;

        setIsLoading(true);
        try {
            const endpoint = action === 'expire'
                ? "/api/admin/incidents/expire"
                : "/api/admin/incidents/override";

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ incidentId: incident.id })
            });

            if (!res.ok) throw new Error(await res.text());
            router.refresh();
        } catch (error) {
            alert("Failed: " + error);
        } finally {
            setIsLoading(false);
        }
    };

    const statusColors = {
        PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        VALIDATED: "bg-green-500/10 text-green-500 border-green-500/20",
        EXPIRED: "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
    };

    return (
        <tr className="border-b border-neutral-800 hover:bg-neutral-900/50 transition-colors">
            <td className="p-4">
                <div className="font-medium text-white">{incident.title}</div>
                <div className="text-xs text-neutral-500">{new Date(incident.createdAt).toLocaleDateString()}</div>
                <div className="text-xs text-neutral-600 font-mono mt-1">{incident.id}</div>
            </td>
            <td className="p-4 text-neutral-400">
                <div className="text-xs">From: <span className="text-white">{incident.createdByUser.name}</span></div>
                <div className="text-xs">To: <span className="text-white">{incident.targetUser.name}</span></div>
                <div className="text-xs mt-1 text-neutral-600">In: {incident.group.name}</div>
            </td>
            <td className="p-4">
                <span className="text-xs font-mono bg-neutral-800 text-neutral-300 px-2 py-1 rounded">
                    {incident.category}
                </span>
            </td>
            <td className="p-4 text-center">
                <span className="font-bold text-white">{incident._count.votes}</span>
            </td>
            <td className="p-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[incident.status as keyof typeof statusColors] || statusColors.EXPIRED}`}>
                    {incident.status}
                </span>
            </td>
            <td className="p-4 text-right space-x-2">
                {incident.status === 'PENDING' && (
                    <>
                        <button
                            onClick={() => handleAction('expire')}
                            disabled={isLoading}
                            className="px-2 py-1 rounded text-xs font-bold border border-red-900 text-red-500 hover:bg-red-900/20 disabled:opacity-50"
                        >
                            EXPIRE
                        </button>
                        <button
                            onClick={() => handleAction('override')}
                            disabled={isLoading}
                            className="px-2 py-1 rounded text-xs font-bold border border-green-900 text-green-500 hover:bg-green-900/20 disabled:opacity-50"
                        >
                            VALIDATE
                        </button>
                    </>
                )}
            </td>
        </tr>
    );
}
