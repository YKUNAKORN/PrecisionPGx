'use client';
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { AlertTriangle, Info } from "lucide-react";
import type { Qualityper } from "../../../lib/fetch/type";
import { createQualityQueryOptions } from "../../../lib/fetch/Quality";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
    const {
        data: qualityper,
        isLoading: loadingqualityper,
        error: errorqualityper,
    } = useQuery(createQualityQueryOptions.pec());

    if (loadingqualityper) return <div className="p-5">Loading...</div>;
    if (errorqualityper)
        return (
            <div className="p-5 text-red-400">
                Error loading data: {(errorqualityper as Error).message}
            </div>
        );

  // Defensive defaults if backend shape differs
  const q: Qualityper = {
    pass: (qualityper as any)?.pass ?? 0,
    failed: (qualityper as any)?.failed ?? 0,
    warning: (qualityper as any)?.warning ?? 0,
    total: (qualityper as any)?.total ?? 0,
    ...(qualityper as object),
  };


    return (
        <div>
            {/* Header */}
            <h1 className="text-2xl font-bold text-[#000000] mb-1">Quality Control</h1>
            <h3 className="text-[#000000] text-base mb-6">
                Real-time control monitoring, Westgard rules, and inventory status.
            </h3>
            {/* Cards */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
                <Card title="Pass Rate" value={`${q.pass}%`} />
                <Card title="Warnings (24h)" value={`${q.warning}%`} />
                <Card title="Failures (24h)" value={`${q.failed}%`} />
                <Card title="Total" value={`${q.total}`} />
            </div>
            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Chart (2 cols) */}
                <div className="lg:col-span-2">
                    <Chart
                        title="Levey–Jennings Control Chart"
                        value="Westgard checks: 1-3s (Warn), 2-2s (Warn), R-4s (Warn), 1-4s (Warn), 10x (Warn)"
                      q={q}
          />
                </div>
                {/* Right: Alerts + Inventory */}
                <div className="space-y-6">
                    <Alerts />
                    <Inventory />
                </div>
            </div>
            {/* Status */}
            <div className="mt-8 flex justify-center">
                <Status value="Status colors: Pass green, Warning orange, Failure red, Info blue. Control limits and target lines follow high-contrast styling for accessibility." />
            </div>
        </div>
    );
};

// ✅ Card
function Card({ title, value }) {
    return (
        <div className="bg-transparent border border-[#CCC2DC] rounded-xl p-6 shadow-[4px_12px_16px_0px_rgba(79,55,139,0.3)] w-80 transition">
            <h3 className="text-sm text-[#000000] font-medium">{title}</h3>
            {value && <p className="text-xl font-semibold text-[#4F378B] mt-2">{value}</p>}
        </div>
    );
}

// ✅ Chart
function Chart({ title, value, q }) {
  const toNum = (v: any) => {
    if (typeof v === "string") return parseFloat(v.replace("%", "").trim()) || 0;
    return Number(v) || 0;
  };

  const pass = toNum(q.pass);
  const warning = toNum(q.warning);
  const failed = toNum(q.failed);
  const totalCount = toNum(q.total);

  const data = [
    { name: "Pass", value: pass, color: "#4CAF50" },
    { name: "Warning", value: warning, color: "#FFA500" },
    { name: "Failure", value: failed, color: "#F44336" },
  ];

  const sum = pass + warning + failed;

  // ถ้าเป็น % (รวมใกล้ 100) -> แปลงเป็นจำนวนจาก total ด้วย largest remainder
  const toCounts = (vals: number[], total: number) => {
    if (total <= 0 || vals.reduce((a, b) => a + b, 0) === 0) return vals.map(() => 0);
    const s = vals.reduce((a, b) => a + b, 0);
    const raw = vals.map((v) => (v / s) * total);
    const floored = raw.map(Math.floor);
    let rest = total - floored.reduce((a, b) => a + b, 0);
    const order = raw
      .map((r, i) => ({ i, frac: r - Math.floor(r) }))
      .sort((a, b) => b.frac - a.frac);
    const final = [...floored];
    for (let k = 0; k < final.length && rest > 0; k++) {
      final[order[k].i]++;
      rest--;
    }
    return final;
  };

  let countByName: Record<string, number>;
  if (Math.abs(sum - 100) < 0.5 && totalCount > 0) {
    // เป็นเปอร์เซ็นต์ -> แปลงเป็นจำนวนจาก total
    const [pC, wC, fC] = toCounts([pass, warning, failed], totalCount);
    countByName = { Pass: pC, Warning: wC, Failure: fC };
  } else {
    // ไม่ใช่เปอร์เซ็นต์ -> ถือว่าเป็นจำนวนอยู่แล้ว
    countByName = { Pass: pass, Warning: warning, Failure: failed };
  }

  const total = totalCount || sum; // ไว้ใช้เช็ค empty-state เดิม

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent <= 0) return null;
    const RAD = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 1.3;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    const color = name === "Pass" ? "#4CAF50" : name === "Warning" ? "#FFA500" : "#F44336";
    return (
      <text x={x} y={y} fill={color} textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={13} fontWeight={600}>
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-[#F9F6FF] border border-[#000000] rounded-xl p-6 shadow-md w-full">
      <h3 className="text-base font-bold text-[#000000]">{title}</h3>
      {value && <p className="text-sm text-[#938F99] mt-3 leading-relaxed">{value}</p>}

      {total <= 0 ? (
        <div className="h-64 mt-5 rounded-lg flex items-center justify-center text-[#938F99] text-sm border border-[#CCC2DC]">
          No data
        </div>
      ) : (
        <div className="h-64 mt-5 flex items-center justify-center">
          <PieChart width={550} height={280} margin={{ top: 12 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={renderCustomLabel}
              labelLine={false}
              minAngle={3}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>

            {/* ตรงนี้คือ controller tooltip; เปลี่ยนเป็นโชว์ "จำนวน" ตาม total */}
            <Tooltip
              formatter={(_, name: string) => [`${countByName[name!]}`, `${name}`]}
              contentStyle={{
                backgroundColor: "#F9F6FF",
                border: "1px solid #CCC2DC",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </div>
      )}
    </div>
  );
}


function Alerts() {
    const alertsData = [
        {
            id: 1,
            title: "1.2s warning on HbA1c Level 2",
            description: "Result 2.2% above mean",
            time: "2m ago",
            type: "warning",
        },
        {
            id: 2,
            title: "Inventory low for Cardiac Panel QC",
            description: "Stock below threshold",
            time: "1h ago",
            type: "info",
        },
    ];

    const renderIcon = (type) => {
        switch (type) {
            case "warning":
                return <AlertTriangle size={18} className="text-[#FFBF00] mt-0.5" />;
            case "info":
                return <Info size={18} className="text-[#0099FF] mt-0.5" />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-transparent rounded-xl p-5 shadow-[4px_12px_16px_0px_rgba(79,55,139,0.3)] w-full border border-[#CCC2DC]">
            <h2 className="mb-4 text-lg font-semibold text-[#000000]">Alerts</h2>
            <div className="space-y-3">
                {alertsData.map((alert) => (
                    <div
                        key={alert.id}
                        className="flex items-start justify-between rounded-lg bg-transparent p-3 border border-[#CCC2DC]"
                    >
                        <div className="flex items-start gap-3">
                            {renderIcon(alert.type)}
                            <div>
                                <p className="text-sm font-medium text-[#4A4458]">{alert.title}</p>
                                <p className="text-xs text-[#000000]">{alert.description}</p>
                            </div>
                        </div>
                        <span className="text-xs text-[#000000] whitespace-nowrap">{alert.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ✅ Inventory
function Inventory() {
    const inventoryData = [
        { analyte: "HbA1c L2", lot: "AS-2405", expires: "2026-01-31", stock: 18 },
        { analyte: "Lipid Panel L1", lot: "LP-2402", expires: "2025-12-15", stock: 7 },
    ];

    const getStockColor = (stock) => {
        if (stock < 10) return "text-[#D32F2F] font-semibold";
        if (stock < 20) return "text-[#F57C00] font-semibold";
        return "text-[#388E3C] font-semibold";
    };

    return (
        <div className="bg-transparent rounded-xl p-5 shadow-[4px_12px_16px_0px_rgba(79,55,139,0.3)] w-full border border-[#CCC2DC]">
            <h3 className="text-lg font-semibold mb-4 text-[#000000]">Control Inventory</h3>
            <table className="w-full text-sm text-left border-collapse">
                <thead>
                    <tr className="border-b border-[#CCC2DC] text-[#000000] uppercase text-xs tracking-wider">
                        <th className="pb-2 pt-1">Analyte</th>
                        <th className="pb-2 pt-1">Lot</th>
                        <th className="pb-2 pt-1">Expires</th>
                        <th className="pb-2 pt-1 text-right">Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {inventoryData.map((item, idx) => (
                        <tr
                            key={idx}
                            className="border-b border-[#CCC2DC] last:border-0 hover:bg-[#D0BCFF1A] transition"
                        >
                            <td className="py-2 text-[#4A4458]">{item.analyte}</td>
                            <td className="py-2 text-[#4A4458]">{item.lot}</td>
                            <td className="py-2 text-[#4A4458]">{item.expires}</td>
                            <td className={`py-2 text-right ${getStockColor(item.stock)}`}>{item.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ✅ Status
function Status({ value }) {
    return (
        <div className="bg-transparent border border-[#CCC2DC] rounded-lg p-4 shadow-[4px_12px_16px_0px_rgba(79,55,139,0.3)] w-full max-w-8xl mx-auto">
            <p className="text-sm text-[#4A4458] flex flex-wrap items-center gap-2">
                <span className="font-medium">Status colors:</span>
                {/* จุดสี */}
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-[#4CAF50]"></span>
                    Pass
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-[#FFA500]"></span>
                    Warning range
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-[#F44336]"></span>
                    Failure
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-[#2196F3]"></span>
                    Info
                </span>
                <span className="ml-3">
                    Control limits and target lines follow manufacturer guidelines for acceptability.
                </span>
            </p>
        </div>
    );
}

export default Page;