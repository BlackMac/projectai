-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "constraints" TEXT NOT NULL,
    "codeGuidelines" TEXT NOT NULL,
    "productBrief" TEXT NOT NULL,
    "techStack" TEXT NOT NULL,
    "feedbackEmail" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_feedbackEmail_key" ON "Project"("feedbackEmail");
