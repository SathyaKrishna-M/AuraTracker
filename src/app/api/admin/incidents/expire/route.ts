import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    // @ts-ignore
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    try {
        const { incidentId } = await req.json();

        if (!incidentId) {
            return new NextResponse("Incident ID required", { status: 400 });
        }

        const incident = await prisma.incident.update({
            where: { id: incidentId },
            data: { status: "EXPIRED" },
        });

        return NextResponse.json(incident);

    } catch (error) {
        console.error("Expire incident error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
