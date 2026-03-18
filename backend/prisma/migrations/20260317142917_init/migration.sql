-- CreateTable
CREATE TABLE "TestPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TestSuite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "testPlanId" TEXT NOT NULL,
    CONSTRAINT "TestSuite_testPlanId_fkey" FOREIGN KEY ("testPlanId") REFERENCES "TestPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TestCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "preconditions" TEXT,
    "steps" JSONB NOT NULL,
    "expectedResult" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "testSuiteId" TEXT NOT NULL,
    CONSTRAINT "TestCase_testSuiteId_fkey" FOREIGN KEY ("testSuiteId") REFERENCES "TestSuite" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TestRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "evidence" TEXT,
    "executedBy" TEXT NOT NULL,
    "executedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "testCaseId" TEXT NOT NULL,
    CONSTRAINT "TestRun_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "TestPlan_name_idx" ON "TestPlan"("name");

-- CreateIndex
CREATE INDEX "TestSuite_testPlanId_idx" ON "TestSuite"("testPlanId");

-- CreateIndex
CREATE INDEX "TestSuite_name_idx" ON "TestSuite"("name");

-- CreateIndex
CREATE INDEX "TestCase_testSuiteId_idx" ON "TestCase"("testSuiteId");

-- CreateIndex
CREATE INDEX "TestCase_title_idx" ON "TestCase"("title");

-- CreateIndex
CREATE INDEX "TestRun_testCaseId_idx" ON "TestRun"("testCaseId");

-- CreateIndex
CREATE INDEX "TestRun_status_idx" ON "TestRun"("status");

-- CreateIndex
CREATE INDEX "TestRun_executedAt_idx" ON "TestRun"("executedAt");
