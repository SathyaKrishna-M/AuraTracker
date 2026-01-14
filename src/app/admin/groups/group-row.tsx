"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ShieldCheck, Users } from "lucide-react";

interface GroupRowProps {
    group: {
        id: string;
        name: string;
        inviteCode: string;
        isFrozen: boolean;
        _count: {
            members: number;
            incidents: number;
        };
        owner: {
            email: string | null;
            name: string | null;
        };
    };
}

export default function GroupRow({ group }: GroupRowProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const toggleFreeze = async () => {
        if (!confirm(`Are you sure you want to ${group.isFrozen ? "UNFREEZE" : "FREEZE"} this group?`)) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/groups/freeze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    groupId: group.id,
                    isFrozen: !group.isFrozen
                })
            });

            if (!res.ok) throw new Error(await res.text());
            router.refresh();
        } catch (error) {
            alert("Failed to update group: " + error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <tr className={`border-b border-neutral-800 hover:bg-neutral-900/50 transition-colors ${group.isFrozen ? "bg-red-900/10" : ""}`}>
            <td className="p-4">
                <div className="font-medium text-white">{group.name}</div>
                <div className="text-xs text-neutral-500 font-mono">{group.id}</div>
            </td>
            <td className="p-4 text-neutral-400">
                <div>{group.owner.name || "Unknown"}</div>
                <div className="text-xs text-neutral-600">{group.owner.email}</div>
            </td>
            <td className="p-4 text-neutral-400 font-mono">
                {group.inviteCode}
            </td>
            <td className="p-4">
                <div className="flex items-center gap-2 text-neutral-400">
                    <Users size={16} />
                    <span>{group._count.members}</span>
                </div>
            </td>
            <td className="p-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${group.isFrozen
                        ? "bg-red-900/30 text-red-500 border border-red-900"
                        : "bg-green-900/30 text-green-500 border border-green-900"
                    }`}>
                    {group.isFrozen ? "FROZEN" : "ACTIVE"}
                </span>
            </td>
            <td className="p-4 text-right">
                <button
                    onClick={toggleFreeze}
                    disabled={isLoading}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors border ${group.isFrozen
                            ? "border-green-800 text-green-400 hover:bg-green-900/20"
                            : "border-red-800 text-red-400 hover:bg-red-900/20"
                        }`}
                >
                    {isLoading ? "..." : group.isFrozen ? "Unfreeze" : "Freeze"}
                </button>
            </td>
        </tr>
    );
}
