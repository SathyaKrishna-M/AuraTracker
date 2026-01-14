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
        const { userId, aura, role } = await req.json();

        if (!userId) {
            return new NextResponse("User ID required", { status: 400 });
        }

        const updateData: any = {};
        if (typeof aura === 'number') updateData.aura = aura;
        if (role === 'ADMIN' || role === 'USER') updateData.role = role;

        const result = await prisma.$transaction(async (tx) => {
            // 1. Get current user for delta calculation
            const currentUser = await tx.user.findUnique({ where: { id: userId } });
            if (!currentUser) throw new Error("User not found");

            // 2. Perform Update
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: updateData,
            });

            // 3. Record History if Aura changed
            if (typeof aura === 'number' && aura !== currentUser.aura) {
                const delta = aura - currentUser.aura;
                await tx.auraHistory.create({
                    data: {
                        userId: userId,
                        delta: delta,
                        reason: "Admin Manual Update",
                        // groupId is unknown here unless we force it or leave null. 
                        // Plan said optional.
                    }
                });
            }

            return updatedUser;
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error("Update user error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
