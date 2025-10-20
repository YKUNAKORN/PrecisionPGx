"use client";
import { useState } from "react";
import '@/app/globals.css' ;
import '@/app/style/register.css' ;

type Patient = {
  nameTh: string;
  nameEn: string;
  hn: string;
  rn: string;
  sex: "M" | "F";
  age: number;
};

export default function Register(){

    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    function handleSelect(p: Patient) {
    setSelectedPatient(p);
    }
    
    const [activeTab, setActiveTab] = useState(0);
    const tabs = [
        { id: 0, label: "1. Patient" },
        { id: 1, label: "2. Sample Details" },
        { id: 2, label: "3. Barcode & Label" },
    ];

    function toDatetimeLocal(d: Date = new Date()) {
        const pad = (n: number) => String(n).padStart(2, "0");
        const yyyy = d.getFullYear();
        const mm   = pad(d.getMonth() + 1);
        const dd   = pad(d.getDate());
        const hh   = pad(d.getHours());
        const mi   = pad(d.getMinutes());
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    }

    const [selectedPriority, setSelectedPriority] = useState("Routine");
    const priority = [
        "Routine", "Urgent", "STAT" 
    
    
    ]
    return(
        <div>

            <div className = 'title-1'>Sample Registration</div>
            <div className = 'title-2'>Search patient, enter sample details, and generate barcode labels. All designed with Material 3 patterns.</div>
            
            <div className="container">
                    <div className="tabs">
                        {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tab ${activeTab === tab.id ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                        ))}
                    </div>
                <div>
                        {activeTab === 0 && (
                            <div className="Patient">
                                <div className="topic-1-3-l">
                                    <div className="row-top">
                                        <span className="box-title">Patient Search</span>
                                        <button className="add-btn">Add New Patient</button>
                                    </div>
                                    <div className="row-search">
                                        <input
                                            className="search-input"
                                            placeholder="Search by HN, RN, name, or scan barcode"
                                        />
                                        <button className="scan-btn">Scan</button>
                                    </div>

                                    <p className="help-text">Supports HN/RN/Name. Try: HN012345</p>
                                    
                                    <div className="patient-card">
                                        <div className="patient-info">
                                            <p className="patient-name">สมชาย จันดี (Somchai Jundee)</p>
                                            <p className="patient-detail">
                                            HN: HN012345 • RN: RN2024-0001 • M • 36y
                                            </p>
                                        </div>
                                        <button
                                            className="select-btn"
                                            onClick={() =>
                                                handleSelect({
                                                nameTh: "สมชาย จันดี",
                                                nameEn: "Somchai Jundee",
                                                hn: "HN012345",
                                                rn: "RN2024-0001",
                                                sex: "M",
                                                age: 36,
                                                })
                                            }
                                            >   Select
                                        </button>
                                    </div>

                                    <div className="patient-card">
                                        <div className="patient-info">
                                            <p className="patient-name">มนอง ศรีสุข (Kanda Srisuk)</p>
                                            <p className="patient-detail">
                                            HN: HN067654 • RN: RN2024-0002 • F • 48y
                                            </p>
                                        </div>
                                        <button
                                            className="select-btn"
                                            onClick={() =>
                                                handleSelect({
                                                nameTh: "มนอง ศรีสุข",
                                                nameEn: "Kanda Srisuk",
                                                hn: "HN067654",
                                                rn: "RN2024-0002",
                                                sex: "F",
                                                age: 48,
                                                })
                                            }
                                            >Select
                                        </button>
                                    </div>

                                    <div className="patient-card">
                                        <div className="patient-info">
                                            <p className="patient-name">ณัฐพล วิทยา (Nattapon Witya)</p>
                                            <p className="patient-detail">
                                            HN: HN065511 • RN: RN2024-0003 • M • 25y
                                            </p>
                                        </div>
                                        <button
                                            className="select-btn"
                                            onClick={() =>
                                                handleSelect({
                                                nameTh: "ณัฐพล วิทยา",
                                                nameEn: "Nattapon Witya",
                                                hn: "HN065511",
                                                rn: "RN2024-0003",
                                                sex: "M",
                                                age: 25,
                                                })
                                            }
                                            >Select
                                        </button>
                                    </div>

                                </div>
                                
                                <div className="topic-1-3-r">
                                    <div className="sel-title">Selected Patient</div>

                                    {!selectedPatient ? (
                                        <p className="sel-empty">No patient selected.</p>
                                    ) : (
                                    <>
                                        <div className="sel-name">
                                            {selectedPatient.nameTh} ({selectedPatient.nameEn})
                                        </div>
                                            <div className="sel-line" />
                                            <div className="sel-rows">
                                                <div className="sel-row"><span>HN:</span> {selectedPatient.hn}</div>
                                                <div className="sel-row"><span>RN:</span> {selectedPatient.rn}</div>
                                                <div className="sel-row">
                                                <span>Sex / Age:</span> {selectedPatient.sex} • {selectedPatient.age}y
                                            </div>
                                        </div>

                                        <button className="continue-btn">
                                            Continue to Sample Details
                                        </button>
                                    </>
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === 1 && 
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
                                    <button>Save Sample Details</button>
                                </div>
                            </div>}
                        {activeTab === 2 && 
                            <div className="Patient">
                                <div className="topic-1-3-l">Barcode Preview</div>
                                <div className="topic-1-3-r">Label Details</div>
                            </div>
                        }
                </div>
            </div>
        </div>
    );
}