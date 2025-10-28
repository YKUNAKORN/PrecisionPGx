  'use client'

  import * as React from 'react'
  import { useRouter, useSearchParams } from 'next/navigation'

  // Result Interpretation – single page with inline panels
  // - Theme-aware (no hardcoded colors)
  // - URL sync via ?step=<slug>

  const STEPS = [
    { id: 1, slug: 'patient', label: 'Patient' },
    { id: 2, slug: 'raw-data', label: 'Raw Data' },
    { id: 3, slug: 'genotype', label: 'Genotype' },
    { id: 4, slug: 'phenotype', label: 'Phenotype' },
    { id: 5, slug: 'recommendations', label: 'Recommendations' },
    { id: 6, slug: 'confirmation', label: 'Confirmation' },
    { id: 7, slug: 'export-pdf', label: 'Export PDF' },
  ] as const

  type StepId = typeof STEPS[number]['id']
  type StepStatus = 'current' | 'complete' | 'todo'

  function statusClasses(status: StepStatus) {
    switch (status) {
      case 'current':
        return {
          circle:
            'bg-primary text-primary-foreground ring-1 ring-ring border-1',
          label: 'text-primary',
        }
      case 'complete':
        return {
          circle:
            'bg-primary bg-muted text-foreground ring-1 ring-ring ',
          label: 'text-primary',
        }
      default:
        return {
          circle:
            ' text--foreground ring-1 ring-border border-1',
          label: 'text-muted-foreground',
        }
    }
  }

  export default function InterpretationInlinePage() {
    const router = useRouter()
    const search = useSearchParams()

    // init from ?step=slug (fallback to first step)
    const initialIndex = React.useMemo(() => {
      const slug = search.get('step')
      const idx = STEPS.findIndex((s) => s.slug === slug)
      return idx >= 0 ? idx : 0
    }, [search])

    const [active, setActive] = React.useState<number>(initialIndex)

    // Keep URL in sync when active changes (shallow replace, no scroll)
    React.useEffect(() => {
      const slug = STEPS[active]?.slug
      if (!slug) return
      router.replace(`?step=${slug}`, { scroll: false })
    }, [active, router])

    const goPrev = () => setActive((v) => (v > 0 ? v - 1 : v))
    const goNext = () => setActive((v) => (v < STEPS.length - 1 ? v + 1 : v))

    return (
      <div className="min-h-dvh ">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <header className="mb-4">
            <h1 className="text-2xl font-semibold tracking-tight">Result Interpretation</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review and interpret genetic test results
            </p>
          </header>

          {/* Stepper */}
          <div className="w-full rounded-xl border p-4 ">
            <nav aria-label="Progress">
              <ol className="flex gap-2 md:gap-4 w-full">
                {STEPS.map((step, idx) => {
                  const status: StepStatus =
                    idx === active ? 'current' : idx < active ? 'complete' : 'todo'
                  const s = statusClasses(status)
                  const isLast = idx === STEPS.length - 1
                  return (
                    <li key={step.slug} className="relative flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setActive(idx)}
                        className="group flex items-center gap-3 outline-none"
                        aria-current={status === 'current' ? 'step' : undefined}
                        aria-label={`Step ${step.id}: ${step.label}`}
                      >
                        <span
                          className={[
                            'flex h-6 w-6 items-center justify-center rounded-full text-[0.75rem] font-semibold',
                            s.circle,
                          ].join(' ')}
                        >
                          {step.id}
                        </span>
                        <span className={['text-sm font-medium whitespace-nowrap', s.label].join(' ')}>
                          {step.label}
                        </span>
                      </button>
                      {!isLast && (
                        <span
                          className="mx-2 hidden h-px w-10 rounded  md:block"
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  )
                })}
              </ol>
            </nav>
          </div>

          {/* Toolbar placeholder */}
          {/* <div className="w-full mt-4 rounded-xl border  p-4 ">
            <div className="w-full grid grid-cols-[1fr_auto_auto] gap-3">
              <input
                placeholder="Search reports, patients…"
                className="w-full rounded-lg border border-input  px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="rounded-lg border  px-4 py-2 text-sm hover:opacity-90">
                Clear All
              </button>
              <button className="rounded-lg border  px-4 py-2 text-sm hover:opacity-90">
                Reset Data
              </button>
            </div>
          </div> */}

          {/* Panels: inline, one visible at a time */}
          <section className="mt-6">
            {active === 0 && (
              <Panel title="Patient" subtitle="Design your patient table or picker here.">
                <PatientTable />
              </Panel>
            )}
            {active === 1 && (
              <Panel title="Raw Data" subtitle="Upload or select raw data files.">
                <Placeholder />
              </Panel>
            )}
            {active === 2 && (
              <Panel title="Genotype" subtitle="Compute / enter genotype information.">
                <Placeholder />
              </Panel>
            )}
            {active === 3 && (
              <Panel title="Phenotype" subtitle="Review or input phenotype.">
                <Placeholder />
              </Panel>
            )}
            {active === 4 && (
              <Panel title="Recommendations" subtitle="Clinical recommendations go here.">
                <Placeholder />
              </Panel>
            )}
            {active === 5 && (
              <Panel title="Confirmation" subtitle="Summaries and checks before finalize.">
                <Placeholder />
              </Panel>
            )}
            {active === 6 && (
              <Panel title="Export PDF" subtitle="Hook up your PDF export flow.">
                <Placeholder />
              </Panel>
            )}
          </section>

          {/* Footer actions */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={active === 0}
              className="rounded-lg border  px-4 py-2 text-sm disabled:opacity-50 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              <button className="rounded-lg border  px-4 py-2 text-sm hover:opacity-90">
                Save Draft
              </button>
              {active < STEPS.length - 1 ? (
                <button
                  onClick={goNext}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring hover:opacity-95"
                >
                  Next
                </button>
              ) : (
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring hover:opacity-95">
                  Export
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---------- small helpers ----------
  function Panel({
    title,
    subtitle,
    children,
  }: {
    title: string
    subtitle?: string
    children?: React.ReactNode
  }) {
    return (
      <div className="rounded-xl border  p-6 ">
        <h2 className="text-sm font-semibold">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        <div className="mt-4">{children}</div>
      </div>
    )
  }

  function Placeholder({ label = 'Blank area' }: { label?: string }) {
    return (
      <div className="grid gap-4">
        <div className="h-48 rounded-lg border border-dashed " />
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    )
  }

  function PatientTable() {
  type Row = {
    id: string
    report_no: string
    patient: string
    status: 'Completed' | 'In Progress' | 'Failed'
    is_approve: 'approved' | 'pending' | 'rejected'
    updated_at?: string | null
  }

  const [rows, setRows] = React.useState<Row[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [q, setQ] = React.useState("")
  const [page, setPage] = React.useState(1)
  const limit = 10
  const [total, setTotal] = React.useState(0)

  // แปลงข้อมูลจาก API ให้เข้ากับ Row (ยืดหยุ่นชื่อฟิลด์)
  function normalizeRow(r: any): Row {
    return {
      id: String(r.id ?? r.report_id ?? r.reportNo ?? crypto.randomUUID()),
      report_no: String(r.report_no ?? r.reportNo ?? r.code ?? "-"),
      patient: String(r.patient ?? r.full_name ?? r.patient_name ?? "-"),
      status: (r.status ?? "In Progress") as Row["status"],
      is_approve: (r.is_approve ?? r.approval ?? "pending") as Row["is_approve"],
      updated_at: r.updated_at ?? r.updatedAt ?? null,
    }
  }

  const load = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams({
        limit: String(limit),
        page: String(page),
      })
      if (q.trim()) params.set("q", q.trim())

      const res = await fetch(`/api/user/report?${params.toString()}`, {
        cache: "no-store",
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load")

      const data: Row[] = (json.data ?? []).map(normalizeRow)
      setRows(data)
      setTotal(json.total ?? data.length ?? 0)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [q, page])

  React.useEffect(() => {
    load()
  }, [load])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  // ---------- UI helpers ----------
  const StatusBadge = ({ status }: { status: Row["status"] }) => {
    if (status === "Completed") {
      return (
        <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Completed
        </span>
      )
    }
    if (status === "In Progress") {
      return (
        <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          In Progress
        </span>
      )
    }
    // Failed (เส้นกรอบแดง ตัวอักษรแดง)
    return (
      <span className="inline-flex items-center rounded-full border border-destructive px-3 py-1 text-xs font-semibold text-destructive">
        Failed
      </span>
    )
  }

  const ApproveDot = ({ state }: { state: Row["is_approve"] }) => {
    const color =
      state === "approved" ? "bg-emerald-500" : state === "pending" ? "bg-amber-500" : "bg-red-500"
    return <span className={`inline-block size-3 rounded-full ${color}`} />
  }

  const PencilIcon = () => (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )

  const ActionButtons = ({ row }: { row: Row }) => {
    const primaryLabel = row.status === "Completed" ? "Preview" : "Continue"
    return (
      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium">
          <PencilIcon />
          EDIT
        </button>
        <button className="rounded-full border px-3 py-1.5 text-xs font-medium">
          Approval
        </button>
        <button className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
          {primaryLabel}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* ค้นหา */}
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by report number or patient..."
          className="w-full rounded-lg border border-input px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={() => {
            setPage(1)
            load()
          }}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          Search
        </button>
      </div>

      {/* ตาราง (มีสกรอลล์ + sticky header) */}
      <div className="overflow-y-auto max-h-[60vh] rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-muted/50">
            <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left">
              <th>Report Number</th>
              <th>Patient</th>
              <th>Status</th>
              <th>IsApprove</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody className="[&>tr>td]:px-4 [&>tr>td]:py-3">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-destructive">Error: {error}</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-muted-foreground">
                  No data
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="font-medium">{r.report_no}</td>
                  <td>{r.patient}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td><ApproveDot state={r.is_approve} /></td>
                  <td><ActionButtons row={r} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* หน้า */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Page {page} / {Math.max(1, Math.ceil(total / limit))} · {total} records
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="rounded-lg border px-3 py-1 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * limit >= total || loading}
            className="rounded-lg border px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
