/*
  Warnings:

  - Added the required column `accessibilityRequirements` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budget` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deploymentStrategy` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `integrationRequirements` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keyFeatures` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maintenancePlan` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `methodology` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `performanceRequirements` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `securityRequirements` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `successMetrics` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetAudience` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamSize` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testingRequirements` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeline` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "productBrief" TEXT NOT NULL,
    "techStack" TEXT NOT NULL,
    "codeGuidelines" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "keyFeatures" TEXT NOT NULL,
    "successMetrics" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "teamSize" TEXT NOT NULL,
    "methodology" TEXT NOT NULL,
    "integrationRequirements" TEXT NOT NULL,
    "securityRequirements" TEXT NOT NULL,
    "performanceRequirements" TEXT NOT NULL,
    "accessibilityRequirements" TEXT NOT NULL,
    "testingRequirements" TEXT NOT NULL,
    "deploymentStrategy" TEXT NOT NULL,
    "maintenancePlan" TEXT NOT NULL,
    "constraints" TEXT NOT NULL,
    "feedbackEmail" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("codeGuidelines", "constraints", "createdAt", "description", "feedbackEmail", "id", "name", "productBrief", "techStack", "updatedAt", "userId") SELECT "codeGuidelines", "constraints", "createdAt", "description", "feedbackEmail", "id", "name", "productBrief", "techStack", "updatedAt", "userId" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_feedbackEmail_key" ON "Project"("feedbackEmail");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
