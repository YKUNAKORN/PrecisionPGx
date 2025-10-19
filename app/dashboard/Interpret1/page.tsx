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
            'bg-primary text-primary-foreground ring-1 ring-ring',
          label: 'text-primary',
        }
      case 'complete':
        return {
          circle:
            'bg-muted text-muted-foreground ring-1 ring-ring',
          label: 'text-foreground/80',
        }
      default:
        return {
          circle:
            'bg-card text-card-foreground ring-1 ring-border',
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
      <div className="min-h-dvh bg-background text-foreground">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <header className="mb-4">
            <h1 className="text-2xl font-semibold tracking-tight">Result Interpretation</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review and interpret genetic test results
            </p>
          </header>

          {/* Stepper */}
          <div className="w-full rounded-xl border border-border p-4 bg-card text-card-foreground">
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
                          className="mx-2 hidden h-px w-10 rounded bg-border md:block"
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
          <div className="w-full mt-4 rounded-xl border border-border bg-card p-4 text-card-foreground">
            <div className="w-full grid grid-cols-[1fr_auto_auto] gap-3">
              <input
                placeholder="Search reports, patients…"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="rounded-lg border border-border bg-card px-4 py-2 text-sm hover:opacity-90">
                Clear All
              </button>
              <button className="rounded-lg border border-border bg-card px-4 py-2 text-sm hover:opacity-90">
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
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm disabled:opacity-50 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-border bg-card px-4 py-2 text-sm hover:opacity-90">
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
      <div className="rounded-xl border border-border bg-card p-6 text-card-foreground">
        <h2 className="text-sm font-semibold">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        <div className="mt-4">{children}</div>
      </div>
    )
  }

  function Placeholder({ label = 'Blank area' }: { label?: string }) {
    return (
      <div className="grid gap-4">
        <div className="h-48 rounded-lg border border-dashed border-border" />
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    )
  }
