import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireGroupAccess } from "@/lib/auth-utils";
import { getAuraDelta } from "@/lib/aura-utils";

export async function POST(req: Request) {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { incidentId } = await req.json();

        if (!incidentId) {
            return new NextResponse("Incident ID required", { status: 400 });
        }

        // 1. Fetch Incident with details
        const incident = await prisma.incident.findUnique({
            where: { id: incidentId },
            include: {
                votes: true,
                group: true,
            }
        });

        if (!incident) {
            return new NextResponse("Incident not found", { status: 404 });
        }

        if (incident.group.isFrozen) {
            return new NextResponse("Group is frozen. Cannot vote.", { status: 403 });
        }

        // 2. Check Expiry
        if (new Date() > incident.expiresAt) {
            // Lazy update to expired
            if (incident.status !== "EXPIRED") {
                await prisma.incident.update({
                    where: { id: incidentId },
                    data: { status: "EXPIRED" }
                });
            }
            return new NextResponse("Incident has expired", { status: 400 });
        }

        // 3. Check Status
        if (incident.status !== "PENDING") {
            return new NextResponse("Incident is closed", { status: 400 });
        }

        // 4. Check Group Access
        await requireGroupAccess(session.user.id, session.user.role, incident.groupId);

        // 5. Check if Target (Cannot vote on own incident)
        if (incident.targetUserId === session.user.id) {
            return new NextResponse("Target user cannot vote", { status: 403 });
        }

        // 6. Check if Already Voted
        const hasVoted = incident.votes.some(v => v.userId === session.user.id);
        if (hasVoted) {
            return new NextResponse("Already voted", { status: 400 });
        }

        // A. TRANSACTION: Vote + Check Status Update
        // We use a transaction to ensure integrity, though strict serialization might be overkill for this scale.
        // Prisma transactions are good here.

        await prisma.$transaction(async (tx) => {
            // Create Vote
            await tx.incidentVote.create({
                data: {
                    incidentId,
                    userId: session.user.id
                }
            });

            // Get new count
            const currentVotes = await tx.incidentVote.count({
                where: { incidentId }
            });

            // Check Threshold
            if (currentVotes >= incident.requiredVotes && incident.status === "PENDING") {
                // Map Category to Delta
                const delta = getAuraDelta(incident.category);

                // Update Incident Status
                await tx.incident.update({
                    where: { id: incidentId },
                    data: { status: "VALIDATED" }
                });

                // Update User Aura
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
                        reason: `Incident: ${incident.title}`
                    }
                });
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Vote error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
