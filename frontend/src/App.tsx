import { useEffect, useMemo, useState } from "react";
import {
  createTestCase,
  createTestPlan,
  createTestRun,
  createTestSuite,
  deleteTestCase,
  deleteTestPlan,
  deleteTestSuite,
  getDashboard,
  getPlanHierarchy,
  listTestPlans,
  listTestRuns,
  updateTestCase,
  updateTestPlan,
  updateTestSuite,
} from "./api/client";
import type { TestCase, TestPlanHierarchy, TestRunStatus } from "./api/types";

type Tab = "plans" | "runs" | "dashboard";

function StatusPill({ status }: { status: TestRunStatus }) {
  const cls =
    status === "Passed"
      ? "pill pill--passed"
      : status === "Failed"
        ? "pill pill--failed"
        : "pill pill--blocked";
  return <span className={cls}>{status}</span>;
}

export default function App() {
  const [tab, setTab] = useState<Tab>("plans");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [planQuery, setPlanQuery] = useState("");
  const [plans, setPlans] = useState<Array<{ id: string; name: string; description: string | null }>>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [hierarchy, setHierarchy] = useState<TestPlanHierarchy | null>(null);
  const [selectedSuiteId, setSelectedSuiteId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const selectedSuite = useMemo(
    () => hierarchy?.testSuites.find((s) => s.id === selectedSuiteId) ?? null,
    [hierarchy, selectedSuiteId],
  );
  const selectedCase = useMemo<TestCase | null>(() => {
    const suite = hierarchy?.testSuites.find((s) => s.id === selectedSuiteId);
    return suite?.testCases.find((c) => c.id === selectedCaseId) ?? null;
  }, [hierarchy, selectedSuiteId, selectedCaseId]);

  async function refreshPlans() {
    setLoading(true);
    setError(null);
    try {
      const items = await listTestPlans(planQuery.trim() ? { q: planQuery.trim() } : undefined);
      setPlans(items);
      if (!selectedPlanId && items[0]) setSelectedPlanId(items[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar Test Plans.");
    } finally {
      setLoading(false);
    }
  }

  async function refreshHierarchy(planId: string) {
    setLoading(true);
    setError(null);
    try {
      const h = await getPlanHierarchy(planId);
      setHierarchy(h);
      const firstSuite = h.testSuites[0] ?? null;
      setSelectedSuiteId((prev) => prev ?? firstSuite?.id ?? null);
      const firstCase = firstSuite?.testCases[0] ?? null;
      setSelectedCaseId((prev) => prev ?? firstCase?.id ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar hierarquia.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedPlanId) return;
    void refreshHierarchy(selectedPlanId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlanId]);

  async function onCreatePlan() {
    const name = prompt("Nome do Test Plan");
    if (!name) return;
    const description = prompt("Descrição (opcional)") ?? undefined;
    const created = await createTestPlan({ name, description });
    setPlanQuery("");
    await refreshPlans();
    setSelectedPlanId(created.id);
    await refreshHierarchy(created.id);
  }

  async function onEditPlan() {
    if (!hierarchy) return;
    const name = prompt("Novo nome do Test Plan", hierarchy.name);
    if (!name) return;
    const description = prompt("Descrição (opcional)", hierarchy.description ?? "") ?? undefined;
    await updateTestPlan(hierarchy.id, { name, description });
    await refreshPlans();
    await refreshHierarchy(hierarchy.id);
  }

  async function onDeletePlan() {
    if (!hierarchy) return;
    if (!confirm("Excluir este Test Plan e tudo dentro dele?")) return;
    await deleteTestPlan(hierarchy.id);
    setSelectedPlanId(null);
    setHierarchy(null);
    await refreshPlans();
  }

  async function onCreateSuite() {
    if (!hierarchy) return;
    const name = prompt("Nome da Test Suite");
    if (!name) return;
    const description = prompt("Descrição (opcional)") ?? undefined;
    await createTestSuite({ name, description, testPlanId: hierarchy.id });
    await refreshHierarchy(hierarchy.id);
  }

  async function onEditSuite() {
    if (!hierarchy || !selectedSuite) return;
    const name = prompt("Novo nome da Test Suite", selectedSuite.name);
    if (!name) return;
    const description = prompt("Descrição (opcional)", selectedSuite.description ?? "") ?? undefined;
    await updateTestSuite(selectedSuite.id, { name, description });
    await refreshHierarchy(hierarchy.id);
  }

  async function onDeleteSuite() {
    if (!hierarchy || !selectedSuite) return;
    if (!confirm("Excluir esta Test Suite e seus Test Cases?")) return;
    await deleteTestSuite(selectedSuite.id);
    setSelectedSuiteId(null);
    setSelectedCaseId(null);
    await refreshHierarchy(hierarchy.id);
  }

  async function onCreateCase() {
    if (!hierarchy || !selectedSuite) return;
    const title = prompt("Título do Test Case");
    if (!title) return;
    const preconditions = prompt("Pré-condições (opcional)") ?? undefined;
    const expectedResult = prompt("Resultado esperado");
    if (!expectedResult) return;
    const rawSteps = prompt(
      "Passos (um por linha). Ex:\n1) Abrir tela\n2) Preencher campos\n3) Salvar",
    );
    const steps = (rawSteps ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((action) => ({ action }));
    if (steps.length === 0) {
      alert("Você precisa informar ao menos 1 passo.");
      return;
    }
    const created = await createTestCase({
      title,
      preconditions,
      expectedResult,
      steps,
      testSuiteId: selectedSuite.id,
    });
    await refreshHierarchy(hierarchy.id);
    setSelectedCaseId(created.id);
  }

  async function onEditCase() {
    if (!hierarchy || !selectedCase) return;
    const title = prompt("Título", selectedCase.title);
    if (!title) return;
    const preconditions = prompt("Pré-condições (opcional)", selectedCase.preconditions ?? "") ?? undefined;
    const expectedResult = prompt("Resultado esperado", selectedCase.expectedResult);
    if (!expectedResult) return;
    const rawSteps = prompt(
      "Passos (um por linha)",
      (selectedCase.steps ?? []).map((s) => s.action).join("\n"),
    );
    const steps = (rawSteps ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((action) => ({ action }));
    if (steps.length === 0) {
      alert("Você precisa informar ao menos 1 passo.");
      return;
    }
    await updateTestCase(selectedCase.id, { title, preconditions, expectedResult, steps });
    await refreshHierarchy(hierarchy.id);
  }

  async function onDeleteCase() {
    if (!hierarchy || !selectedCase) return;
    if (!confirm("Excluir este Test Case e seu histórico de execuções?")) return;
    await deleteTestCase(selectedCase.id);
    setSelectedCaseId(null);
    await refreshHierarchy(hierarchy.id);
  }

  const [runStatus, setRunStatus] = useState<TestRunStatus>("Passed");
  const [runExecutedBy, setRunExecutedBy] = useState("qa@exemplo.com");
  const [runEvidence, setRunEvidence] = useState("");

  async function onExecuteCase() {
    if (!hierarchy || !selectedCase) return;
    await createTestRun({
      testCaseId: selectedCase.id,
      status: runStatus,
      executedBy: runExecutedBy.trim() || "unknown",
      evidence: runEvidence.trim() || undefined,
    });
    setRunEvidence("");
    await refreshHierarchy(hierarchy.id);
  }

  const [runsStatusFilter, setRunsStatusFilter] = useState<TestRunStatus | "">("");
  const [runs, setRuns] = useState<any[]>([]);
  async function refreshRuns() {
    setLoading(true);
    setError(null);
    try {
      const items = await listTestRuns(
        runsStatusFilter ? { status: runsStatusFilter as TestRunStatus } : undefined,
      );
      setRuns(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar histórico.");
    } finally {
      setLoading(false);
    }
  }

  const [dashboard, setDashboard] = useState<{ totalExecuted: number; passed: number; failed: number; blocked: number; passRate: number } | null>(null);
  async function refreshDashboard() {
    setLoading(true);
    setError(null);
    try {
      const metrics = await getDashboard(selectedPlanId ? { testPlanId: selectedPlanId } : undefined);
      setDashboard(metrics);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar métricas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tab === "runs") void refreshRuns();
    if (tab === "dashboard") void refreshDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">Manual Test Plans</div>
        <nav className="tabs">
          <button className={tab === "plans" ? "tab tab--active" : "tab"} onClick={() => setTab("plans")}>
            Plans
          </button>
          <button className={tab === "runs" ? "tab tab--active" : "tab"} onClick={() => setTab("runs")}>
            Runs
          </button>
          <button
            className={tab === "dashboard" ? "tab tab--active" : "tab"}
            onClick={() => setTab("dashboard")}
          >
            Dashboard
          </button>
        </nav>
        <div className="spacer" />
        <div className="small">
          API: <code>{import.meta.env.VITE_API_URL ?? "http://localhost:4000/api"}</code>
        </div>
      </header>

      {error ? <div className="toast toast--error">{error}</div> : null}
      {loading ? <div className="toast">Carregando…</div> : null}

      {tab === "plans" ? (
        <div className="layout">
          <aside className="sidebar">
            <div className="sidebar__header">
              <div className="sidebar__title">Test Plans</div>
              <button className="btn btn--primary" onClick={() => void onCreatePlan()}>
                + Plan
              </button>
            </div>

            <div className="field">
              <input
                placeholder="Buscar plano…"
                value={planQuery}
                onChange={(e) => setPlanQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void refreshPlans();
                }}
              />
              <button className="btn" onClick={() => void refreshPlans()}>
                Buscar
              </button>
            </div>

            <div className="list">
              {plans.map((p) => (
                <button
                  key={p.id}
                  className={p.id === selectedPlanId ? "list__item list__item--active" : "list__item"}
                  onClick={() => {
                    setSelectedPlanId(p.id);
                    setSelectedSuiteId(null);
                    setSelectedCaseId(null);
                  }}
                >
                  <div className="list__title">{p.name}</div>
                  <div className="list__meta">{p.description ?? "Sem descrição"}</div>
                </button>
              ))}
            </div>
          </aside>

          <main className="main">
            {!hierarchy ? (
              <div className="empty">Selecione um Test Plan.</div>
            ) : (
              <>
                <section className="card">
                  <div className="card__header">
                    <div>
                      <div className="h1">{hierarchy.name}</div>
                      <div className="muted">{hierarchy.description ?? "Sem descrição"}</div>
                    </div>
                    <div className="row">
                      <button className="btn" onClick={() => void onEditPlan()}>
                        Editar
                      </button>
                      <button className="btn btn--danger" onClick={() => void onDeletePlan()}>
                        Excluir
                      </button>
                    </div>
                  </div>
                </section>

                <section className="grid">
                  <div className="panel">
                    <div className="panel__header">
                      <div className="panel__title">Suites</div>
                      <div className="row">
                        <button className="btn btn--primary" onClick={() => void onCreateSuite()}>
                          + Suite
                        </button>
                        <button className="btn" disabled={!selectedSuite} onClick={() => void onEditSuite()}>
                          Editar
                        </button>
                        <button className="btn btn--danger" disabled={!selectedSuite} onClick={() => void onDeleteSuite()}>
                          Excluir
                        </button>
                      </div>
                    </div>
                    <div className="list">
                      {hierarchy.testSuites.map((s) => (
                        <button
                          key={s.id}
                          className={s.id === selectedSuiteId ? "list__item list__item--active" : "list__item"}
                          onClick={() => {
                            setSelectedSuiteId(s.id);
                            setSelectedCaseId(s.testCases[0]?.id ?? null);
                          }}
                        >
                          <div className="list__title">{s.name}</div>
                          <div className="list__meta">{s.testCases.length} cases</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="panel">
                    <div className="panel__header">
                      <div className="panel__title">Test Cases</div>
                      <div className="row">
                        <button className="btn btn--primary" disabled={!selectedSuite} onClick={() => void onCreateCase()}>
                          + Case
                        </button>
                        <button className="btn" disabled={!selectedCase} onClick={() => void onEditCase()}>
                          Editar
                        </button>
                        <button className="btn btn--danger" disabled={!selectedCase} onClick={() => void onDeleteCase()}>
                          Excluir
                        </button>
                      </div>
                    </div>
                    <div className="list">
                      {(selectedSuite?.testCases ?? []).map((c) => (
                        <button
                          key={c.id}
                          className={c.id === selectedCaseId ? "list__item list__item--active" : "list__item"}
                          onClick={() => setSelectedCaseId(c.id)}
                        >
                          <div className="list__title">{c.title}</div>
                          <div className="list__meta">{c._count?.testRuns ?? 0} runs</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="panel">
                    <div className="panel__header">
                      <div className="panel__title">Detalhe / Execução</div>
                    </div>

                    {!selectedCase ? (
                      <div className="empty">Selecione um Test Case.</div>
                    ) : (
                      <div className="content">
                        <div className="h2">{selectedCase.title}</div>
                        {selectedCase.preconditions ? (
                          <div className="block">
                            <div className="label">Pré-condições</div>
                            <div>{selectedCase.preconditions}</div>
                          </div>
                        ) : null}

                        <div className="block">
                          <div className="label">Passos</div>
                          <ol className="steps">
                            {(selectedCase.steps ?? []).map((s, idx) => (
                              <li key={idx}>{s.action}</li>
                            ))}
                          </ol>
                        </div>

                        <div className="block">
                          <div className="label">Resultado esperado</div>
                          <div>{selectedCase.expectedResult}</div>
                        </div>

                        <div className="divider" />

                        <div className="h3">Executar agora</div>
                        <div className="field field--col">
                          <label>Status</label>
                          <select value={runStatus} onChange={(e) => setRunStatus(e.target.value as TestRunStatus)}>
                            <option value="Passed">Passed</option>
                            <option value="Failed">Failed</option>
                            <option value="Blocked">Blocked</option>
                          </select>
                        </div>
                        <div className="field field--col">
                          <label>Executado por</label>
                          <input value={runExecutedBy} onChange={(e) => setRunExecutedBy(e.target.value)} />
                        </div>
                        <div className="field field--col">
                          <label>Evidência (texto/link)</label>
                          <textarea value={runEvidence} onChange={(e) => setRunEvidence(e.target.value)} rows={3} />
                        </div>
                        <button className="btn btn--primary" onClick={() => void onExecuteCase()}>
                          Registrar execução
                        </button>

                        <div className="divider" />
                        <div className="h3">Últimas execuções</div>
                        <small className="muted">
                          (Para ver histórico completo, use a aba <b>Runs</b>)
                        </small>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}
          </main>
        </div>
      ) : tab === "runs" ? (
        <div className="page">
          <div className="page__header">
            <div>
              <div className="h1">Histórico de execuções</div>
              <div className="muted">Filtre por status para revisar falhas/bloqueios.</div>
            </div>
            <div className="row">
              <select value={runsStatusFilter} onChange={(e) => setRunsStatusFilter(e.target.value as any)}>
                <option value="">Todos</option>
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
                <option value="Blocked">Blocked</option>
              </select>
              <button className="btn" onClick={() => void refreshRuns()}>
                Atualizar
              </button>
            </div>
          </div>

          <div className="table">
            <div className="table__row table__head">
              <div>Status</div>
              <div>Test Case</div>
              <div>Suite</div>
              <div>Executado por</div>
              <div>Data</div>
              <div>Evidência</div>
            </div>
            {runs.map((r) => (
              <div key={r.id} className="table__row">
                <div>
                  <StatusPill status={r.status} />
                </div>
                <div className="mono">{r.testCase?.title ?? r.testCaseId}</div>
                <div className="muted">{r.testCase?.testSuite?.name ?? "-"}</div>
                <div>{r.executedBy}</div>
                <div className="muted">{new Date(r.executedAt).toLocaleString()}</div>
                <div className="muted">{r.evidence ?? "-"}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="page">
          <div className="page__header">
            <div>
              <div className="h1">Dashboard</div>
              <div className="muted">
                Métricas simples para acompanhar estabilidade (pass rate) e volume executado.
              </div>
            </div>
            <button className="btn" onClick={() => void refreshDashboard()}>
              Atualizar
            </button>
          </div>

          {!dashboard ? (
            <div className="empty">Carregue as métricas.</div>
          ) : (
            <div className="metrics">
              <div className="metric">
                <div className="metric__label">% Passed</div>
                <div className="metric__value">{dashboard.passRate}%</div>
              </div>
              <div className="metric">
                <div className="metric__label">Total executados</div>
                <div className="metric__value">{dashboard.totalExecuted}</div>
              </div>
              <div className="metric">
                <div className="metric__label">Passed</div>
                <div className="metric__value">{dashboard.passed}</div>
              </div>
              <div className="metric">
                <div className="metric__label">Failed</div>
                <div className="metric__value">{dashboard.failed}</div>
              </div>
              <div className="metric">
                <div className="metric__label">Blocked</div>
                <div className="metric__value">{dashboard.blocked}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
