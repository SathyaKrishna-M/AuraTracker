import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireGroupAccess } from "@/lib/auth-utils";

export async function POST(req: Request) {
    // @ts-ignore
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { groupId, targetUserId, category, title, description } = body;

        // 1. Validate Creator Access
        await requireGroupAccess(session.user.id, session.user.role, groupId);

        // 2. Validate Target User is in Group
        const targetMember = await prisma.groupMember.findUnique({
            where: {
                userId_groupId: {
                    userId: targetUserId,
                    groupId: groupId,
                },
            },
            include: {
                group: true
            }
        });

        if (!targetMember) {
            return new NextResponse("Target user is not in this group", { status: 400 });
        }

        if (targetMember.group.isFrozen) {
            return new NextResponse("Group is frozen. Cannot create incidents.", { status: 403 });
        }

        // 3. Calculate Required Votes (30% of members)
        const memberCount = await prisma.groupMember.count({
            where: { groupId },
        });

        const requiredVotes = Math.ceil(memberCount * 0.3);



        // 4. CHECK DAILY LIMITS (Step 4.1)
        if (session.user.role !== 'ADMIN') { // Admins bypass limits
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const todaysIncidents = await prisma.incident.findMany({
                where: {
                    createdByUserId: session.user.id,
                    createdAt: {
                        gte: startOfDay
                    }
                },
                select: {
                    category: true
                }
            });

            // A. Total Limit (Max 5)
            if (todaysIncidents.length >= 5) {
                return new NextResponse("Daily incident limit reached (Max 5)", { status: 429 });
            }

            // B. Negative Limit (Max 3)
            // C. Positive Limit (Max 3)
            const isNegative = ["SMALL_LOSS", "MODERATE_LOSS", "HIGH_LOSS"].includes(category);
            const isPositive = ["SMALL_GAIN", "MODERATE_GAIN", "HIGH_GAIN"].includes(category);

            if (isNegative) {
                const negativeCount = todaysIncidents.filter(i =>
                    ["SMALL_LOSS", "MODERATE_LOSS", "HIGH_LOSS"].includes(i.category)
                ).length;

                if (negativeCount >= 3) {
                    return new NextResponse("Daily negative incident limit reached (Max 3)", { status: 429 });
                }
            } else if (isPositive) {
                const positiveCount = todaysIncidents.filter(i =>
                    ["SMALL_GAIN", "MODERATE_GAIN", "HIGH_GAIN"].includes(i.category)
                ).length;

                if (positiveCount >= 3) {
                    return new NextResponse("Daily positive incident limit reached (Max 3)", { status: 429 });
                }
            }

            // 5. CHECK TARGET COOLDOWNS (Step 4.2 Revision)
            // General Cooldown (30 mins) - Cannot target same user twice in 30m
            const last30m = new Date(Date.now() - 30 * 60 * 1000);
            const recentSameTarget = await prisma.incident.findFirst({
                where: {
                    createdByUserId: session.user.id,
                    targetUserId: targetUserId,
                    createdAt: { gte: last30m }
                }
            });

            if (recentSameTarget) {
                return new NextResponse("You recently created an incident for this user (30m cooldown)", { status: 429 });
            }
        }

        // 6. Create Incident
        const incident = await prisma.incident.create({
            data: {
                groupId,
                targetUserId,
                createdByUserId: session.user.id,
                category,
                title,
                description,
                requiredVotes: Math.max(1, requiredVotes), // At least 1 vote
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
                status: "PENDING",
            },
        });

        return NextResponse.json(incident);
    } catch (error) {
        console.error("Create incident error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
