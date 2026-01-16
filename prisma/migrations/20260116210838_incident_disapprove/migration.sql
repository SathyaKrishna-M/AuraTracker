-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('APPROVE', 'DISAPPROVE');

-- AlterTable
ALTER TABLE "IncidentVote" ADD COLUMN     "voteType" "VoteType" NOT NULL DEFAULT 'APPROVE';
