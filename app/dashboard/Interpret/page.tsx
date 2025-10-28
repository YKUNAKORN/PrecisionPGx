'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * Result Interpretation – single file / single page
 * - ใช้คลาสโครงสร้างจาก template.css: content-shell, page-container, section, panel, table, stack
 * - ไม่ hardcode สี: ใช้เฉพาะ border/spacing และอ้าง var(--*) เท่าที่จำเป็น
 * - ซิงก์ URL ผ่าน ?step=<slug>
 */

const STEPS = [
  { id: 1, slug: 'patient', label: 'Patient' },
  { id: 2, slug: 'raw-data', label: 'Raw Data' },
  { id: 3, slug: 'genotype', label: 'Genotype' },
  { id: 4, slug: 'phenotype', label: 'Phenotype' },
  { id: 5, slug: 'recommendations', label: 'Recommendations' },
  { id: 6, slug: 'confirmation', label: 'Confirmation' },
  { id: 7, slug: 'export-pdf', label: 'Export PDF' },
] as const

type StepKey = typeof STEPS[number]['slug']

export default function InterpretationPage() {
  const router = useRouter()
  const search = useSearchParams()

  // init from ?step=
  const initialIndex = React.useMemo(() => {
    const slug = search.get('step') as StepKey | null
    const idx = STEPS.findIndex((s) => s.slug === slug)
    return idx >= 0 ? idx : 0
  }, [search])

  const [active, setActive] = React.useState(initialIndex)

  // keep URL in sync
  React.useEffect(() => {
    const slug = STEPS[active]?.slug
    if (slug) router.replace(`?step=${slug}`, { scroll: false })
  }, [active, router])

  const goPrev = () => setActive((v) => Math.max(0, v - 1))
  const goNext = () => setActive((v) => Math.min(STEPS.length - 1, v + 1))

  return (
    <div className="content-shell">
      <div className="page-container stack">
        {/* Header */}
        <header className="page-header">
          <h1 className="page-title">Result Interpretation</h1>
          <p className="page-subtitle">Review and interpret genetic test results</p>
        </header>

        {/* Stepper */}
        <section className="section">
          <div className="panel">
            <nav aria-label="Progress">
              <ol className="flex gap-3 md:gap-4 w-full">
                {STEPS.map((step, idx) => {
                  const isActive = idx === active
                  const isDone = idx < active
                  const isLast = idx === STEPS.length - 1

                  return (
                    <li key={step.slug} className="relative flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setActive(idx)}
                        className="group flex items-center gap-3 outline-none"
                        aria-current={isActive ? 'step' : undefined}
                      >
                        <span
                          className="grid place-items-center h-7 w-7 rounded-full text-[0.75rem] font-semibold ring-1 ring-inset"
                          style={{
                            // ใช้ตัวแปรจากธีม ไม่กำหนดสีเอง
                            background: 'var(--surface)',
                            borderColor: 'var(--border)',
                            outline: isActive ? `2px solid var(--accent)` : undefined,
                          }}
                        >
                          {isDone ? '•' : step.id}
                        </span>
                        <span className="text-sm font-medium whitespace-nowrap">
                          {step.label}
                        </span>
                      </button>

                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className="mx-2 hidden h-px w-10 md:block"
                          style={{ background: 'var(--border)' }}
                        />
                      )}
                    </li>
                  )
                })}
              </ol>
            </nav>
          </div>
        </section>

        {/* Main Panels */}
        <section className="section stack">
          {active === 0 && <PatientPanel />}
          {active === 1 && <RawDataPanel onNext={goNext} />}
          {active === 2 && <GenotypePanel />}
          {active === 3 && <PhenotypePanel onNext={goNext} />}
          {active === 4 && <RecommendationsPanel />}
          {active === 5 && <ConfirmationPanel onNext={goNext} />}
          {active === 6 && <ExportPdfPanel />}
        </section>

        {/* Footer */}
        <section className="section">
          <div className="flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={active === 0}
              className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
              style={{ borderColor: 'var(--border)' }}
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                className="rounded-lg border px-4 py-2 text-sm"
                style={{ borderColor: 'var(--border)' }}
              >
                Save Draft
              </button>
              <button
                onClick={goNext}
                className="rounded-lg px-4 py-2 text-sm font-medium"
                style={{
                  border: `1px solid var(--border)`,
                  background: 'var(--surface)',
                }}
              >
                {active < STEPS.length - 1 ? 'Next' : 'Finish'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

/* =========================================================
 * Patient (step 1) — ดึงข้อมูลจาก /api/user/report
 * =======================================================*/

function PatientPanel() {
  return (
    <div className="stack">
      <Toolbar />
      <PatientTable />
    </div>
  )
}

function Toolbar() {
  return (
    <div className="panel">
      <div className="w-full grid grid-cols-[1fr_auto_auto] gap-3">
        <input
          placeholder="Search reports, patients…"
          className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
          style={{ borderColor: 'var(--border)' }}
        />
        <button className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
          Clear All
        </button>
        <button className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
          Reset Data
        </button>
      </div>
    </div>
  )
}

type Row = {
  id: string
  report_no: string
  patient: string
  status: 'Completed' | 'In Progress' | 'Failed'
  is_approve: 'approved' | 'pending' | 'rejected'
  updated_at?: string | null
}

function PatientTable() {
  const [rows, setRows] = React.useState<Row[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [q, setQ] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const limit = 10

  function normalize(r: any): Row {
    return {
      id: String(r.id ?? r.report_id ?? r.reportNo ?? crypto.randomUUID()),
      report_no: String(r.report_no ?? r.reportNo ?? r.code ?? '-'),
      patient: String(r.patient ?? r.full_name ?? r.patient_name ?? '-'),
      status: (r.status ?? 'In Progress') as Row['status'],
      is_approve: (r.is_approve ?? r.approval ?? 'pending') as Row['is_approve'],
      updated_at: r.updated_at ?? r.updatedAt ?? null,
    }
  }

  const load = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({ limit: String(limit), page: String(page) })
      if (q.trim()) params.set('q', q.trim())

      const res = await fetch(`/api/user/report?${params.toString()}`, { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to load')

      const data: Row[] = (json.data ?? []).map(normalize)
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

  return (
    <div className="panel stack">
      {/* search box */}
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by report number or patient…"
          className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
          style={{ borderColor: 'var(--border)' }}
        />
        <button
          onClick={() => {
            setPage(1)
            load()
          }}
          className="rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: 'var(--border)' }}
        >
          Search
        </button>
      </div>

      {/* table */}
      <div className="overflow-y-auto max-h-[60vh] rounded-xl ring-1 ring-inset" style={{ borderColor: 'var(--border)' }}>
        <table className="table min-w-full">
          <thead>
            <tr>
              <th>Report Number</th>
              <th>Patient</th>
              <th>Status</th>
              <th>IsApprove</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ color: 'var(--muted)' }}>
                  Loading…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5}>Error: {error}</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ color: 'var(--muted)' }}>
                  No data
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="font-medium">{r.report_no}</td>
                  <td>{r.patient}</td>
                  <td>
                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border" style={{ borderColor: 'var(--border)' }}>
                      <i className="dot" />
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <span className="dot" />
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="rounded-full border px-3 py-1.5 text-xs font-medium" style={{ borderColor: 'var(--border)' }}>
                        <PencilIcon /> EDIT
                      </button>
                      <button className="rounded-full border px-3 py-1.5 text-xs font-medium" style={{ borderColor: 'var(--border)' }}>
                        Approval
                      </button>
                      <button className="rounded-full border px-3 py-1.5 text-xs font-semibold" style={{ borderColor: 'var(--border)' }}>
                        {r.status === 'Completed' ? 'Preview' : 'Continue'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan={5} style={{ color: 'var(--muted)' }}>
                Showing {rows.length} of {total} reports
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between text-sm">
        <span style={{ color: 'var(--muted)' }}>
          Page {page} / {Math.max(1, Math.ceil(total / limit))} · {total} records
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="rounded-lg border px-3 py-1 disabled:opacity-50"
            style={{ borderColor: 'var(--border)' }}
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * limit >= total || loading}
            className="rounded-lg border px-3 py-1 disabled:opacity-50"
            style={{ borderColor: 'var(--border)' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}

/* =========================================================
 * Raw Data (step 2)
 * =======================================================*/
function RawDataPanel({ onNext }: { onNext: () => void }) {
  return (
    <div className="stack">
      <SelectedPatientCard />
      <div className="panel stack">
        <h2 className="text-lg font-semibold">Raw Variant Data (VCF excerpt)</h2>
        <div
          className="rounded-xl"
          style={{
            padding: '1rem',
            border: `1px dashed var(--border)`,
            background: 'var(--surface)',
          }}
        >
          <pre className="overflow-x-auto text-xs leading-relaxed">
{`#CHROM  POS     ID        REF ALT QUAL FILTER INFO
chr19   9655168  rs11185532  C   T   99   PASS   GENE=CYP2C19;IMPACT=MODERATE
chr19   9474180  rs4986833   G   A   99   PASS   GENE=CYP2C19;IMPACT=HIGH
chr22   42130797 rs11355840  C   G   99   PASS   GENE=CYP2D6;IMPACT=LOW`}
          </pre>
        </div>

        <div className="flex items-center justify-end">
          <button onClick={onNext} className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
            Continue to Genotype
          </button>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
 * Genotype (step 3)
 * =======================================================*/
function GenotypePanel() {
  return (
    <div className="stack">
      <SelectedPatientCard />
      <div className="panel stack">
        <h2 className="text-lg font-semibold">Rule-Based Genotype Interpretation</h2>
        <p style={{ color: 'var(--muted)' }}>
          Algorithm-based genotype-to-phenotype conversion following CPIC/PharmGKB guidelines
        </p>

        <div className="overflow-x-auto rounded-xl ring-1 ring-inset" style={{ borderColor: 'var(--border)' }}>
          <table className="table min-w-[900px]">
            <thead>
              <tr>
                <th>Gene</th>
                <th>Alleles</th>
                <th>G/G</th>
                <th>C/C</th>
                <th>A/A</th>
                <th>T/T</th>
                <th>Predicted Genotype</th>
                <th>Predicted Phenotype</th>
                <th>Activity</th>
              </tr>
            </thead>
            <tbody>
              {['CYP2C19', 'CYP2D6', 'SLCO1B1'].map((gene, i) => (
                <tr key={gene} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td>
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" />
                      {gene}
                    </label>
                  </td>
                  <td>*1 / *2</td>
                  <td>–</td>
                  <td>{i !== 1 ? '✓' : '–'}</td>
                  <td>–</td>
                  <td>–</td>
                  <td>*1/*2</td>
                  <td>
                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border" style={{ borderColor: 'var(--border)' }}>
                      <i className="dot" />
                      Intermediate Metabolizer
                    </span>
                  </td>
                  <td className="text-right">{i === 2 ? '2.0' : '1.5'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Activity Score — Calculated from allele function values per CPIC guidelines
        </p>
      </div>
    </div>
  )
}

/* =========================================================
 * Phenotype (step 4)
 * =======================================================*/
function PhenotypePanel({ onNext }: { onNext: () => void }) {
  return (
    <div className="stack">
      <SelectedPatientCard />
      <div className="panel stack">
        <h2 className="text-lg font-semibold">Phenotype Classification</h2>

        {/* Bars (เป็นกลาง) */}
        <BarRow label="Activity Score" value={0.5} rightHint="1.50 of 3.00" />
        <BarRow label="Confidence" value={0.85} rightHint="High" />

        <div className="flex items-center justify-end">
          <button onClick={onNext} className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
            Continue to Recommendations
          </button>
        </div>
      </div>
    </div>
  )
}

function BarRow({ label, value, rightHint }: { label: string; value: number; rightHint?: string }) {
  const pct = Math.max(0, Math.min(1, value)) * 100
  return (
    <div className="stack">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        {rightHint && <span>{rightHint}</span>}
      </div>
      <div className="h-3 rounded-full" style={{ background: 'color-mix(in oklab, var(--accent) 20%, transparent)' }}>
        <i
          style={{
            display: 'block',
            height: '100%',
            width: `${pct}%`,
            background: 'var(--accent)',
            borderRadius: 9999,
          }}
        />
      </div>
    </div>
  )
}

/* =========================================================
 * Recommendations (step 5)
 * =======================================================*/
function RecommendationsPanel() {
  return (
    <div className="stack">
      <SelectedPatientCard />
      <div className="panel stack">
        <h2 className="text-lg font-semibold">Quality Review</h2>

        <div className="stack">
          {[
            'Coverage ≥ 100x',
            'Allele balance between 0.35 and 0.65',
            'Quality Score ≥ 95',
          ].map((txt) => (
            <div key={txt} className="flex items-center gap-3">
              <span className="dot" />
              <span>{txt}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
            Validate
          </button>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
 * Confirmation (step 6)
 * =======================================================*/
function ConfirmationPanel({ onNext }: { onNext: () => void }) {
  return (
    <div className="stack">
      <SelectedPatientCard />
      <div className="panel stack">
        <h2 className="text-lg font-semibold">Approval</h2>
        <p style={{ color: 'var(--muted)' }}>
          Review and approve this interpretation.
        </p>

        <div className="flex flex-wrap gap-2">
          <button className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
            Request Review
          </button>
          <button onClick={onNext} className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
            Approve &amp; Continue to Export
          </button>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
 * Export PDF (step 7)
 * =======================================================*/
function ExportPdfPanel() {
  return (
    <div className="stack">
      <SelectedPatientCard />
      <div className="panel stack">
        <h2 className="text-lg font-semibold">Export PDF Report</h2>

        <div className="panel">
          <h3 className="text-sm font-semibold">Report Summary</h3>
          <div className="grid gap-1 mt-2 text-sm">
            <div>Patient: Sarah Johnson</div>
            <div>Test Type: Pharmacogenomics Panel</div>
            <div>Report Number: RPT-2025-002</div>
            <div>Status: Ready for Export</div>
          </div>
        </div>

        <div className="stack">
          <h3 className="text-sm font-semibold">Export Options</h3>
          <div className="grid gap-2">
            {[
              'Include patient demographics',
              'Include raw data summary',
              'Include genotype results',
              'Include phenotype classification',
              'Include drug recommendations',
              'Include quality metrics',
            ].map((opt) => (
              <label key={opt} className="inline-flex items-center gap-3">
                <input type="checkbox" defaultChecked />
                <span>{opt}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
              Preview Report
            </button>
            <button className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
              Download PDF
            </button>
            <button className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: 'var(--border)' }}>
              Email Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
 * Shared header card (บนรูปทุก panel)
 * =======================================================*/
function SelectedPatientCard() {
  return (
    <div
      className="rounded-2xl ring-1 ring-inset p-4 md:p-5"
      style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <div
            className="grid place-items-center size-10 rounded-full"
            style={{ border: `1px solid var(--border)` }}
          >
            SJ
          </div>
          <div>
            <div className="text-base font-semibold">Sarah Johnson</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>
              Female · 35 years old
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <Info label="Report" value="RPT-2025-002" />
          <Info label="MRN" value="MRN-123456" />
          <Info label="DOB" value="Jul 22, 1990" />
          <Info label="Physician" value="Dr. Emily Chen" />
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[10rem]">
      <div className="text-xs" style={{ color: 'var(--muted)' }}>
        {label}
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  )
}
