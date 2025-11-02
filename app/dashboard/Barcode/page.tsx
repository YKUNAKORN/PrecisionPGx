"use client";

import React, { useRef, useState } from "react";
import { CreateClientPublic } from "@/lib/supabase/client";
import { GetById } from "@/lib/supabase/crud";

type Patient = { id: string; [k: string]: any };

export default function BarcodePage() {
  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPatient(null);
    if (!patientId.trim()) {
      setError("กรุณากรอก Patient ID");
      return;
    }

    try {
      setLoading(true);

      const supabase = CreateClientPublic();
      // ถ้า GetById คืน array:
      const { data, error: err } = await GetById(supabase, "patient", patientId.trim());
      if (err) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล: " + err.message);
        return;
      }
      if (!data || data.length === 0) {
        setError("ไม่พบผู้ป่วยที่มี ID นี้");
        return;
      }

      const p: Patient = data[0];
      setPatient(p);

      const value = String(p.id ?? patientId).trim();
      if (!value) {
        setError("ค่า Patient ID ไม่ถูกต้อง");
        return;
      }

      const JsBarcode = (await import("jsbarcode")).default;

      if (svgRef.current) {
        svgRef.current.innerHTML = "";
        JsBarcode(svgRef.current, value, {
          format: "CODE128",
          displayValue: true,
          width: 2,
          height: 60,
          margin: 10,
          fontSize: 14,
        });
        svgRef.current.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgRef.current.setAttribute("role", "img");
        svgRef.current.setAttribute("aria-label", `Barcode for ${value}`);
      }
    } catch (ex: any) {
      console.error(ex);
      setError("เกิดข้อผิดพลาด: " + (ex?.message || ex));
    } finally {
      setLoading(false);
    }
  }

  function handleDownloadSvg() {
    if (!svgRef.current) return;
    const svg = svgRef.current.outerHTML;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `barcode-${(patient?.id || patientId || "patient").toString()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const hasBarcode = !!svgRef.current && !!svgRef.current.innerHTML;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">สร้าง Barcode จาก Patient ID</h1>

      <form onSubmit={handleGenerate} className="mb-4">
        <label className="block mb-2">Patient ID</label>
        <input
          className="border px-3 py-2 w-full max-w-xs mb-2"
          value={patientId}
          onChange={(e) => {
            setPatientId(e.target.value);
            if (error) setError("");
          }}
          placeholder="ใส่ Patient ID หรือเลขที่ผู้ป่วย"
          autoComplete="off"
          inputMode="text"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "กำลังสร้าง..." : "Generate"}
          </button>
          <button
            type="button"
            onClick={handleDownloadSvg}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={!hasBarcode}
          >
            Download SVG
          </button>
        </div>
      </form>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {patient && (
        <div className="mb-4">
          <h2 className="font-medium">ข้อมูลผู้ป่วย</h2>
          <pre className="bg-gray-100 p-2 rounded mt-2 max-w-md overflow-auto">
            {JSON.stringify(patient, null, 2)}
          </pre>
        </div>
      )}

      <div className="border rounded p-4 inline-block">
        <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" />
      </div>
    </div>
  );
}
