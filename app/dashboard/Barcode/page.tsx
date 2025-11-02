"use client"

import React, { useRef, useState } from 'react'
import JsBarcode from 'jsbarcode'
import { CreateClientPublic } from '@/lib/supabase/client'
import { GetById } from '@/lib/supabase/crud'

export default function BarcodePage() {
  const [patientId, setPatientId] = useState('')
  const [patient, setPatient] = useState<any | null>(null)
  const [error, setError] = useState('')
  const svgRef = useRef<SVGSVGElement | null>(null)

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setPatient(null)

    if (!patientId) {
      setError('กรุณากรอก Patient ID')
      return
    }

    try {
      const supabase = CreateClientPublic()
      const { data, error: err } = await GetById(supabase, 'patient', patientId)
      if (err) {
        setError('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + err.message)
        return
      }

      if (!data || data.length === 0) {
        setError('ไม่พบผู้ป่วยที่มี ID นี้')
        return
      }

      const p = data[0]
      setPatient(p)

      const value = String(p.id ?? patientId)

      // render barcode into SVG
      if (svgRef.current) {
        try {
          JsBarcode(svgRef.current, value, {
            format: 'CODE128',
            displayValue: true,
            width: 2,
            height: 60,
          })
        } catch (err2) {
          console.error(err2)
          setError('ไม่สามารถสร้างบาร์โค้ดได้')
        }
      }
    } catch (ex: any) {
      console.error(ex)
      setError('เกิดข้อผิดพลาด: ' + (ex?.message || ex))
    }
  }

  function handleDownloadSvg() {
    if (!svgRef.current) return
    const svg = svgRef.current.outerHTML
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `barcode-${patientId || 'patient'}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">สร้าง Barcode จาก Patient ID</h1>

      <form onSubmit={handleGenerate} className="mb-4">
        <label className="block mb-2">Patient ID</label>
        <input
          className="border px-3 py-2 w-full max-w-xs mb-2"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="ใส่ Patient ID หรือเลขที่ผู้ป่วย"
        />
        <div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
            Generate
          </button>
          <button
            type="button"
            onClick={handleDownloadSvg}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download SVG
          </button>
        </div>
      </form>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {patient && (
        <div className="mb-4">
          <h2 className="font-medium">ข้อมูลผู้ป่วย</h2>
          <pre className="bg-gray-100 p-2 rounded mt-2 max-w-md overflow-auto">{JSON.stringify(patient, null, 2)}</pre>
        </div>
      )}

      <div>
        <svg ref={svgRef} />
      </div>
    </div>
  )
}
