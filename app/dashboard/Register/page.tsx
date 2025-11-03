"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import '@/app/globals.css' ;
import '@/app/style/register.css' ;

type Patient = {
    id: string;
    nameTh: string;
    nameEn: string;
    hn: string;
    rn: string;
    sex: "M" | "F";
    age: number;
};
const PATIENTS: Patient[] = [
    { id: "p1", nameTh: "สมชาย จันดี",  nameEn: "Somchai Jundee", hn: "HN012345", rn: "RN2024-0001", sex: "M", age: 36 },
    { id: "p2", nameTh: "มนอง ศรีสุข",  nameEn: "Kanda Srisuk",   hn: "HN067654", rn: "RN2024-0002", sex: "F", age: 48 },
    { id: "p3", nameTh: "ณัฐพล วิทยา", nameEn: "Nattapon Witya", hn: "HN065511", rn: "RN2024-0003", sex: "M", age: 25 },
];

export default function RegisterSingleFile() {
    const router = useRouter();

    const sp = useSearchParams();

    const currentId = sp.get("id") ?? null;      

    const currentStep = sp.get("step") ?? (currentId ? "2" : "1");

    const [barcodeText, setBarcodeText] = useState<string>("");
    const [barcodeSvg, setBarcodeSvg] = useState<string>("");

    const selectedPatient = useMemo<Patient | null>(() => {
        if (!currentId) return null;
        return PATIENTS.find(p => p.id === currentId) ?? null;
    }, [currentId]);

    const [q, setQ] = useState("");

    const [selected, setSelected] = useState<Patient | null>(null);

    const [detailsSaved, setDetailsSaved] = useState(false);

    const [selectedPriority, setSelectedPriority] = useState("Routine");
    const priority = [ "Routine", "Urgent", "STAT" ];

    const canGoStep2 = !!(selected?.id || selectedPatient?.id);
    const canGoStep3 = detailsSaved;

    const filtered = useMemo(() => {
        const t = q.trim().toLowerCase();
            if (!t) return PATIENTS;
            return PATIENTS.filter(p =>
                (p.nameTh + " " + p.nameEn + " " + p.hn + " " + p.rn).toLowerCase().includes(t)
            );
    }, [q]);

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
            const id = selected?.id ?? selectedPatient!.id;
            url.searchParams.set("id", id);
            url.searchParams.delete("step");
            router.push(url.pathname + "?" + url.searchParams.toString());
            return;
        }
        if (n === 3) {
            if (!canGoStep3) return;
            const id = selected?.id ?? selectedPatient!.id;
            url.searchParams.set("id", id);
            url.searchParams.set("step", "3");
            router.push(url.pathname + "?" + url.searchParams.toString());
            return;
        }
    };

    
    const handleContinue = () => {
        if (!selected) return;
        const url = new URL(window.location.href);
        url.searchParams.set("id", selected.id); // → ?id=p1
        router.push(url.pathname + "?" + url.searchParams.toString());
    };

    function toDatetimeLocal(d: Date = new Date()) {
        const pad = (n: number) => String(n).padStart(2, "0");
        const yyyy = d.getFullYear();
        const mm   = pad(d.getMonth() + 1);
        const dd   = pad(d.getDate());
        const hh   = pad(d.getHours());
        const mi   = pad(d.getMinutes());
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    }

    function rand(n: number) {
        return Math.floor(Math.random() * n);
    }

    function genId() {
        // ตัวอย่าง LAB-258919-U2N571 style
        const num = String(100000 + rand(900000));
        const tail = Math.random().toString(36).slice(2, 8).toUpperCase();
        return `LAB-${num}-${tail}`;
    }

    function makeBarcodeSVG(text: string) {
        // แฮชง่ายๆ
        let h = 0;
        for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;

        const bars: string[] = [];
        const W = 240, H = 120, x0 = 10, y0 = 12, y1 = 100;
        let x = x0;
        // สร้างแท่ง 80 แท่งแบบ pseudo-random
        for (let i = 0; i < 80; i++) {
            const bit = (h >> (i % 31)) & 1;
            const w = bit ? 3 : 1;              // กว้างหนา/บาง
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

    function handleGenerate() {
        const id = genId();
        setBarcodeText(id);
        setBarcodeSvg(makeBarcodeSVG(id));
    }

    function handlePrint() {
        // พิมพ์เฉพาะกรอบพรีวิว
        const w = window.open("", "_blank");
        if (!w) return;
        const html = `
        <html><head><title>Print Label</title>
        <style>
            @page { margin: 8mm; }
            body{ background:#fff; }
        </style>
        </head><body>${barcodeSvg || makeBarcodeSVG(barcodeText || genId())}</body></html>`;
        w.document.write(html);
        w.document.close();
        w.focus();
        w.print();
        w.close();
    }

    function handleRegisterSample() {
        // ตรงนี้ต่อกับ backend ได้เลย—ตอนนี้ mock
        alert(`Registered sample for ${selectedPatient?.hn ?? selected?.hn ?? "(unknown)"} with ${barcodeText || "(no barcode)"}`);
    }
return (
    <div className="container">
        <div className="title-1">Sample Registration</div>
        <div className="title-2">Search patient, enter sample details, and generate barcode labels. All designed with Material 3 patterns.</div>
        <div className="tabs">
            <button
                className={`step ${currentStep === "1" ? "active" : ""}`}
                onClick={() => goTab(1)}
            >
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
                <span className="label">Sample Details</span>
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

        {currentStep === "1" && (
            <div className="Patient">
                <div className="topic-1-3-l">
                    <div className="row-top">
                        <div className="box-title">Patient Search</div>
                        <button className="add-btn">Add New Patient</button>
                    </div>

                    <div className="row-search">
                        <input
                            className="search-input"
                            placeholder="Search by HN, RN, name, or scan barcode"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                        <button className="scan-btn">Scan</button>
                    </div>
                <div className="help-text">Supports HN/RN/Name. Try: HN012345</div>

                <div style={{ display: "grid", gap: 12 }}>
                    {filtered.map(p => (
                        <div key={p.id} className="patient-card">
                        <div className="patient-info">
                            <p className="patient-name">{p.nameTh} ({p.nameEn})</p>
                            <p className="patient-detail">HN: {p.hn} • RN: {p.rn} • {p.sex} • {p.age}y</p>
                        </div>
                            <button
                                className="select-btn"
                                onClick={() => setSelected(p)}>
                                    Select
                            </button>
                        </div>
                    ))}
                </div>
                </div>

                <div className="topic-1-3-r">
                    <div className="sel-title">Selected Patient</div>

                {!selected ? (
                    <div className="sel-empty">No patient selected.</div>
                ) : (
                <>
                    <div className="sel-name">{selected.nameTh} ({selected.nameEn})</div>
                    <div className="sel-line" />
                    <div className="sel-rows">
                        <div className="sel-row"><span>HN:</span>{selected.hn}</div>
                        <div className="sel-row"><span>RN:</span>{selected.rn}</div>
                        <div className="sel-row"><span>Sex:</span>{selected.sex}</div>
                        <div className="sel-row"><span>Age:</span>{selected.age}y</div>
                    </div>

                    <button className="continue-btn" onClick={handleContinue}>
                        Continue to Sample Details
                    </button>
                </>
                )}
                </div>
            </div>
        )}
        {currentStep === "2" && (
            <div className="Sample-Detail">
                <div className="row">
                    <div className="field">
                        <div className="main-topic">Sample Type</div>
                            <div className="select-type">
                                <select className="select-trigger">
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
                                    defaultValue={toDatetimeLocal()}
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
                                    >{p}
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
                                />
                                <div className="under-topic">Name of the examining physician.</div>
                            </div>
                    </div>
                </div>
                <div className="row">
                    <div className="field">
                        <div className="main-topic">Test Panels</div>
                        <div className="select-type">
                            <select className="select-trigger">
                                <option value="PGx Panel">PGx Panel</option>
                                <option value="CYP2D6">CYP2D6</option>
                                <option value="CYP2C19">CYP2C19</option>
                                <option value="UGT1A1">UGT1A1</option>
                                <option value="TPMT/NUDT15">TPMT/NUDT15</option>
                                <option value="ABCB1">ABCB1</option>
                                <option value="BRCA1/2">BRCA1/2</option>
                                <option value="HLA-B*57:01">HLA-B*57:01</option>
                                <option value="HLA-B*15:02">HLA-B*15:02</option>
                                <option value="Thalassemia">Thalassemia</option>
                                <option value="CFTR">CFTR</option>
                                <option value="Factor V Leiden">Factor V Leiden</option>
                                <option value="MTHFR">MTHFR</option>
                                <option value="DPYD">DPYD</option>
                                <option value="Whole Exome">Whole Exome</option>
                            </select>
                        </div>
                        <div className="under-topic">Choose one panel. Swipe/scroll horizontally to explore options.</div>
                    </div>
                    <div className="field">
                        <div className="main-topic">Ward</div>
                        <div className="textarea-type">
                            <textarea
                                className="textarea-oneline"
                                placeholder="Enter ward/department"
                                rows={1}
                            />
                        <div className="under-topic">Patient location or department.</div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="field">
                        <div className="main-topic">Clinical Notes</div>
                        <div className="textarea-type">
                            <textarea
                                className="textarea-trigger"
                                placeholder="Special handling, storage, or clinical indications"
                                rows={1}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <div className="main-topic">Contact Number</div>
                        <div className="textarea-type">
                            <textarea
                                className="textarea-oneline"
                                placeholder="Enter contact number"
                                rows={1}
                            />
                            <div className="under-topic">Phone number for follow-up.</div>
                        </div>
                    </div>
                </div>
                <div className="sample-submit">
                    <button 
                        onClick={() => {
                            const id = selected?.id ?? selectedPatient?.id;
                            if (!id) return;
                            setDetailsSaved(true); // ✔️ ผ่านด่าน 2 แล้ว
                            const url = new URL(window.location.href);
                            url.searchParams.set("id", id);
                            url.searchParams.set("step", "3");
                            url.searchParams.set("ok2", "1"); 
                            router.push(url.pathname + "?" + url.searchParams.toString());
                        }}
                    >
                        Save Sample Details
                    </button>
                </div>
            </div>
        )}

        {currentStep === "3" && (
            <div className="Barcodes">
                <div className="bc-left">
                    <div className="bc-title">Barcode Preview</div>

                    <div className="bc-canvas">
                        {barcodeSvg ? (
                        <div
                            className="bc-svg"
                            dangerouslySetInnerHTML={{ __html: barcodeSvg }}
                        />
                        ) : (
                        <div className="bc-placeholder">No barcode yet</div>
                        )}
                    </div>

                    <button className="bc-generate" onClick={handleGenerate}>
                        Generate Barcode
                    </button>
                </div>

                <div className="bc-right">
                    <div className="bc-panel-title">Label Details</div>

                    <div className="bc-rows">
                        <div className="bc-row"><span>Lab Number</span><b>Pending</b></div>
                        <div className="bc-row"><span>Hospital Number</span><b>{selectedPatient?.hn ?? selected?.hn ?? "—"}</b></div>
                        <div className="bc-row"><span>Priority</span><b>{selectedPriority.toUpperCase()}</b></div>
                    </div>

                    <p className="bc-note">
                        This is a visual preview and supports printing via the browsers print dialog.
                    </p>

                    <div className="bc-actions">
                        <button className="bc-print" onClick={handlePrint}>Print Label</button>
                        <button className="bc-register" onClick={handleRegisterSample}>Register Sample</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
