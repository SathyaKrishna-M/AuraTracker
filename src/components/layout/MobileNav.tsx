"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, ShieldAlert, User } from "lucide-react";

export default function MobileNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;
    const isGroupActive = pathname.startsWith("/groups") && pathname !== "/admin/groups";

    // Hide nav on login page
    if (pathname === "/") return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-aura-black/80 backdrop-blur-lg border-t border-aura-border pb-safe">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                <Link href="/dashboard" className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}>
                    <Home size={24} />
                    <span>Home</span>
                </Link>
                <Link href="/groups/join" className={`nav-item ${isGroupActive ? "active" : ""}`}>
                    <Users size={24} />
                    <span>Groups</span>
                </Link>
                <Link href="/profile" className={`nav-item ${isActive("/profile") ? "active" : ""}`}>
                    <User size={24} />
                    <span>Profile</span>
                </Link>
                {/* Admin link only visible contextually or moved to profile? Keeping simple for now */}
            </div>
        </div>
    );
}
