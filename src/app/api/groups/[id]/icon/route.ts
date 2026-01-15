import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const ALLOWED_COLORS = [
    "#3B82F6", "#22C55E", "#8B5CF6", "#F97316", "#EF4444", "#14B8A6", "#64748B"
];

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { emoji, bgColor } = body;

        // Validation
        if (emoji && emoji.length > 4) {
            return new NextResponse("Invalid emoji", { status: 400 });
        }
        if (bgColor && !ALLOWED_COLORS.includes(bgColor)) {
            return new NextResponse("Invalid color", { status: 400 });
        }

        const groupId = params.id;

        // Check ownership or admin
        const group = await prisma.group.findUnique({
            where: { id: groupId },
        });

        if (!group) {
            return new NextResponse("Group not found", { status: 404 });
        }

        const isOwner = group.ownerId === session.user.id;
        const isAdmin = session.user.role === "ADMIN";

        if (!isOwner && !isAdmin) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const updatedGroup = await prisma.group.update({
            where: { id: groupId },
            data: {
                emoji,
                bgColor
            },
        });

        return NextResponse.json(updatedGroup);
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
