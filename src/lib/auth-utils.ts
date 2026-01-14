import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function requireGroupAccess(userId: string, role: Role, groupId: string) {
    if (role === Role.ADMIN) return true;

    const member = await prisma.groupMember.findUnique({
        where: {
            userId_groupId: {
                userId: userId,
                groupId: groupId,
            },
        },
    });

    if (!member) {
        throw new Error("Forbidden: You do not have access to this group");
    }

    return true;
}

export function isAdmin(role: Role) {
    return role === Role.ADMIN;
}
