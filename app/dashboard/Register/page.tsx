"use client";

import { useMemo, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ✅ ใช้บริการจากไฟล์ที่มีอยู่
import { createPatientQueryOptions } from "../../../lib/fetch/Patient"; // ดึงรายชื่อผู้ป่วย
import { mutateSpecimenQueryOptions } from "../../../lib/fetch/Specimen"; // POST /api/user/specimen  -> { name, expire_in }
import { mutateStorageQueryOptions } from "../../../lib/fetch/Storage";   // POST /api/user/storage   -> { patient_id, location, specimen_id, status }
import createBarcodeQueryOptions from "../../../lib/fetch/Barcode"; // ดึง barcode/labNumber จาก backend (ถ้ามี)
import type { Patient as PatientBase, Specimen as SpecimenType, Storage as StorageType } from "../../../lib/fetch/type";

import "@/app/globals.css";
import "@/app/style/register.css";

// ถ้า Patient ใน type.ts ยังไม่มี id ให้ใช้ส่วนขยายนี้
type PatientWithId = PatientBase & { id: string };

export default function Page() {
    const router = useRouter();
    const sp = useSearchParams();

    const currentId = sp.get("id") ?? "";
    const currentStep = sp.get("step") ?? (currentId ? "2" : "1");

    // -----------------------------
    // Patients
    // -----------------------------
    const {
        data: patients,
        isLoading: loadingPatients,
        error: errorPatients,
    } = useQuery(createPatientQueryOptions.all());

    const { data: patientDetail } = useQuery({
        ...createPatientQueryOptions.detail(currentId ?? ""),
        enabled: !!currentId,
    });


    // -----------------------------
    // Barcode (manual refetch)
    // -----------------------------



    const patientDetailEntity = useMemo(() => {
        const raw = patientDetail as any;
        return raw && typeof raw === "object" && "data" in raw ? (raw.data as PatientWithId) : (raw as PatientWithId | null);
    }, [patientDetail]);
    // -----------------------------
    // Local states
    // -----------------------------
    const [q, setQ] = useState("");
    const [selected, setSelected] = useState<PatientWithId | null>(null);

    const [barcodeText, setBarcodeText] = useState<string>("");
    const [barcodeSvg, setBarcodeSvg] = useState<string>("");

    const [detailsSaved, setDetailsSaved] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState<"Routine" | "Urgent" | "STAT">("Routine");
    const priority: Array<"Routine" | "Urgent" | "STAT"> = ["Routine", "Urgent", "STAT"];

    // Step 2 form
    const [sampleType, setSampleType] = useState<"blood" | "saliva" | "tissue" | "buccal">("blood");
    const [collectedAt, setCollectedAt] = useState<string>(() => toDatetimeLocal());
    const [doctor, setDoctor] = useState("");
    const [ward, setWard] = useState("");
    const [notes, setNotes] = useState("");
    const [contact, setContact] = useState("");

    const activePatient = (selected ?? patientDetailEntity) || null;

    const canGoStep2 = !!activePatient?.id;
    const canGoStep3 = detailsSaved;


    const barcodeQuery = createBarcodeQueryOptions(activePatient?.id || "");
const { refetch: refetchBarcode, isFetching: fetchingBarcode } = useQuery({
  ...barcodeQuery,
  enabled: false, // manual refetch
});
    const patientList: PatientWithId[] = useMemo(() => {
        // patients อาจเป็น Array หรือเป็น { data: [...] }
        const raw = patients as any;
        const arr = Array.isArray(raw) ? raw : raw?.data;
        return Array.isArray(arr) ? (arr as PatientWithId[]) : [];
    }, [patients]);

    const filtered = useMemo(() => {
        const t = q.trim().toLowerCase();
        if (!t) return patientList;
        return patientList.filter((p) =>
            `${p.name} ${p.phone ?? ""} ${p.gender ?? ""} ${p.Ethnicity ?? ""}`
                .toLowerCase()
                .includes(t)
        );
    }, [patientList, q]);



    // -----------------------------
    // Mutations
    // -----------------------------
    const qc = useQueryClient();

    const createSpecimen = useMutation(mutateSpecimenQueryOptions.post());

    const createStorage = useMutation(mutateStorageQueryOptions.post());

    // -----------------------------
    // Actions
    // -----------------------------
    const goTab = (n: number) => {
        const url = new URL(window.location.href);
        if (n === 1) {
            url.searchParams.delete("id");
            url.searchParams.delete("step");
            router.replace(url.pathname);
            return;
        }
        if (n === 2) {
            if (!canGoStep2) return;
            url.searchParams.set("id", activePatient!.id);
            url.searchParams.delete("step");
            router.push(`${url.pathname}?${url.searchParams.toString()}`);
            return;
        }
        if (n === 3) {
            if (!canGoStep3) return;
            url.searchParams.set("id", activePatient!.id);
            url.searchParams.set("step", "3");
            router.push(`${url.pathname}?${url.searchParams.toString()}`);
            return;
        }
    };

    const handleContinue = () => {
        if (!selected) return;
        const url = new URL(window.location.href);
        url.searchParams.set("id", selected.id);
        router.push(`${url.pathname}?${url.searchParams.toString()}`);
    };

    const handleGenerateLocal = () => {
        const id = genId();
        setBarcodeText(id);
        setBarcodeSvg(makeBarcodeSVG(id));
    };

    const handlePrint = () => {
        const w = window.open("", "_blank");
        if (!w) return;
        const html = `
      <html><head><title>Print Label</title>
      <style>@page { margin: 8mm; } body{ background:#fff; }</style>
      </head><body>${barcodeSvg || makeBarcodeSVG(barcodeText || genId())}</body></html>`;
        w.document.write(html);
        w.document.close();
        w.focus();
        w.print();
        w.close();
    };

    // -----------------------------
    // Save Step 2 = fetch barcode (optional) -> POST specimen -> POST storage -> Step 3
    // -----------------------------
    const handleSaveSample = async () => {
        if (!activePatient?.id) return;

        // 1) ขอ barcode จาก backend ถ้ายังไม่มี (fallback gen local)
        let lab = barcodeText;
        if (!lab) {
            try {
                const res = await refetchBarcode();
                const d: any = res.data;
                lab = d?.code ?? d?.labNumber ?? (typeof d === "string" ? d : "");
            } catch {
                lab = genId();
            }
            if (!lab) lab = genId();
            setBarcodeText(lab);
            setBarcodeSvg(makeBarcodeSVG(lab));
        }

        // 2) POST /api/user/specimen  -> { name, expire_in }
        //    ใช้วันที่เก็บเป็น expire_in (ถ้าต้องการ logic อื่น เปลี่ยนที่นี่ได้)

        const specimenDTO = { name: sampleType, expire_in: 2 };

        try {
            const createdSpecimen: any = await createSpecimen.mutateAsync(specimenDTO);

            // พยายามอ่าน id จากหลายรูปแบบ response
            const specimenId =
                createdSpecimen?.data[0]?.id ??
                createdSpecimen?.id ??
                createdSpecimen?.data[0]?.specimen_id;

            if (!specimenId) {
                alert("Specimen created but no id returned from API");
                return;
            }

            // 3) POST /api/user/storage -> { patient_id, location, specimen_id, status }
            const storageDTO = {
                patient_id: activePatient.id,
                location: "Freezer-A",  // TODO: ทำ input ให้ผู้ใช้เลือกเองได้
                specimen_id: specimenId,
                status: "stored",
            };
            await createStorage.mutateAsync(storageDTO);

            // 4) ไป Step 3
            setDetailsSaved(true);
            const url = new URL(window.location.href);
            url.searchParams.set("id", activePatient.id);
            url.searchParams.set("step", "3");
            url.searchParams.set("ok2", "1");
            router.push(`${url.pathname}?${url.searchParams.toString()}`);
        } catch (e) {
            alert(`Cannot register sample: ${(e as Error).message}`);
        }
    };

    const [openAdd, setOpenAdd] = useState(false);

    const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpenAdd(false);
    };
    const dialogRef = useRef<HTMLDivElement>(null);

    if (errorPatients) return <div className="container">Failed to load patients.</div>;

    // -----------------------------
    // UI
    // -----------------------------
    return (
        <div className="container">
            <div className="title-1">Sample Registration</div>
            <div className="title-2">
                Search patient, enter sample details, and generate barcode labels. All designed with Material 3 patterns.
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button className={`step ${currentStep === "1" ? "active" : ""}`} onClick={() => goTab(1)}>
                    <span className="dot">1</span>
                    <span className="label">Patient</span>
                </button>

                <span className="sep" />

                <button
                    className={`step ${currentStep === "2" ? "active" : ""} ${!canGoStep2 ? "disabled" : ""}`}
                    onClick={() => goTab(2)}
                    disabled={!canGoStep2}
                >
                    <span className="dot">2</span>
                    <span className="label">
                        Sample Details {fetchingBarcode ? "(getting barcode…)" : ""}
                    </span>
                </button>

                <span className="sep" />

                <button
                    className={`step ${currentStep === "3" ? "active" : ""} ${!canGoStep3 ? "disabled" : ""}`}
                    onClick={() => goTab(3)}
                    disabled={!canGoStep3}
                >
                    <span className="dot">3</span>
                    <span className="label">Barcode &amp; Label</span>
                </button>
            </div>

            {/* STEP 1 */}
            {currentStep === "1" && (
                <div className="Patient">
                    <div className="topic-1-3-l">
                        <div className="row-top">
                            <div className="box-title">Patient Search</div>
                            <button className="add-btn" onClick={() => setOpenAdd(true)}>
                                Add New Patient
                            </button>
                        </div>

                        <div className="row-search">
                            <input
                                className="search-input"
                                placeholder="Search by name / phone / gender / ethnicity"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />
                            <button className="scan-btn">Scan</button>
                        </div>

                        <div className="help-text">Supports Name / Phone / Gender / Ethnicity.</div>

                        {loadingPatients ? (
                            <div style={{ padding: 12 }}>Loading patients…</div>
                        ) : (
                            <div style={{ display: "grid", gap: 12 }}>
                                {filtered.map((p) => (
                                    <div key={p.id} className="patient-card">
                                        <div className="patient-info">
                                            <p className="patient-name">{p.name}</p>
                                            <p className="patient-detail">
                                                Phone: {p.phone ?? "—"} • Gender: {p.gender ?? "—"} • Age: {p.age ?? "—"} • Ethnicity: {p.Ethnicity ?? "—"}
                                            </p>
                                        </div>
                                        <button className="select-btn" onClick={() => setSelected(p)}>Select</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="topic-1-3-r">
                        <div className="sel-title">Selected Patient</div>

                        {!activePatient ? (
                            <div className="sel-empty">No patient selected.</div>
                        ) : (
                            <>
                                <div className="sel-name">{activePatient.name}</div>
                                <div className="sel-line" />
                                <div className="sel-rows">
                                    <div className="sel-row"><span>Phone:</span>{activePatient.phone ?? "—"}</div>
                                    <div className="sel-row"><span>Gender:</span>{activePatient.gender ?? "—"}</div>
                                    <div className="sel-row"><span>Age:</span>{activePatient.age ?? "—"}y</div>
                                    <div className="sel-row"><span>Ethnicity:</span>{activePatient.Ethnicity ?? "—"}</div>
                                </div>

                                {!currentId && (
                                    <button className="continue-btn" onClick={handleContinue}>
                                        Continue to Sample Details
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 2 */}
            {currentStep === "2" && (
                <div className="Sample-Detail">
                    <div className="row">
                        <div className="field">
                            <div className="main-topic">Sample Type</div>
                            <div className="select-type">
                                <select className="select-trigger" value={sampleType} onChange={(e) => setSampleType(e.target.value as any)}>
                                    <option value="blood">Blood</option>
                                    <option value="saliva">Saliva</option>
                                    <option value="tissue">Tissue</option>
                                    <option value="buccal">Buccal Swab</option>
                                </select>
                            </div>
                            <div className="under-topic">Choose specimen type.</div>
                        </div>
                        <div className="field">
                            <div className="main-topic">Collection Date/Time</div>
                            <div className="date-type">
                                <input
                                    type="datetime-local"
                                    className="date-trigger"
                                    value={collectedAt}
                                    onChange={(e) => setCollectedAt(e.target.value)}
                                />
                            </div>
                            <div className="under-topic">Record collection timestamp.</div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="field">
                            <div className="main-topic">Priority</div>
                            <div className="priority-group">
                                {priority.map((p) => (
                                    <button
                                        key={p}
                                        className={`priority-btn ${p} ${selectedPriority === p ? "active" : ""}`}
                                        onClick={() => setSelectedPriority(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <div className="under-topic">Set processing priority.</div>
                        </div>

                        <div className="field">
                            <div className="main-topic">Examining Doctor</div>
                            <div className="textarea-type">
                                <textarea
                                    className="textarea-oneline"
                                    placeholder="Enter doctor's name"
                                    rows={1}
                                    value={doctor}
                                    onChange={(e) => setDoctor(e.target.value)}
                                />
                                <div className="under-topic">Name of the examining physician.</div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="field">
                            <div className="main-topic">Ward</div>
                            <div className="textarea-type">
                                <textarea
                                    className="textarea-oneline"
                                    placeholder="Enter ward/department"
                                    rows={1}
                                    value={ward}
                                    onChange={(e) => setWard(e.target.value)}
                                />
                                <div className="under-topic">Patient location or department.</div>
                            </div>
                        </div>

                        <div className="field">
                            <div className="main-topic">Clinical Notes</div>
                            <div className="textarea-type">
                                <textarea
                                    className="textarea-trigger"
                                    placeholder="Special handling, storage, or clinical indications"
                                    rows={1}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="field">
                            <div className="main-topic">Contact Number</div>
                            <div className="textarea-type">
                                <textarea
                                    className="textarea-oneline"
                                    placeholder="Enter contact number"
                                    rows={1}
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                />
                                <div className="under-topic">Phone number for follow-up.</div>
                            </div>
                        </div>
                    </div>

                    <div className="sample-submit">
                        <button
                            disabled={fetchingBarcode || createSpecimen.isPending || createStorage.isPending || !activePatient?.id}
                            onClick={handleSaveSample}
                        >
                            {fetchingBarcode || createSpecimen.isPending || createStorage.isPending ? "Saving…" : "Save Sample Details"}
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3 */}
             <div>
            {/* STEP 3 */}
            {currentStep === "3" && (
                <div className="Barcodes">
                <div className="bc-left">
                    <div className="bc-title">Barcode Preview</div>
                    <div className="bc-canvas">
                    {barcodeSvg ? (
                        <div
                        className="bc-svg"
                        // แสดง SVG ที่สร้างจาก JsBarcode
                        dangerouslySetInnerHTML={{ __html: barcodeSvg }}
                        />
                    ) : (
                        <div className="bc-placeholder">No barcode yet</div>
                    )}
                    </div>
                    <button className="bc-generate" onClick={handleGenerateLocal}>
                    Generate Barcode (Local)
                    </button>
                </div>

                <div className="bc-right">
                    <div className="bc-panel-title">Label Details</div>
                    <div className="bc-rows">
                    <div className="bc-row">
                        <span>Lab Number</span>
                        <b>{barcodeText || "Pending"}</b>
                    </div>
                    <div className="bc-row">
                        <span>Patient</span>
                        <b>{activePatient?.name ?? "—"}</b>
                    </div>
                    <div className="bc-row">
                        <span>Priority</span>
                        <b>{selectedPriority.toUpperCase()}</b>
                    </div>
                    </div>
                    <p className="bc-note">
                    This is a visual preview and supports printing via the browser’s print dialog.
                    </p>
                    <div className="bc-actions">
                    <button className="bc-print" onClick={handlePrint}>
                        Print Label
                    </button>
                    <button
                        className="bc-register"
                        onClick={() =>
                        alert(
                            `Registered sample for ${
                            activePatient?.name ?? "(unknown)"
                            } with ${barcodeText || "(no barcode)"}`
                        )
                        }
                    >
                        Register Sample
                    </button>
                    </div>
                </div>     
            </div>
            )}
            </div>
        {openAdd && (
            <div className="modal-backdrop" onMouseDown={onBackdropClick}>
            <div
            className="modal-sheet"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-title"
            >
            <div className="modal-header">
                <div className="modal-title">
                    <span className="i-user-plus">👤</span>
                    <span id="add-title">Add New Patient</span>
                </div>
                <button className="modal-close" onClick={() => setOpenAdd(false)}>
                ✕
                </button>
            </div>

            <p className="modal-desc">
                Register a new patient in the system. All required fields must be completed.
            </p>

            <div className="modal-body">
                <div className="modal-section-title">Patient Information</div>

                <div className="grid1">
                    <label className="field">
                        <span className="label-2">Thai Name <b className="req">*</b></span>
                        <input className="input-2" placeholder="ชื่อ-นามสกุล (ภาษาไทย)" />
                    </label> 
                    <label className="field">
                        <span className="label-2">English Name <b className="req">*</b></span>
                        <input className="input-2" placeholder="First Last (English)" />
                    </label>
                </div>
                <div className="grid2">
                    <label className="field">
                        <span className="label-2">Date of Birth <b className="req">*</b></span>
                        <input className="input-2" type="date" />
                    </label>
                    <label className="field">
                        <span className="label-2">Gender <b className="req">*</b></span>
                        <div className="select-type-2">
                        <select className="select-trigger-2">
                            <option value="">Select gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                        </div>
                    </label>
                </div>

                <div className="modal-section-title">Contact Information</div>
                <div className="grid1">
                <label className="field">
                    <span className="label-2">Phone Number</span>
                    <input className="input-2" placeholder="089-123-4567" />
                </label>
                <label className="field">
                    <span className="label-2">Email Address</span>
                    <input className="input-2" type="email" placeholder="patient@example.com" />
                </label>
                <label className="field" style={{ gridColumn: "1 / -1" }}>
                    <span className="label-2">Address</span>
                    <input className="input-2" placeholder="Enter full address" />
                </label>
                <p className="auto-id-hint">
                    Automatic ID Generation: Hospital Number (HN) and Registration Number (RN)
                    will be automatically generated upon registration.
                </p>
                </div>
            </div>

            <div className="modal-footer">
                <button className="btn-ghost" onClick={() => setOpenAdd(false)}>Cancel</button>
                <button className="btn-primary" onClick={() => setOpenAdd(false)}>
                Add Patient
                </button>
            </div>
            </div>
            </div>
        )}

        
        </div>
    );
}

/* ---------- Utilities ---------- */
function toDatetimeLocal(d: Date = new Date()) {
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}
function rand(n: number) { return Math.floor(Math.random() * n); }
function genId() {
    const num = String(100000 + rand(900000));
    const tail = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `LAB-${num}-${tail}`;
}
function makeBarcodeSVG(text: string) {
    let h = 0;
    for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
    const bars: string[] = [];
    const W = 240, H = 120, x0 = 10, y0 = 12, y1 = 100;
    let x = x0;
    for (let i = 0; i < 80; i++) {
        const bit = (h >> (i % 31)) & 1;
        const w = bit ? 3 : 1;
        bars.push(`<rect x="${x}" y="${y0}" width="${w}" height="${y1 - y0}" fill="black"/>`);
        x += w + 1;
        if (x > W - 10) break;
    }
    const labelY = y1 + 18;
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <rect width="${W}" height="${H}" rx="6" fill="white"/>
      ${bars.join("")}
      <text x="${W / 2}" y="${labelY}" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
        font-size="16" text-anchor="middle" fill="#111">${text}</text>
    </svg>`;
}
