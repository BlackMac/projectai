-- CreateTable
CREATE TABLE "Phase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roadmapId" TEXT NOT NULL,
    CONSTRAINT "Phase_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Backlog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phaseId" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Backlog_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Backlog" ("createdAt", "id", "items", "phaseId", "updatedAt") SELECT "createdAt", "id", "items", "phaseId", "updatedAt" FROM "Backlog";
DROP TABLE "Backlog";
ALTER TABLE "new_Backlog" RENAME TO "Backlog";
CREATE UNIQUE INDEX "Backlog_phaseId_key" ON "Backlog"("phaseId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
