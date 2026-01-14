import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireGroupAccess } from "@/lib/auth-utils";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const groupId = params.id;

    try {
        // Security check
        await requireGroupAccess(session.user.id, session.user.role, groupId);

        const group = await prisma.group.findUnique({
            where: { id: groupId },
            include: {
                owner: {
                    select: { id: true, name: true, email: true },
                },
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                aura: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });

        if (!group) {
            return new NextResponse("Group not found", { status: 404 });
        }

        return NextResponse.json(group);
    } catch (error) {
        console.error("Get group error:", error);
        return new NextResponse("Forbidden or Error", { status: 403 });
    }
}
