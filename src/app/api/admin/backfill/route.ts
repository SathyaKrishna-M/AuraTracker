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
        // 1. Fetch all VALIDATED incidents
        const incidents = await prisma.incident.findMany({
            where: { status: "VALIDATED" },
            include: { auraHistory: true } // Efficiency check
        });

        let createdCount = 0;

        for (const incident of incidents) {
            // 2. Skip if history already exists
            if (incident.auraHistory.length > 0) continue;

            // 3. Calculate Delta
            const delta = getAuraDelta(incident.category);

            // 4. Create History Record
            // We use the incident's creation time as the history time for accuracy
            await prisma.auraHistory.create({
                data: {
                    userId: incident.targetUserId,
                    incidentId: incident.id,
                    groupId: incident.groupId,
                    delta: delta,
                    reason: `Incident: ${incident.title}`,
                    createdAt: incident.createdAt // Backdate the history
                }
            });

            createdCount++;
        }

        return NextResponse.json({
            success: true,
            message: `Backfill complete. Created ${createdCount} history records from ${incidents.length} total validated incidents.`
        });

    } catch (error) {
        console.error("Backfill error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
