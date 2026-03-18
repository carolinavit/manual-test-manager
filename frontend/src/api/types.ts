export type TestRunStatus = "Passed" | "Failed" | "Blocked";

export type TestPlan = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { testSuites: number };
};

export type TestSuite = {
  id: string;
  name: string;
  description: string | null;
  testPlanId: string;
  createdAt: string;
  updatedAt: string;
  testCases: TestCase[];
};

export type TestStep = { action: string; data?: string | null };

export type TestCase = {
  id: string;
  title: string;
  preconditions: string | null;
  steps: TestStep[];
  expectedResult: string;
  testSuiteId: string;
  createdAt: string;
  updatedAt: string;
  _count?: { testRuns: number };
};

export type TestPlanHierarchy = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  testSuites: Array<{
    id: string;
    name: string;
    description: string | null;
    testPlanId: string;
    createdAt: string;
    updatedAt: string;
    testCases: Array<
      TestCase & {
        _count?: { testRuns: number };
      }
    >;
  }>;
};

export type TestRun = {
  id: string;
  testCaseId: string;
  status: TestRunStatus;
  evidence: string | null;
  executedBy: string;
  executedAt: string;
  testCase?: {
    id: string;
    title: string;
    testSuite?: { id: string; name: string; testPlanId: string };
  };
};

export type DashboardMetrics = {
  totalExecuted: number;
  passed: number;
  failed: number;
  blocked: number;
  passRate: number;
};

