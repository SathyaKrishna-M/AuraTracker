import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const groups = await prisma.group.findMany({
            where: {
                members: {
                    some: {
                        userId: session.user.id,
                    },
                },
            },
            include: {
                _count: {
                    select: { members: true },
                },
            },
        });

        return NextResponse.json(groups);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { name } = body;

        const group = await prisma.group.create({
            data: {
                name,
                inviteCode: Math.random().toString(36).substring(2, 10),
                ownerId: session.user.id,
                members: {
                    create: {
                        userId: session.user.id,
                    },
                },
            },
        });

        return NextResponse.json(group);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
