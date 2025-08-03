-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_jobs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "resumeId" INTEGER,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "location" TEXT,
    "jobType" TEXT,
    "salary" TEXT,
    "description" TEXT,
    "requirements" TEXT,
    "additionalInfo" TEXT,
    "applicationUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'wishlist',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "notes" TEXT,
    "appliedAt" DATETIME,
    "interviewDate" DATETIME,
    "followUpDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "jobs_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_jobs" ("additionalInfo", "applicationUrl", "appliedAt", "company", "createdAt", "description", "followUpDate", "id", "interviewDate", "jobType", "location", "notes", "position", "priority", "requirements", "salary", "status", "updatedAt", "userId") SELECT "additionalInfo", "applicationUrl", "appliedAt", "company", "createdAt", "description", "followUpDate", "id", "interviewDate", "jobType", "location", "notes", "position", "priority", "requirements", "salary", "status", "updatedAt", "userId" FROM "jobs";
DROP TABLE "jobs";
ALTER TABLE "new_jobs" RENAME TO "jobs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
