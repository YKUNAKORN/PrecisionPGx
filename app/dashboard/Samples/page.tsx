"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// ✅ ปรับ path ให้ตรงโปรเจ็กต์คุณ
import { createStorageQueryOptions } from "../../../lib/fetch/Storage";
import type { Storage } from "@/type";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"Inventory" | "Storage" | "Clinical Controls" | "Historical">("Inventory");
  const [filters, setFilters] = useState({
    fridge_id: "All",
    type: "All",
    status: "All",
    sortBy: "ID",
    search: "",
  });

  // โหลดข้อมูลผ่าน React Query
  const { data: storagesRaw, isLoading, error } = useQuery(createStorageQueryOptions.all());

  // รองรับทั้งกรณี API คืนเป็น array ตรง ๆ หรือห่อด้วย { data: [...] }
  const storages: Storage[] = useMemo(() => {
    const raw: any = storagesRaw;
    return Array.isArray(raw) ? raw : (raw?.data ?? []);
  }, [storagesRaw]);

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold">Sample Management</h1>
      <h3 className="text-gray-300 mt-1">Inventory, storage, and status of existing samples</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        <SummaryCard title="Sample Capacity" value="84%" color="bg-green-500" progress={84} />
        <SummaryCard title="Temperature Alerts" value="0" color="bg-amber-400" progress={0} />
        <SummaryCard title="Expiring Soon (10d)" value="1" color="bg-red-500" progress={10} />
      </div>

      {/* Tabs */}
      <div className="flex justify-center mt-6 space-x-2">
        {(["Inventory", "Storage", "Clinical Controls", "Historical"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-medium transition shadow-sm ${activeTab === tab ? "bg-primary" : "hover:bg-primary/90"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6 transition-all duration-300">
        {activeTab === "Inventory" ? (
          <InventorySection
            filters={filters}
            setFilters={setFilters}
            storages={storages}
            loading={isLoading}
            error={error as Error | null}
          />
        ) : (
          <Placeholder title={activeTab} desc="Coming soon..." />
        )}
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function Placeholder({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border border-zinc-700 rounded-xl p-10 shadow-md text-center w-full min-h-[400px] flex flex-col justify-center items-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2">{desc}</p>
    </div>
  );
}

function SummaryCard({ title, value, color, progress }: { title: string; value: string; color: string; progress: number }) {
  return (
    <div className="rounded-xl shadow-md p-5 flex flex-col justify-between border border-zinc-700">
      <h3 className="text-sm">{title}</h3>
      <p className="text-lg font-semibold mt-1">{value}</p>
      <div className="w-full h-3 rounded-full mt-3">
        <div className={`${color} h-3 rounded-full transition-all`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function InventorySection({
  filters,
  setFilters,
  storages,
  loading,
  error,
}: {
  filters: {
    fridge_id: string;
    type: string;
    status: string;
    sortBy: "ID" | "Date" | "Status" | "Type";
    search: string;
  };
  setFilters: (updater: (prev: any) => any) => void;
  storages: Storage[];
  loading: boolean;
  error: Error | null;
}) {
  const filtered = useMemo(() => {
    const t = filters.search.trim().toLowerCase();
    let list = [...storages];

    if (filters.fridge_id !== "All") {
      list = list.filter((s) => (s.fridge_id ?? "").toLowerCase().includes(filters.fridge_id.toLowerCase()));
    }
    if (filters.type !== "All") {
      list = list.filter((s) => (s.specimen_type ?? "").toLowerCase().includes(filters.type.toLowerCase()));
    }
    if (filters.status !== "All") {
      list = list.filter((s) => (s.status ?? "").toLowerCase().includes(filters.status.toLowerCase()));
    }
    if (t) {
      list = list.filter((s) =>
        `${s.id} ${s.fridge_id ?? ""} ${s.specimen_type ?? ""} ${s.status ?? ""}`.toLowerCase().includes(t)
      );
    }

    switch (filters.sortBy) {
      case "Date":
        list.sort(
          (a, b) =>
            new Date(b.created_at as any).getTime() - new Date(a.created_at as any).getTime()
        );
        break;
      case "Status":
        list.sort((a, b) => (a.status ?? "").localeCompare(b.status ?? ""));
        break;
      case "Type":
        list.sort((a, b) => (a.specimen_type ?? "").localeCompare(b.specimen_type ?? ""));
        break;
      default:
        list.sort((a, b) => (a.id ?? "").localeCompare(b.id ?? ""));
    }
    return list;
  }, [storages, filters]);

  return (
    <div className="mt-4 border border-zinc-700 rounded-xl p-6 shadow-md">
      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by ID, patient, or test"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="w-full placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-sm md:justify-start">
          <Filter
            label="Fridge ID"
            value={filters.fridge_id}
            onChange={(v) => setFilters((f) => ({ ...f, fridge_id: v }))}
            options={["All", "A", "B", "C"]}
          />
          <Filter
            label="Type"
            value={filters.type}
            onChange={(v) => setFilters((f) => ({ ...f, type: v }))}
            options={["All", "Blood", "Saliva", "Tissue"]}
          />
          <Filter
            label="Status"
            value={filters.status}
            onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
            options={["All", "Active", "Stored", "Warning"]}
          />
        </div>
        <div className="flex items-center gap-3 text-sm md:ml-auto md:justify-end">
          <Filter
            label="Sort"
            value={filters.sortBy}
            onChange={(v) => setFilters((f) => ({ ...f, sortBy: v }))}
            options={["ID", "Date", "Status", "Type"]}
          />
          <button className="border border-zinc-700 px-4 py-1 rounded-md transition text-sm">
            Advanced Filtering
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="mt-6 text-sm">Loading storages…</div>
      ) : error ? (
        <div className="mt-6 text-sm text-red-400">Failed to load storages: {error.message}</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((s) => (
            <SampleCard
              key={s.id}
              data={{
                id: s.id,
                type: s.specimen_type ?? "—",
                fridge_id: s.fridge_id ?? "—",
                status: s.status ?? "—",
                date: formatDate(s.created_at as any),
                time: formatTime(s.created_at as any),
                test: s.specimen_type ?? "—",
              }}
            />
          ))}
        </div>

      )}
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: any) => void;
  options: string[];
}) {
  return (
    <div className="flex items-center gap-2">
      <label>{label}:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md px-3 py-1 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function SampleCard({
  data,
}: {
  data: {
    id: string;
    type: string;
    fridge_id: string;
    status: string;
    date: string;
    time: string;
    test: string;
  };
}) {
  const dotColor =
    data.status === "Active"
      ? "bg-green-500"
      : data.status === "Warning"
        ? "bg-amber-400"
        : "bg-blue-400";
  return (
    <div className="border border-zinc-700 rounded-xl p-4 shadow-md hover:shadow-lg transition w-full">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-sm md:text-base">{data.id}</h3>
        <span className="flex items-center gap-1 text-xs md:text-sm">
          <span className={`w-3 h-3 rounded-full ${dotColor}`} />
          {data.status}
        </span>
      </div>

      <div className="mt-1 space-y-1 text-xs md:text-sm">
        <p>Type: {data.type}</p>
        <p>Fridge ID: {data.fridge_id}</p>
        <p>Collected: {data.date}</p>
        <p>Time: {data.time}</p>
        <p>Test: {data.test}</p>
      </div>

      <div className="flex justify-between mt-3">
        {["Status", "Transfer", "Log"].map((btn) => (
          <button key={btn} className="border border-zinc-700 rounded-lg px-2 py-1 text-xs transition">
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- utils ---------- */
function formatDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}
function formatTime(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}



