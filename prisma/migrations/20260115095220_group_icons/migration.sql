-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "bgColor" TEXT NOT NULL DEFAULT '#3B82F6',
ADD COLUMN     "emoji" TEXT NOT NULL DEFAULT '👥';

-- CreateTable
CREATE TABLE "AuraHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "incidentId" TEXT,
    "groupId" TEXT,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuraHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuraHistory_userId_idx" ON "AuraHistory"("userId");

-- AddForeignKey
ALTER TABLE "AuraHistory" ADD CONSTRAINT "AuraHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuraHistory" ADD CONSTRAINT "AuraHistory_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuraHistory" ADD CONSTRAINT "AuraHistory_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
