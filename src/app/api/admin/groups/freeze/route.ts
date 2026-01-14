import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    // @ts-ignore
    const session = await getServerSession(authOptions);

    // 1. Security Check: Admin Only
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    try {
        const { groupId, isFrozen } = await req.json();

        if (!groupId) {
            return new NextResponse("Group ID required", { status: 400 });
        }

        if (typeof isFrozen !== 'boolean') {
            return new NextResponse("isFrozen boolean required", { status: 400 });
        }

        // 2. Update Group
        const group = await prisma.group.update({
            where: { id: groupId },
            data: { isFrozen },
        });

        return NextResponse.json(group);

    } catch (error) {
        console.error("Freeze group error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
