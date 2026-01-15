import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireGroupAccess } from "@/lib/auth-utils";
import GroupDetailView from "@/components/groups/GroupDetailView";

export default async function GroupDetailPage({
    params,
}: {
    params: { id: string };
}) {
    // @ts-ignore
    const session = await getServerSession(authOptions);

    if (!session) redirect("/login");

    try {
        await requireGroupAccess(session.user.id, session.user.role, params.id);
    } catch (error) {
        redirect("/groups");
    }

    const group = await prisma.group.findUnique({
        where: { id: params.id },
        include: {
            owner: { select: { id: true, name: true, email: true } },
            members: {
                include: {
                    user: { select: { id: true, name: true, image: true, aura: true, role: true } },
                },
                orderBy: { user: { aura: 'desc' } }
            },
        },
    });

    if (!group) return <div>Group not found</div>;

    const incidents = await prisma.incident.findMany({
        where: { groupId: params.id },
        include: {
            targetUser: { select: { id: true, name: true } },
            votes: { select: { userId: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 30
    });

    return (
        <GroupDetailView
            group={group}
            incidents={incidents}
            currentUser={session.user}
        />
    );
}
