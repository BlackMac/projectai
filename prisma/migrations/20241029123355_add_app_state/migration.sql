-- CreateTable
CREATE TABLE "AppState" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'current',
    "currentProjectId" TEXT,
    "updatedAt" DATETIME NOT NULL
);
