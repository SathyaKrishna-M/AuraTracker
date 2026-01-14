import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getAuraDelta } from "@/lib/aura-utils";

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

        const incident = await prisma.incident.findUnique({
            where: { id: incidentId }
        });

        if (!incident) {
            return new NextResponse("Incident not found", { status: 404 });
        }

        if (incident.status !== "PENDING") {
            return new NextResponse("Incident is not PENDING. Cannot override.", { status: 400 });
        }

        // Reuse logic from vote/route.ts
        const delta = getAuraDelta(incident.category);

        // Transaction: Update status + user aura
        await prisma.$transaction(async (tx) => {
            await tx.incident.update({
                where: { id: incidentId },
                data: { status: "VALIDATED" }
            });

            await tx.user.update({
                where: { id: incident.targetUserId },
                data: { aura: { increment: delta } }
            });

            // RECORD HISTORY
            await tx.auraHistory.create({
                data: {
                    userId: incident.targetUserId,
                    incidentId: incident.id,
                    groupId: incident.groupId,
                    delta: delta,
                    reason: `Admin Override: ${incident.title}`
                }
            });
        });

        return NextResponse.json({ success: true, delta });

    } catch (error) {
        console.error("Override incident error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
