export default function Home() {
  const trends = [
    { day: 'Sat', value: 72 },
    { day: 'Sun', value: 58 },
    { day: 'Mon', value: 35 },
    { day: 'Tue', value: 88 },
    { day: 'Wed', value: 55 },
    { day: 'Thu', value: 70 },
    { day: 'Fri', value: 48 },
  ];
  const maxVal = Math.max(...trends.map((t) => t.value));

  return (
    <div className="content-shell">
      {/* ✅ คุมระยะ content ให้บาลานซ์ทุกจอ */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            At a glance overview of operations and performance.
          </p>
        </header>

        {/* KPI / Metrics */}
        <section>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article className="metric">
              <div className="metric-title">Samples Received</div>
              <div className="metric-value">120</div>
              <div className="metric-bar" style={{ ['--progress' as any]: '72%' }}>
                <i />
              </div>
            </article>

            <article className="metric">
              <div className="metric-title">Tests Completed</div>
              <div className="metric-value">105</div>
              <div className="metric-bar" style={{ ['--progress' as any]: '82%' }}>
                <i />
              </div>
            </article>

            <article className="metric">
              <div className="metric-title">Results Interpreted</div>
              <div className="metric-value">98</div>
              <div className="metric-bar" style={{ ['--progress' as any]: '92%' }}>
                <i />
              </div>
            </article>
          </div>
        </section>

        {/* Trends + Execution Status */}
        <section>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Sample Registration Trends */}
            <div className="panel stack">
              <div>
                <p className="text-base font-medium">Sample Registration Trends</p>
                <p className="text-sm text-muted-foreground">Last 7 Days</p>
              </div>

              <div className="h-48 grid grid-cols-7 items-end gap-3">
                {trends.map((t) => (
                  <div key={t.day} className="flex flex-col items-center gap-2">
                    <div
                      className="w-8 rounded-md ring-1 ring-inset"
                      style={{
                        height: `${(t.value / maxVal) * 100}%`,
                        background: 'var(--accent)',
                        borderColor: 'var(--border)',
                      }}
                      aria-label={`${t.day}: ${t.value}`}
                    />
                    <span className="text-xs text-muted-foreground">{t.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Execution Status */}
            <div className="panel stack">
              <div>
                <p className="text-base font-medium">Test Execution Status</p>
                <p className="text-sm text-muted-foreground">Real-time workflow progress tracking</p>
              </div>

              <div className="stack">
                {[
                  { label: 'Submitted for Inspection', value: 8, pct: '20%' },
                  { label: 'Awaiting Inspection', value: 12, pct: '35%' },
                  { label: 'In Progress', value: 35, pct: '70%' },
                  { label: 'Completed', value: 50, pct: '92%' },
                  { label: 'Awaiting Report', value: 5, pct: '14%' },
                ].map((row) => (
                  <div key={row.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{row.label}</span>
                      <span className="text-sm">{row.value}</span>
                    </div>
                    <div className="kbar" style={{ ['--progress' as any]: row.pct }}>
                      <i />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sample Management */}
        <section>
          <div className="panel stack">
            <p className="text-base font-medium">Sample Management</p>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Sample ID</th>
                    <th>Patient Name</th>
                    <th>Test Type</th>
                    <th>Status</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['LAB-2023-001', 'Ethan Harper', 'Blood Test', 'Completed', 'Normal'],
                    ['LAB-2023-002', 'Olivia Bennett', 'Urine Analysis', 'In Progress', 'N/A'],
                    ['LAB-2023-003', 'Liam Carter', 'Biopsy', 'Pending', 'N/A'],
                    ['LAB-2023-004', 'Sophia Davis', 'Genetic Screening', 'Completed', 'Positive'],
                    ['LAB-2023-005', 'Noah Evans', 'Allergy Test', 'Completed', 'Negative'],
                  ].map(([id, name, type, status, result]) => (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{name}</td>
                      <td>{type}</td>
                      <td>
                        <span className="badge">
                          <i className="dot" />
                          {status}
                        </span>
                      </td>
                      <td>{result}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={5}>Showing 5 of 5 samples</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
