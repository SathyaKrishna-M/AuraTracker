"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;
    const isGroupActive = pathname.startsWith("/groups") && pathname !== "/admin/groups";
    const isLeaderboardActive = pathname.includes("/leaderboard");

    // Hide nav on login page
    if (pathname === "/login" || pathname === "/") return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-aura-black/95 backdrop-blur-xl border-t border-aura-border pb-safe transition-all duration-300">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">

                {/* Dashboard */}
                <Link
                    href="/dashboard"
                    className={cn(
                        "nav-item flex-1",
                        isActive("/dashboard") && "active"
                    )}
                >
                    <Home size={22} strokeWidth={isActive("/dashboard") ? 2.5 : 2} />
                    <span>Home</span>
                </Link>

                {/* Groups */}
                {/* Groups */}
                <Link
                    href="/groups"
                    className={cn(
                        "nav-item flex-1",
                        (isGroupActive && !isLeaderboardActive) && "active"
                    )}
                >
                    <Users size={22} strokeWidth={(isGroupActive && !isLeaderboardActive) ? 2.5 : 2} />
                    <span>Groups</span>
                </Link>

                {/* Leaderboard - Global Rankings Placeholder */}
                <Link
                    href="/rankings"
                    className={cn(
                        "nav-item flex-1",
                        isActive("/rankings") && "active"
                    )}
                >
                    <Trophy size={22} strokeWidth={isActive("/rankings") ? 2.5 : 2} />
                    <span>Rankings</span>
                </Link>

                {/* Profile */}
                <Link
                    href="/profile"
                    className={cn(
                        "nav-item flex-1",
                        isActive("/profile") && "active"
                    )}
                >
                    <User size={22} strokeWidth={isActive("/profile") ? 2.5 : 2} />
                    <span>Profile</span>
                </Link>

            </div>
        </div>
    );
}
