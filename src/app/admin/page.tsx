import prisma from "@/lib/prisma";
import Link from "next/link";
import { Users, Shield, AlertTriangle } from "lucide-react";

export default async function AdminDashboard() {
    const [userCount, groupCount, incidentCount] = await Promise.all([
        prisma.user.count(),
        prisma.group.count(),
        prisma.incident.count(),
    ]);

    const stats = [
        { label: "Total Users", value: userCount, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
        { label: "Total Groups", value: groupCount, icon: Shield, color: "text-purple-400", bg: "bg-purple-400/10" },
        { label: "Total Incidents", value: incidentCount, icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-400/10" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Overview</h2>
                <p className="text-neutral-400">System-wide statistics and monitoring.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-400">{stat.label}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    href="/admin/users"
                    className="block p-6 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 transition-colors group"
                >
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400">Moderate Users &rarr;</h3>
                    <p className="text-neutral-400">View user database, correct aura scores, and assign admin roles.</p>
                </Link>
                <Link
                    href="/admin/groups"
                    className="block p-6 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-purple-500/50 transition-colors group"
                >
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400">Moderate Groups &rarr;</h3>
                    <p className="text-neutral-400">View all groups, freeze bad actors, and audit memberships.</p>
                </Link>
                <Link
                    href="/admin/incidents"
                    className="block p-6 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 transition-colors group"
                >
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400">Moderate Incidents &rarr;</h3>
                    <p className="text-neutral-400">Force expire invalid incidents, validate pending ones, and manage disputes.</p>
                </Link>
            </div>
        </div>
    );
}
