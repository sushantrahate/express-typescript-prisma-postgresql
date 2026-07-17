-- AlterTable: Roles.active becomes Boolean for consistency with User.active (was SMALLINT 0/1)
ALTER TABLE "Roles" ALTER COLUMN "active" DROP DEFAULT;
ALTER TABLE "Roles" ALTER COLUMN "active" TYPE BOOLEAN USING ("active"::int <> 0);
ALTER TABLE "Roles" ALTER COLUMN "active" SET DEFAULT true;

-- AlterTable: drop the redundant DB-level default on updatedAt; Prisma Client sets it via @updatedAt
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex: Postgres does not auto-index foreign key columns
CREATE INDEX "User_roleId_idx" ON "User"("roleId");
