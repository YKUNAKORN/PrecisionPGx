'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Single‑page Result Interpretation with inline step panels.
// Save as: app/interpretation/page.tsx
// - Click a step to switch content (no separate routes)
// - URL sync via ?step=<slug> (shallow replace, same page)
// - Each panel is a blank scaffold for you to design later

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
        circle: 'bg-emerald-600 text-white ring-1 ring-white/10',
        label: 'text-emerald-300',
      }
    case 'complete':
      return {
        circle: 'bg-emerald-950 text-emerald-300 ring-1 ring-emerald-500/20',
        label: 'text-emerald-300',
      }
    default:
      return {
        circle: 'bg-neutral-700 text-neutral-200 ring-1 ring-white/5',
        label: 'text-neutral-300',
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
    <div className="min-h-dvh bg-neutral text-zinc-100">

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <header className="mb-4">
          <h1 className="text-2xl font-semibold tracking-tight">Result Interpretation</h1>
          <p className="mt-1 text-sm text-zinc-400">Review and interpret genetic test results</p>
        </header>

        {/* Stepper */}
        <div className="w-ful rounded-xl border border-white/10 p-4">

          <nav aria-label="Progress" className=" ">
            
            <ol className="flex gap-2 md:gap-4 w-ful">
              {STEPS.map((step, idx) => {
                const status: StepStatus = idx === active ? 'current' : idx < active ? 'complete' : 'todo'
                const s = statusClasses(status)
                const isLast = idx === STEPS.length - 1
                return (
                  <li key={step.slug} className="relative flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActive(idx)}
                      className="group flex items-center gap-3 outline-none"
                    >
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.75rem] font-semibold ${s.circle}`}>
                        {step.id}
                      </span>
                      <span className={`text-sm font-medium whitespace-nowrap ${s.label}`}>{step.label}</span>
                    </button>
                    {!isLast && <span className="mx-2 hidden h-px w-10 rounded bg-white/10 md:block" aria-hidden="true" />}
                  </li>
                )
              })}
            </ol>
          </nav>
        </div>

        {/* Toolbar placeholder */}
        <div className="w-ful mt-4 rounded-xl border border-white/10 bg-neutral-900/40 p-4">
          <div className="w-ful grid grid-cols-[1fr_auto_auto] gap-3">
            <input
              placeholder="Search reports, patients…"
              className="w-full rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-violet-600"
            />
            <button className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm hover:bg-neutral-800">
                Clear All
            </button>

            <button className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm hover:bg-neutral-800">
                Reset Data
            </button>

          </div>
        </div>

        {/* Panels: inline, one visible at a time */}
        <section className="mt-6">
          {active === 0 && (
            <Panel title="Patient" subtitle="Design your patient table or picker here.">
              <Placeholder label="Reports Table area" />
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
            className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm disabled:opacity-50 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-600"
          >
            Back
          </button>
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm hover:bg-neutral-800">Save Draft</button>
            {active < STEPS.length - 1 ? (
              <button
                onClick={goNext}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-600"
              >
                Next
              </button>
            ) : (
              <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-600">
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
function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-6">
      <h2 className="text-sm font-semibold text-neutral-200">{title}</h2>
      {subtitle && <p className="mt-1 text-xs text-neutral-400">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

function Placeholder({ label = 'Blank area' }: { label?: string }) {
  return (
    <div className="grid gap-4">
      <div className="h-48 rounded-lg border border-dashed border-white/10" />
      <div className="text-xs text-neutral-500">{label}</div>
    </div>
  )
}
