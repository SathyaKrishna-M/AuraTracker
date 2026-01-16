"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Zap, RefreshCw, Check } from "lucide-react";
import Image from "next/image";

interface UserRowProps {
    user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
        role: "USER" | "ADMIN";
        aura: number;
        _count: {
            createdIncidents: number;
        };
    };
}

export default function UserRow({ user }: UserRowProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [aura, setAura] = useState(user.aura);
    const [role, setRole] = useState(user.role);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/users/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    aura: parseInt(aura.toString()),
                    role
                })
            });

            if (!res.ok) throw new Error(await res.text());

            setIsEditing(false);
            router.refresh();
        } catch (error) {
            alert("Failed to update user: " + error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 transition-colors hover:bg-white/5">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden shrink-0">
                    {user.image && <Image src={user.image} alt="Profile" width={40} height={40} className="w-full h-full object-cover" />}
                </div>
                <div>
                    <div className="font-bold text-white flex items-center gap-2">
                        {user.name}
                        {user.role === 'ADMIN' && <Shield size={12} className="text-accent" />}
                    </div>
                    <div className="text-xs text-neutral-500">{user.email}</div>
                    <div className="text-[10px] text-neutral-600 font-mono mt-0.5">{user.id}</div>
                </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                {isEditing ? (
                    <>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold text-neutral-500">Aura</label>
                            <input
                                type="number"
                                value={aura}
                                onChange={(e) => setAura(Number(e.target.value))}
                                className="w-20 bg-black/50 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-accent"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase font-bold text-neutral-500">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as "USER" | "ADMIN")}
                                className="bg-black/50 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-accent"
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                            >
                                <Check size={16} />
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                            >
                                <Shield size={16} className="rotate-45" />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-right">
                            <div className="text-xs text-neutral-500 font-bold uppercase">Incidents</div>
                            <div className="text-white font-bold">{user._count.createdIncidents}</div>
                        </div>
                        <div className="text-right min-w-[60px]">
                            <div className="text-xs text-neutral-500 font-bold uppercase">Role</div>
                            <div className={`font-bold ${user.role === 'ADMIN' ? 'text-accent' : 'text-white'}`}>{user.role}</div>
                        </div>
                        <div className="text-right min-w-[60px]">
                            <div className="text-xs text-neutral-500 font-bold uppercase">Aura</div>
                            <div className="font-bold text-accent-glow">{user.aura}</div>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors"
                        >
                            <Zap size={16} />
                        </button>
                        <button
                            onClick={() => router.push(`/admin/users/${user.id}/history`)}
                            className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors"
                            title="View Audit History"
                        >
                            <span className="font-mono text-xs font-bold">LOG</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
