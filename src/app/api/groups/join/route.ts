import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { inviteCode } = await req.json();

        const group = await prisma.group.findUnique({
            where: { inviteCode },
            include: { members: true },
        });

        if (!group) {
            return new NextResponse("Group not found", { status: 404 });
        }

        const isMember = group.members.some(
            (member) => member.userId === session.user.id
        );

        if (isMember) {
            return new NextResponse("Already a member", { status: 400 });
        }

        await prisma.groupMember.create({
            data: {
                userId: session.user.id,
                groupId: group.id,
            },
        });

        return NextResponse.json({ groupId: group.id });
    } catch (error) {
        console.error("Join group error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
