import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Clock, TrendingUp, TrendingDown, Shield } from "lucide-react";

export default async function AdminUserHistoryPage({
    params
}: {
    params: { userId: string }
}) {
    // @ts-ignore
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/");
    }

    const [user, history] = await Promise.all([
        prisma.user.findUnique({ where: { id: params.userId } }),
        prisma.auraHistory.findMany({
            where: { userId: params.userId },
            orderBy: { createdAt: 'desc' },
            include: {
                group: { select: { name: true } }
            }
        })
    ]);

    if (!user) return <div>User not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/users"
                        className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Clock className="text-accent" size={24} />
                            Audit Log
                        </h1>
                        <p className="text-neutral-400 text-sm">
                            History for <span className="font-bold text-white">{user.name}</span>
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold text-neutral-500 uppercase">Current Aura</div>
                    <div className="text-2xl font-black text-accent-glow">{user.aura}</div>
                </div>
            </div>

            <div className="glass-panel rounded-xl overflow-hidden p-1 bg-neutral-900 border border-neutral-800">
                {history.length === 0 ? (
                    <div className="p-12 text-center text-neutral-500 font-medium">
                        No history records found.
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-800">
                        {history.map((record) => (
                            <div key={record.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div className="space-y-1">
                                    <p className="text-white font-bold text-sm flex items-center gap-2">
                                        {record.reason}
                                        {record.reason.includes("Admin") && <Shield size={12} className="text-red-400" />}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
                                        <span>{new Date(record.createdAt).toLocaleString()}</span>
                                        {record.group && (
                                            <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                                                {record.group.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={`font-black font-mono flex items-center gap-2 ${record.delta > 0 ? "text-emerald-400" : record.delta < 0 ? "text-red-400" : "text-neutral-400"
                                    }`}>
                                    {record.delta > 0 ? "+" : ""}{record.delta}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
