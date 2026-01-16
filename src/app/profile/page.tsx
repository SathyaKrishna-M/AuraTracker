import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAuraTitle } from "@/lib/aura-utils";
import SignOutButton from "@/components/auth/sign-out-button";
import Image from "next/image";
import { User, Mail, Shield } from "lucide-react";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) redirect("/login");

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-aura-black pb-24">
            <div className="w-full max-w-sm space-y-8">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Your Profile</h1>
                    <p className="text-sm text-gray-500">Manage your account and settings</p>
                </div>

                {/* Profile Card */}
                <div className="bg-aura-dark p-8 rounded-2xl flex flex-col items-center gap-6 border border-aura-border shadow-lg">

                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-aura-border shadow-2xl">
                            {session.user.image ? (
                                <Image src={session.user.image} alt="Profile" width={96} height={96} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-aura-dark flex items-center justify-center">
                                    <User className="w-10 h-10 text-gray-600" />
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-aura-black rounded-full p-1 border border-aura-border">
                            <div className="bg-accent text-[10px] font-bold text-white px-2 py-0.5 rounded-full">
                                {user.role}
                            </div>
                        </div>
                    </div>

                    <div className="text-center w-full space-y-1">
                        <h2 className="text-xl font-bold text-white">{user.name}</h2>
                        <div className="flex items-center justify-center gap-1.5 text-gray-500 text-sm">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-3 mt-2">
                        <div className="bg-aura-black/50 p-3 rounded-xl border border-aura-border text-center">
                            <span className="block text-2xl font-black text-white monospace-num">{user.aura}</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Aura Score</span>
                        </div>
                        <div className="bg-aura-black/50 p-3 rounded-xl border border-aura-border text-center flex flex-col items-center justify-center">
                            <span className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1">{getAuraTitle(user.aura)}</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Rank Title</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center">
                    <SignOutButton />
                </div>

                <div className="text-center">
                    <p className="text-[10px] text-gray-600">
                        User ID: <span className="font-mono text-gray-500">{user.id.substring(0, 8)}...</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
