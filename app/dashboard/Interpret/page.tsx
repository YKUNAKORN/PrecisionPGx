import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Interpret() {
  return (
    <main className="text-zinc-100">
      <div className="mx-auto p-6">
        {/* ================= Header ================= */}

        <section data-section="header" className="mb-6 ">
          <div className="h-auto w-auto font-bold text-4xl">
            {/* Subheader bar */}
            Result Interpretation
            {/* Automated genotype-to-phenotype interpretation with clinical recommendations. */}
          </div>

          <div className="mt-2 mb-2 h-auto w-fit">
            Automated genotype-to-phenotype interpretation with clinical recommendations
          </div>
        </section>

        {/* ================= Stepper ================= */}
        <section
          data-section="stepper"
          className="mb-6 flex flex-wrap items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <div className="h-10 w-10  inline-grid place-items-center rounded-full border border-dashed ">
              {" "}
              1
            </div>
            <div className="h-10 w-fit p-2 inline-flex items-center   rounded-xl border border-dashed ">
              {" "}
              Patient
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-10 w-10  inline-grid place-items-center rounded-full border border-dashed ">
              {" "}
              2
            </div>
            <div className="h-10 w-fit p-2 inline-flex items-center   rounded-xl border border-dashed ">
              Raw Data
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-10 w-10  inline-grid place-items-center rounded-full border border-dashed ">
              {" "}
              3
            </div>
            <div className="h-10 w-fit p-2 inline-flex items-center   rounded-xl border border-dashed ">
              {" "}
              Genotype
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-10 w-10  inline-grid place-items-center rounded-full border border-dashed ">
              {" "}
              4
            </div>
            <div className="h-10 w-fit p-2 inline-flex items-center   rounded-xl border border-dashed ">
              {" "}
              Phenotype
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-10 w-10  inline-grid place-items-center rounded-full border border-dashed ">
              {" "}
              5
            </div>
            <div className="h-10 w-fit p-2 inline-flex items-center   rounded-xl border border-dashed ">
              {" "}
              Recomendationm
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-10 w-10  inline-grid place-items-center rounded-full border border-dashed ">
              {" "}
              6
            </div>
            <div className="h-10 w-fit p-2 inline-flex items-center   rounded-xl border border-dashed ">
              {" "}
              Quality
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-10 w-10  inline-grid place-items-center rounded-full border border-dashed ">
              {" "}
              7
            </div>
            <div className="h-10 w-fit p-2 inline-flex items-center   rounded-xl border border-dashed ">
              {" "}
              Approval
            </div>
          </div>
        </section>

        {/* ================= Title ================= */}
        <section>
          <div className="font-bold text-2xl">Patient Reports</div>
        </section>



        {/* ================= Toolbar ================= */}
        <section
          data-section="toolbar"
          className="mb-4 flex flex-wrap items-center gap-3"
        >
          {/* <div data-element="search" className="h-10 grow rounded-xl border border-dashed " >
          </div> */}

          <div>
            <Input type="text" placeholder="Searching..." className="max-w-xs" />
          </div>

          {/* <div
            data-element="clear-all"
            className="h-10 w-48 rounded-xl border border-dashed "
          >
          </div> */}
            <Button variant="outline" className=""  >
            Clear All
            </Button>
          {/* <div
            data-element="reset-data"
            className="h-10 w-36 rounded-xl border border-dashed "
          ></div> */}
          <Button variant="outline" className="">
            Reset Data
          </Button>

        </section>

        {/* ================= Table ================= */}
        {/* <section
          data-section="table"
          className="overflow-hidden rounded-2xl border border-white/10"
        > */}
          {/* Table header */}

          {/* <div
            data-row="header"
            className="grid grid-cols-[1.2fr_1.5fr_1fr_0.8fr_auto] gap-px bg-white/10"
          >
            {["Report Number", "Patient", "Status", "IsApprove", "actions"].map(
              (key) => (
                <div key={key} className="h-12 bg-zinc-950/60" >
                  {key}
                </div>
              )
            )}
          </div> */}

          {/* Table rows */}
          <div className="rounded-xl ring-1 ring-white/10 bg-neutral-950 text-sm">
          {/* header */}
          <div className="grid grid-cols-[1.2fr_1.5fr_1fr_0.8fr_auto] items-center px-4 py-3 bg-white/5 text-zinc-300 font-medium">
            <div>Report Number</div>
            <div>Patient</div>
            <div>Status</div>
            <div>IsApprove</div>
            <div className="text-right">Actions</div>
          </div>

          {/* rows */}
          <ul className="divide-y divide-white/5">
            {/* 1 row */}
            <li className="grid grid-cols-[1.2fr_1.5fr_1fr_0.8fr_auto] items-center px-4 py-4 hover:bg-white/[0.02]">
              <div className="text-zinc-200">RPT-2025-001</div>
              <div className="text-zinc-300">John Smith</div>
              <div>
                <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-violet-600/20 text-violet-200 ring-1 ring-violet-400/30">
                  Completed
                </span>
              </div>
              <div>
                <span className="inline-block size-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <div className="flex justify-end gap-2">
                <button className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-neutral-900 px-3 py-1.5 text-xs hover:bg-neutral-800">
                  EDIT
                </button>
                <button className="rounded-lg bg-neutral-800 px-3 py-1.5 text-xs text-zinc-100 hover:bg-neutral-700">
                  Approval
                </button>
                <button className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs text-white hover:bg-violet-500">
                  Continue
                </button>
              </div>
            </li>
            {/* ทำซ้ำแถวอื่น ๆ ตามข้อมูล */}
          </ul>

          {/* footer */}
          <div className="px-4 py-3 text-xs text-zinc-400 border-t border-white/10">
            Showing 6 of 6 reports
          </div>
        </div>




      </div>
    </main>
  );
}
