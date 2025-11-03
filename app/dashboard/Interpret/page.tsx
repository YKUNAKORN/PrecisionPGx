"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Single-file page (Next.js + Tailwind)
 * - left sidebar, header, stepper, table, 7 panels
 */

const STEPS = [
  { id: 1, slug: "patient", label: "Patient" },
  { id: 2, slug: "raw-data", label: "Raw Data" },
  { id: 3, slug: "genotype", label: "Genotype" },
  { id: 4, slug: "phenotype", label: "Phenotype" },
  { id: 5, slug: "recommendations", label: "Recommendations" },
  { id: 6, slug: "confirmation", label: "Confirmation" },
  { id: 7, slug: "export-pdf", label: "Export PDF" },
] as const;

type StepKey = (typeof STEPS)[number]["slug"];

/** ---------- API types & local model ---------- */
type ApiReport = {
  id: string;        // ใช้แสดงในคอลัมน์ Report Number
  patient_id: string;  // ใช้แสดงในคอลัมน์ Patient
  status?: string;   // complete | in progress | failed | (อาจไม่มี)
  // อื่น ๆ ตาม API จริง เพิ่มได้
};

type StatusNorm = "complete" | "in progress" | "failed" | "unknown";

type ReportRow = {
  id: string;
  report_no: string;  // แสดง id อีกชุด
  patient: string;
  status: "Completed" | "In Progress" | "Failed";
  is_approve: "approved" | "pending" | "rejected";
  mrn?: string | null;
  dob?: string | null;
  physician?: string | null;
  gender?: string | null;
  age?: string | null;
};

/** ---------- helpers: status mapping & colors ---------- */
function normalizeStatus(s?: string | null): StatusNorm {
  if (!s) return "unknown";
  const t = s.toLowerCase().trim();
  if (t === "complete" || t === "completed") return "complete";
  if (t === "in progress" || t === "in_progress" || t === "processing") return "in progress";
  if (t === "failed" || t === "fail" || t === "error") return "failed";
  return "unknown";
}
function toDisplayStatus(norm: StatusNorm): ReportRow["status"] {
  if (norm === "complete") return "Completed";
  if (norm === "in progress") return "In Progress";
  return "Failed"; // failed/unknown → Failed
}
function toApprove(norm: StatusNorm): ReportRow["is_approve"] {
  if (norm === "complete") return "approved";
  if (norm === "in progress") return "pending";
  return "rejected"; // failed/unknown → แดง
}
function dotColorClass(norm: StatusNorm) {
  if (norm === "complete") return "bg-green-500 border-green-600";
  if (norm === "in progress") return "bg-orange-400 border-orange-500";
  return "bg-red-500 border-red-600"; // failed/unknown
}

/** ---------- page component ---------- */
export default function Page() {
  const router = useRouter();
  const search = useSearchParams();

  const initialIndex = React.useMemo(() => {
    const q = search.get("step") as StepKey | null;
    const idx = STEPS.findIndex((s) => s.slug === q);
    return idx >= 0 ? idx : 0;
  }, [search]);

  const [active, setActive] = React.useState(initialIndex);
  const [selectedReport, setSelectedReport] = React.useState<ReportRow | null>(null);

  // 🔹 state สำหรับโหลดข้อมูลจาก API
  const [rows, setRows] = React.useState<ReportRow[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // sync URL แค่ step (ตัด id ออกแล้ว)
  React.useEffect(() => {
    const slug = STEPS[active]?.slug;
    if (slug) router.replace(`?step=${slug}`, { scroll: false });
  }, [active, router]);

  // 🔹 ดึงข้อมูลจาก /api/user/report
  React.useEffect(() => {
    let cancelled = false;
    async function fetchReports() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/user/report`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ApiReport[] = await res.json();

        const list = Array.isArray(data) ? data : [];
        const mapped: ReportRow[] = list.map((it) => {
          const norm = normalizeStatus(it.status);
          return {
            id: it.id,
            report_no: it.id,               // 👉 Report Number = id
            patient: it.patient_id ?? "-",    // 👉 Patient = patient_id
            status: toDisplayStatus(norm),  // 👉 Status
            is_approve: toApprove(norm),    // 👉 สีวงกลม IsApprove
            mrn: null,
            dob: null,
            physician: null,
            gender: null,
            age: null,
          };
        });

        if (!cancelled) setRows(mapped);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Fetch failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchReports();
    return () => {
      cancelled = true;
    };
  }, []);

  const goPrev = () => setActive((v) => Math.max(0, v - 1));
  const goNext = () => setActive((v) => Math.min(STEPS.length - 1, v + 1));

  return (
    <div className="min-h-screen flex">
      {/* main */}
      <main className="flex-1 min-h-screen">
        {/* top bar */}
        <header className="flex flex-col px-6 py-4 ">
          <h1 className="text-2xl font-semibold leading-tight">Result Interpretation</h1>
          <p className="text-sm leading-relaxed">Review and interpret genetic test results</p>
        </header>

        {/* stepper */}
        <section className="px-6 py-4 ">
          <ol className="flex items-center gap-4 overflow-x-auto">
            {STEPS.map((s, idx) => {
              const isActive = idx === active;
              const isDone = idx < active;
              return (
                <li key={s.slug} className="flex items-center gap-3">
                  <button
                    onClick={() => setActive(idx)}
                    className={[
                      "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
                      isActive ? "ring-1" : "",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "size-6 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors",
                        isActive
                          ? "border-purple-600 bg-purple-600 "
                          : isDone
                          ? "border-purple-400 bg-purple-400 "
                          : "border-neutral-300 text-neutral-400",
                      ].join(" ")}
                    >
                      {s.id}
                    </span>
                    <span className="whitespace-nowrap">{s.label}</span>
                  </button>
                  {idx < STEPS.length - 1 ? <span className="h-px w-10 border-t" /> : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* body */}
        <section className="flex flex-col gap-4 px-6 py-4">
          {/* step 1 table */}
          {active === 0 ? (
            <>
              {/* search row */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex-1 min-w-[14rem]">
                  <label className="sr-only" htmlFor="search">
                    Search reports, patients…
                  </label>
                  <div className="flex items-center gap-2 border rounded-full px-3 py-2">
                    <span className="size-4 border rounded-full" aria-hidden />
                    <input
                      id="search"
                      placeholder="Search reports, patients…"
                      className="flex-1 outline-none bg-transparent text-sm"
                    />
                  </div>
                </div>
                <button
                  className="border rounded-full px-4 py-2 text-sm"
                  onClick={() => setSelectedReport(null)}
                >
                  Clear Selection
                </button>
                <button
                  className="border rounded-full px-4 py-2 text-sm"
                  onClick={() => window.location.reload()}
                >
                  Reload Data
                </button>
              </div>

              {/* table */}
              <div className="border rounded-xl overflow-hidden">
                {loading ? (
                  <div className="p-6 text-sm">Loading reports…</div>
                ) : error ? (
                  <div className="p-6 text-sm">Failed to load: {error}</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr className="h-11">
                        <th className="text-left px-4 font-medium">Report Number</th>
                        <th className="text-left px-4 font-medium">Patient</th>
                        <th className="text-left px-4 font-medium">Status</th>
                        <th className="text-left px-4 font-medium">IsApprove</th>
                        <th className="text-left px-4 font-medium w-[16rem]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(rows ?? []).map((r) => {
                        const isSelected = selectedReport?.id === r.id;
                        const norm = normalizeStatus(r.status);
                        const isComplete = norm === "complete";
                        return (
                          <tr
                            key={r.id}
                            className={["border-b last:border-b-0", isSelected ? "ring-inset" : ""].join(" ")}
                          >
                            {/* Report Number = id */}
                            <td
                              className="px-4 py-3 cursor-pointer"
                              onClick={() => {
                                setSelectedReport(r);
                                setActive(1);
                              }}
                            >
                              {r.report_no}
                            </td>

                            {/* Patient = patient_id */}
                            <td
                              className="px-4 py-3 cursor-pointer"
                              onClick={() => {
                                setSelectedReport(r);
                                setActive(1);
                              }}
                            >
                              {r.patient}
                            </td>

                            {/* Status (text) */}
                            <td
                              className="px-4 py-3 cursor-pointer"
                              onClick={() => {
                                setSelectedReport(r);
                                setActive(1);
                              }}
                            >
                              <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
                                <span className="size-2 rounded-full border" aria-hidden />
                                {r.status}
                              </span>
                            </td>

                            {/* IsApprove สีตามเงื่อนไข */}
                            <td
                              className="px-4 py-3 cursor-pointer"
                              onClick={() => {
                                setSelectedReport(r);
                                setActive(1);
                              }}
                            >
                              <span className="inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs">
                                <span
                                  className={`size-2 rounded-full border ${dotColorClass(norm)}`}
                                  aria-hidden
                                />
                                {r.is_approve}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  className="inline-flex items-center gap-1 border rounded-full px-3 py-1.5 text-xs"
                                  onClick={() => {
                                    setSelectedReport(r);
                                    setActive(1);
                                  }}
                                >
                                  <span className="size-4 border rounded" aria-hidden />
                                  EDIT
                                </button>
                                <button className="border rounded-full px-3 py-1.5 text-xs">
                                  Approval
                                </button>
                                <button
                                  className="border rounded-full px-3 py-1.5 text-xs"
                                  onClick={() => {
                                    setSelectedReport(r);
                                    setActive(1);
                                  }}
                                >
                                  {isComplete ? "Preview" : "Continue"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={5} className="px-4 py-3 text-sm">
                          Showing {rows?.length ?? 0} of {rows?.length ?? 0} reports
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>
            </>
          ) : null}

          {/* step >= 2 : selected card */}
          {active > 0 ? (
            selectedReport ? (
              <div className="border rounded-2xl px-4 py-4 flex flex-wrap gap-6 items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full border flex items-center justify-center text-sm font-semibold">
                    {initials(selectedReport.patient)}
                  </div>
                  <div>
                    <div className="text-base font-semibold leading-tight">{selectedReport.patient}</div>
                    <div className="text-sm">
                      {selectedReport.gender ? selectedReport.gender : "—"}{" "}
                      {selectedReport.age ? `• ${selectedReport.age}` : ""}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 text-sm">
                  <Info label="Report" value={selectedReport.report_no} />
                  <Info label="MRN" value={selectedReport.mrn ?? "-"} />
                  <Info label="DOB" value={selectedReport.dob ?? "-"} />
                  <Info label="Physician" value={selectedReport.physician ?? "-"} />
                </div>
                <button
                  onClick={() => {
                    setSelectedReport(null);
                    setActive(0);
                  }}
                  className="border rounded-full px-3 py-1 text-xs ml-auto"
                >
                  Clear
                </button>
              </div>
            ) : (
              <div className="border rounded-xl px-4 py-3 text-sm">
                No patient selected. Please select a report in the Patient step first.
              </div>
            )
          ) : null}

          {/* panels อื่น ๆ เหมือนเดิม */}
          {active === 1 && (
            <div className="border rounded-xl p-4 flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Raw Variant Data (VCF excerpt)</h2>
              <div className="border rounded-xl p-4 overflow-x-auto text-xs font-mono leading-relaxed">
                <pre>
{`#CHROM  POS     ID        REF ALT QUAL FILTER INFO
chr19   9655168  rs11185532  C   T   99   PASS   GENE=CYP2C19;IMPACT=MODERATE
chr19   9474180  rs4986833   G   A   99   PASS   GENE=CYP2C19;IMPACT=HIGH
chr22   42130797 rs11355840  C   G   99   PASS   GENE=CYP2D6;IMPACT=LOW`}
                </pre>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <MetricCard label="Coverage" value="110x" />
                <MetricCard label="Mean QScore" value="38" />
                <MetricCard label="Reads on Target" value="99%" />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={goNext}
                  disabled={!selectedReport}
                  className="border rounded-full px-4 py-2 text-sm disabled:opacity-50"
                >
                  Continue to Genotype
                </button>
              </div>
            </div>
          )}

          {active === 2 && (
            <div className="border rounded-xl p-4 flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold">Rule-Based Genotype Interpretation</h2>
                <p className="text-sm mt-1">
                  Algorithm-based genotype-to-phenotype conversion following CPIC/PharmGKB guidelines.
                </p>
              </div>

              <div className="rounded-xl border overflow-x-auto">
                <table className="min-w-[900px] w-full text-sm">
                  <thead className="border-b">
                    <tr className="h-11">
                      <th className="text-left px-4">Gene</th>
                      <th className="text-left px-4">Alleles</th>
                      <th className="text-left px-4">G/G</th>
                      <th className="text-left px-4">C/C</th>
                      <th className="text-left px-4">A/A</th>
                      <th className="text-left px-4">T/T</th>
                      <th className="text-left px-4">Predicted Genotype</th>
                      <th className="text-left px-4">Predicted Phenotype</th>
                      <th className="text-left px-4">Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["CYP2C19", "CYP2D6", "SLCO1B1"].map((gene, i) => (
                      <tr key={gene} className="border-b last:border-b-0">
                        <td className="px-4 py-3">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="size-4" />
                            {gene}
                          </label>
                        </td>
                        <td className="px-4 py-3">*1 / *2</td>
                        <td className="px-4 py-3 text-center">–</td>
                        <td className="px-4 py-3 text-center">{i !== 1 ? "✓" : "–"}</td>
                        <td className="px-4 py-3 text-center">–</td>
                        <td className="px-4 py-3 text-center">–</td>
                        <td className="px-4 py-3">*1/*2</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
                            <span className="size-2 rounded-full border" aria-hidden />
                            Intermediate Metabolizer
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">{i === 2 ? "2.0" : "1.5"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={goNext}
                  className="border rounded-full px-4 py-2 text-sm"
                  disabled={!selectedReport}
                >
                  Continue to Phenotype →
                </button>
              </div>
            </div>
          )}

          {active === 3 && (
            <div className="border rounded-xl p-4 flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Phenotype Classification</h2>

              {/* activity bar */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Activity Score</span>
                  <span>1.50 of 3.00</span>
                </div>
                <div className="h-2 rounded-full border overflow-hidden">
                  <div className="h-full w-3/4 border" />
                </div>
              </div>

              {/* confidence bar */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Confidence</span>
                  <span>High</span>
                </div>
                <div className="h-2 rounded-full border overflow-hidden">
                  <div className="h-full w-10/12 border" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm">Evidence Level: A</span>
                <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                  Intermediate
                </span>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={goNext}
                  className="border rounded-full px-4 py-2 text-sm"
                  disabled={!selectedReport}
                >
                  Continue to Recommendations
                </button>
              </div>
            </div>
          )}

          {active === 4 && (
            <div className="border rounded-xl p-4 flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Quality Review</h2>
              <p className="text-sm">Validate sequencing quality metrics before finalizing recommendations.</p>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="size-2 rounded-full border" />
                  <div className="flex flex-col">
                    <span>Coverage ≥ 100x</span>
                    <span className="text-xs">≥ 100x required</span>
                  </div>
                  <span className="ml-auto text-sm">150x</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="size-2 rounded-full border" />
                  <div className="flex flex-col">
                    <span>Allele balance</span>
                    <span className="text-xs">≥ 40% required</span>
                  </div>
                  <span className="ml-auto text-sm">48%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="size-2 rounded-full border" />
                  <div className="flex flex-col">
                    <span>Quality Score ≥ 90</span>
                    <span className="text-xs">≥ 90 required</span>
                  </div>
                  <span className="ml-auto text-sm">92</span>
                </div>
              </div>

              <button className="border rounded-full px-4 py-2 text-sm self-stretch">Validate Quality Metrics</button>

              <div className="border-t pt-4 flex gap-3">
                <div className="flex-1 flex flex-col gap-1">
                  <h3 className="font-medium">Approval</h3>
                  <p className="text-sm">Review and approve this interpretation.</p>
                </div>
                <div className="flex gap-2">
                  <button className="border rounded-full px-4 py-2 text-sm">Request Review</button>
                  <button className="border rounded-full px-4 py-2 text-sm" onClick={goNext} disabled={!selectedReport}>
                    Approve &amp; Continue to Export
                  </button>
                </div>
              </div>
            </div>
          )}

          {active === 5 && (
            <div className="border rounded-xl p-4 flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Approval</h2>
              <p className="text-sm">Review and approve this interpretation.</p>
              <div className="flex gap-3">
                <button className="border rounded-full px-4 py-2 text-sm">Request Review</button>
                <button className="border rounded-full px-4 py-2 text-sm" onClick={goNext} disabled={!selectedReport}>
                  Approve &amp; Continue to Export
                </button>
              </div>
            </div>
          )}

          {active === 6 && (
            <div className="border rounded-xl p-4 flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Export PDF Report</h2>

              <div className="border rounded-xl p-4 flex flex-wrap gap-6">
                <div className="flex-1 min-w-[14rem]">
                  <h3 className="font-medium">Report Summary</h3>
                  <div className="mt-2 text-sm space-y-1">
                    <div>
                      Patient:
                      <br />
                      {selectedReport ? selectedReport.patient : "-"}
                    </div>
                    <div>
                      Test Type:
                      <br />
                      Pharmacogenomics Panel
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-[14rem]">
                  <div className="mt-6 text-sm space-y-1">
                    <div>
                      Report Number:
                      <br />
                      {selectedReport ? selectedReport.report_no : "-"}
                    </div>
                    <div>
                      Status:
                      <br />
                      Ready for Export
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-sm">Export Options</h3>
                {[
                  "Include patient demographics",
                  "Include raw data summary",
                  "Include genotype results",
                  "Include phenotype classification",
                  "Include drug recommendations",
                  "Include quality metrics",
                ].map((item) => (
                  <label key={item} className="flex items-center gap-3 text-sm">
                    <input type="checkbox" defaultChecked className="size-4" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="border rounded-full px-4 py-2 text-sm">Preview Report</button>
                <button className="border rounded-full px-4 py-2 text-sm">Download PDF</button>
                <button className="border rounded-full px-4 py-2 text-sm">Email Report</button>
              </div>
            </div>
          )}
        </section>

        {/* footer nav buttons */}
        <footer className="px-6 py-4  flex items-center justify-between gap-3">
          <button onClick={goPrev} disabled={active === 0} className="border rounded-full px-4 py-2 text-sm disabled:opacity-50">
            Back
          </button>
          <div className="flex gap-2">
            <button className="border rounded-full px-4 py-2 text-sm">Save Draft</button>
            <button
              onClick={goNext}
              disabled={active > 0 && !selectedReport}
              className="border rounded-full px-4 py-2 text-sm disabled:opacity-50"
            >
              {active < STEPS.length - 1 ? "Next" : "Finish"}
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* ---------- helper components in-file ---------- */

function NavItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={[
        "w-12 md:w-14 aspect-square rounded-full flex flex-col items-center justify-center gap-1 border",
        active ? "ring-1" : "",
      ].join(" ")}
      type="button"
    >
      <span className="size-4 border rounded" aria-hidden />
      <span className="text-[10px] leading-none hidden md:block">{label}</span>
    </button>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[7.5rem]">
      <div className="text-xs">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-xl p-4 flex flex-col gap-1">
      <div className="text-sm">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
