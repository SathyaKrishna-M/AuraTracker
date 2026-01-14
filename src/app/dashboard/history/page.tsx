import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Clock, TrendingUp, TrendingDown } from "lucide-react";

export default async function AuraHistoryPage() {
    // @ts-ignore
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const history = await prisma.auraHistory.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        include: {
            group: { select: { name: true } }
        }
    });

    return (
        <div className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-aura-black">
            <div className="w-full max-w-4xl space-y-6">
                <Link
                    href="/dashboard"
                    className="flex items-center text-xs font-bold text-neutral-500 hover:text-white transition-colors mb-6 uppercase tracking-wider"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>

                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Clock className="text-accent" size={32} />
                        Aura History
                    </h1>
                </div>

                <div className="glass-panel rounded-2xl overflow-hidden p-1">
                    {history.length === 0 ? (
                        <div className="p-12 text-center text-neutral-500 font-medium">
                            No history found. Your aura is pristine (and static).
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {history.map((record) => (
                                <div key={record.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                                    <div className="space-y-1">
                                        <p className="text-white font-bold text-sm">{record.reason}</p>
                                        <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
                                            <span>{new Date(record.createdAt).toLocaleString()}</span>
                                            {record.group && (
                                                <span className="px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                                                    {record.group.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={`text-lg font-black flex items-center gap-2 ${record.delta > 0 ? "text-emerald-400" : record.delta < 0 ? "text-red-400" : "text-neutral-400"
                                        }`}>
                                        {record.delta > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                        {record.delta > 0 ? "+" : ""}{record.delta}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
