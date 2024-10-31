-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AppState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "currentProjectId" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "AppState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AppState" ("currentProjectId", "id", "updatedAt") SELECT "currentProjectId", "id", "updatedAt" FROM "AppState";
DROP TABLE "AppState";
ALTER TABLE "new_AppState" RENAME TO "AppState";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
