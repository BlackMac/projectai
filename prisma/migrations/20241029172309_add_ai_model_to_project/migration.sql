-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "constraints" TEXT NOT NULL,
    "codeGuidelines" TEXT NOT NULL,
    "productBrief" TEXT NOT NULL,
    "techStack" TEXT NOT NULL,
    "feedbackEmail" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    "aiModel" TEXT NOT NULL DEFAULT 'gpt-4o-mini',
    CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("codeGuidelines", "constraints", "createdAt", "description", "feedbackEmail", "id", "name", "productBrief", "techStack", "updatedAt", "userId") SELECT "codeGuidelines", "constraints", "createdAt", "description", "feedbackEmail", "id", "name", "productBrief", "techStack", "updatedAt", "userId" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_feedbackEmail_key" ON "Project"("feedbackEmail");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
