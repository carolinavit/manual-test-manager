import { http } from "./http";
import type { DashboardMetrics, TestCase, TestPlan, TestPlanHierarchy, TestRun, TestRunStatus } from "./types";

export function listTestPlans(params?: { q?: string }) {
  const qs = params?.q ? `?q=${encodeURIComponent(params.q)}` : "";
  return http<TestPlan[]>(`/test-plans${qs}`);
}

export function getPlanHierarchy(planId: string) {
  return http<TestPlanHierarchy>(`/test-plans/${planId}?hierarchy=true`);
}

export function createTestPlan(input: { name: string; description?: string | null }) {
  return http<TestPlan>(`/test-plans`, { method: "POST", body: JSON.stringify(input) });
}

export function updateTestPlan(planId: string, input: { name?: string; description?: string | null }) {
  return http<TestPlan>(`/test-plans/${planId}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function deleteTestPlan(planId: string) {
  return http<{ ok: true }>(`/test-plans/${planId}`, { method: "DELETE" });
}

export function createTestSuite(input: { name: string; description?: string | null; testPlanId: string }) {
  return http<any>(`/test-suites`, { method: "POST", body: JSON.stringify(input) });
}

export function updateTestSuite(suiteId: string, input: { name?: string; description?: string | null }) {
  return http<any>(`/test-suites/${suiteId}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function deleteTestSuite(suiteId: string) {
  return http<{ ok: true }>(`/test-suites/${suiteId}`, { method: "DELETE" });
}

export function createTestCase(input: {
  title: string;
  preconditions?: string | null;
  steps: Array<{ action: string; data?: string | null }>;
  expectedResult: string;
  testSuiteId: string;
}) {
  return http<TestCase>(`/test-cases`, { method: "POST", body: JSON.stringify(input) });
}

export function updateTestCase(
  id: string,
  input: {
    title?: string;
    preconditions?: string | null;
    steps?: Array<{ action: string; data?: string | null }>;
    expectedResult?: string;
  },
) {
  return http<TestCase>(`/test-cases/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function deleteTestCase(id: string) {
  return http<{ ok: true }>(`/test-cases/${id}`, { method: "DELETE" });
}

export function createTestRun(input: {
  testCaseId: string;
  status: TestRunStatus;
  evidence?: string | null;
  executedBy: string;
}) {
  return http<any>(`/test-runs`, { method: "POST", body: JSON.stringify(input) });
}

export function listTestRuns(params?: { status?: TestRunStatus }) {
  const qs = params?.status ? `?status=${encodeURIComponent(params.status)}` : "";
  return http<TestRun[]>(`/test-runs${qs}`);
}

export function getDashboard(params?: { testPlanId?: string }) {
  const qs = params?.testPlanId ? `?testPlanId=${encodeURIComponent(params.testPlanId)}` : "";
  return http<DashboardMetrics>(`/dashboard${qs}`);
}

