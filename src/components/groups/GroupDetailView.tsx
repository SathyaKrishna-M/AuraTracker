"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield, Users, Trophy, Activity, Copy, Check, Pen } from "lucide-react";
import { cn } from "@/lib/utils";
import VoteButton from "@/components/vote-button";
import CreateIncidentForm from "@/components/create-incident-form";
import { getAuraTitle } from "@/lib/aura-utils";
import GroupIconSettings from "./GroupIconSettings";

interface GroupDetailViewProps {
    group: any;
    incidents: any[];
    currentUser: any;
}

export default function GroupDetailView({ group, incidents, currentUser }: GroupDetailViewProps) {
    const [activeTab, setActiveTab] = useState<"feed" | "leaderboard" | "members">("feed");
    const [copied, setCopied] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Icon State (synced with DB defaults if missing)
    const [groupEmoji, setGroupEmoji] = useState(group.emoji || "👥");
    const [groupColor, setGroupColor] = useState(group.bgColor || "#3B82F6");

    const copyInvite = () => {
        navigator.clipboard.writeText(group.inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isOwner = group.ownerId === currentUser.id;

    // Sort members for leaderboard view
    const rankedMembers = [...group.members].sort((a: any, b: any) => b.user.aura - a.user.aura);

    return (
        <div className="min-h-screen pb-24 bg-aura-black text-gray-200">

            {/* Header */}
            <div className="bg-aura-dark/50 backdrop-blur-md border-b border-aura-border sticky top-0 z-30">
                <div className="p-4">
                    <Link href="/groups" className="text-gray-500 hover:text-white flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2">
                        <ArrowLeft className="w-3 h-3" /> Back
                    </Link>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            {/* Group Icon */}
                            <div className="relative group/icon">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg border-2 border-aura-border transition-transform hover:scale-105"
                                    style={{ backgroundColor: groupColor }}
                                >
                                    {groupEmoji}
                                </div>
                                {isOwner && (
                                    <button
                                        onClick={() => setShowSettings(true)}
                                        className="absolute -bottom-1 -right-1 bg-aura-dark border border-aura-border p-1.5 rounded-full text-gray-400 hover:text-white hover:border-accent transition-colors shadow-sm"
                                    >
                                        <Pen className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">{group.name}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <Shield className="w-3 h-3 text-gray-500" />
                                    <span className="text-xs text-gray-400 font-medium">Owner: {group.owner.name}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={copyInvite}
                            className="flex flex-col items-end group"
                        >
                            <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 group-hover:text-accent transition-colors">
                                {copied ? "Copied!" : "Invite Code"}
                            </span>
                            <div className="flex items-center gap-2 bg-aura-black px-3 py-1.5 rounded-lg border border-aura-border group-hover:border-accent/40 transition-colors">
                                <code className="text-lg font-mono font-bold text-accent tracking-widest">{group.inviteCode}</code>
                                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-gray-600 group-hover:text-white" />}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Settings Modal */}
                {showSettings && (
                    <GroupIconSettings
                        groupId={group.id}
                        initialEmoji={groupEmoji}
                        initialColor={groupColor}
                        onClose={() => setShowSettings(false)}
                        onUpdate={(e, c) => {
                            setGroupEmoji(e);
                            setGroupColor(c);
                        }}
                    />
                )}

                {/* Tabs */}
                <div className="flex items-center px-4 gap-6 border-t border-aura-border/50">
                    <button
                        onClick={() => setActiveTab("feed")}
                        className={cn(
                            "py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2",
                            activeTab === "feed" ? "border-accent text-white" : "border-transparent text-gray-500 hover:text-gray-300"
                        )}
                    >
                        <Activity className="w-4 h-4" /> Feed
                    </button>
                    <button
                        onClick={() => setActiveTab("leaderboard")}
                        className={cn(
                            "py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2",
                            activeTab === "leaderboard" ? "border-accent text-white" : "border-transparent text-gray-500 hover:text-gray-300"
                        )}
                    >
                        <Trophy className="w-4 h-4" /> Leaderboard
                    </button>
                    <button
                        onClick={() => setActiveTab("members")}
                        className={cn(
                            "py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2",
                            activeTab === "members" ? "border-accent text-white" : "border-transparent text-gray-500 hover:text-gray-300"
                        )}
                    >
                        <Users className="w-4 h-4" /> Members
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-6">

                {/* FEED TAB */}
                {activeTab === "feed" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <CreateIncidentForm groupId={group.id} members={group.members} />

                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Recent Activity</h3>

                            {incidents.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-aura-border rounded-xl">
                                    <p className="text-sm text-gray-500 font-medium">No incidents reported yet.</p>
                                </div>
                            ) : (
                                incidents.map((incident) => {
                                    const userVote = incident.votes.find((v: any) => v.userId === currentUser.id);
                                    const userVoteType = userVote ? (userVote.voteType || 'APPROVE') : null;

                                    const approvalsCount = incident.votes.filter((v: any) => !v.voteType || v.voteType === 'APPROVE').length;
                                    const disapprovalsCount = incident.votes.filter((v: any) => v.voteType === 'DISAPPROVE').length;

                                    const isTarget = incident.targetUserId === currentUser.id;
                                    const isGain = incident.category.includes('GAIN');

                                    return (
                                        <div key={incident.id} className="glass-card p-4 hover:bg-white/5 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">{incident.title}</h4>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className="text-xs text-gray-500">Target:</span>
                                                        <span className="text-xs font-bold text-gray-300 bg-white/5 px-1.5 py-0.5 rounded">
                                                            {incident.targetUser.name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                                                    isGain
                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                        : "bg-red-500/10 text-red-400 border-red-500/20"
                                                )}>
                                                    {isGain ? '+' : ''}
                                                    {incident.category.includes('SMALL') ? '5' : incident.category.includes('MODERATE') ? '10' : '20'} Aura
                                                </span>
                                            </div>

                                            <p className="text-xs text-gray-400 mb-4 line-clamp-2">{incident.description}</p>

                                            <div className="flex items-center justify-between pt-3 border-t border-aura-border">
                                                <span className="text-[10px] font-medium text-gray-600 uppercase">
                                                    {new Date(incident.createdAt).toLocaleDateString('en-GB')}
                                                </span>
                                                <VoteButton
                                                    incidentId={incident.id}
                                                    userVoteType={userVoteType}
                                                    isTarget={isTarget}
                                                    status={incident.status}
                                                    approvalsCount={approvalsCount}
                                                    disapprovalsCount={disapprovalsCount}
                                                    requiredVotes={incident.requiredVotes}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {/* LEADERBOARD TAB */}
                {activeTab === "leaderboard" && (
                    <div className="space-y-3 animate-in fade-in duration-300">
                        {rankedMembers.map((member: any, index: number) => {
                            const rank = index + 1;
                            const isCurrentUser = member.userId === currentUser.id;
                            let badge = null;
                            if (rank === 1) badge = "🥇";
                            else if (rank === 2) badge = "🥈";
                            else if (rank === 3) badge = "🥉";

                            return (
                                <div
                                    key={member.userId}
                                    className={cn(
                                        "flex items-center p-3 rounded-xl border transition-all",
                                        isCurrentUser
                                            ? "bg-accent/10 border-accent/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                                            : "bg-aura-dark border-aura-border"
                                    )}
                                >
                                    <div className="w-8 flex justify-center text-lg font-bold text-gray-500">
                                        {badge || <span className="text-sm">#{rank}</span>}
                                    </div>

                                    <div className="flex-1 ml-3 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-aura-black overflow-hidden border border-aura-border">
                                            {member.user.image ? (
                                                <Image src={member.user.image} alt="Avatar" width={32} height={32} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-xs text-gray-500 font-bold">
                                                    {member.user.name?.[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={cn("text-sm font-bold", isCurrentUser ? "text-white" : "text-gray-300")}>
                                                {member.user.name} {isCurrentUser && <span className="text-[10px] text-accent ml-1">(You)</span>}
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                                                {getAuraTitle(member.user.aura)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className={cn(
                                            "text-lg font-bold font-mono block leading-none",
                                            member.user.aura >= 100 ? "text-emerald-400" : member.user.aura > 50 ? "text-gray-200" : "text-red-400"
                                        )}>
                                            {member.user.aura}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* MEMBERS TAB */}
                {activeTab === "members" && (
                    <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-300">
                        {group.members.map((member: any) => (
                            <div key={member.user.id} className="bg-aura-dark border border-aura-border p-4 rounded-xl flex flex-col items-center text-center gap-2">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-aura-border">
                                    {member.user.image ? (
                                        <Image src={member.user.image} alt="Avatar" width={48} height={48} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white truncate max-w-[120px]">{member.user.name}</p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold mt-0.5">{getAuraTitle(member.user.aura)}</p>
                                </div>
                                <div className="mt-1 bg-aura-black px-2 py-0.5 rounded border border-aura-border">
                                    <span className="text-xs font-mono font-bold text-gray-300">{member.user.aura} Aura</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
}
