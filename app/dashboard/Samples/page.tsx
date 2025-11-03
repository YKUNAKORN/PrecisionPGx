"use client";
import { useState } from "react";

const Page = () => {
  const [activeTab, setActiveTab] = useState("Inventory");
  const [filters, setFilters] = useState({
    location: "All",
    type: "All",
    status: "All",
    sortBy: "ID",
    search: "",
  });

  return (
    <div className="p-6  min-h-screen ">
      {/* Header */}
      <h1 className="text-2xl font-bold">Sample Management</h1>
      <h3 className="text-gray-300 mt-1">
        Inventory, storage, and status of existing samples
      </h3>

      {/* --- TOP SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        <SummaryCard title="Sample Capacity" value="84%" color="bg-green-500" progress={84} />
        <SummaryCard title="Temperature Alerts" value="0" color="bg-amber-400" progress={0} />
        <SummaryCard title="Expiring Soon (10d)" value="1" color="bg-red-500" progress={10} />
      </div>

      {/* Tabs */}
      <div className="flex justify-center mt-6 space-x-2">
        {["Inventory", "Storage", "Clinical Controls", "Historical"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-medium transition shadow-sm ${
              activeTab === tab
                ? "bg-primary "
                : "hover:bg-primary/90"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content (Unified Layout) */}
      <div className="mt-6 transition-all duration-300">
        {activeTab === "Inventory" ? (
          <InventorySection filters={filters} setFilters={setFilters} />
        ) : (
          <Placeholder title={activeTab} desc="Coming soon..." />
        )}
      </div>
    </div>
  );
};

/* --- PLACEHOLDER (Matched Layout) --- */
function Placeholder({ title, desc }) {
  return (
    <div className=" border border-zinc-700 rounded-xl p-10 shadow-md text-center  w-full min-h-[400px] flex flex-col justify-center items-center">
      <h3 className="text-lg font-semibold ">{title}</h3>
      <p className="mt-2">{desc}</p>
    </div>
  );
}

/* --- SUMMARY CARD --- */
function SummaryCard({ title, value, color, progress }) {
  return (
    <div className=" rounded-xl shadow-md p-5 flex flex-col justify-between border border-zinc-700">
      <h3 className="text-sm ">{title}</h3>
      <p className="text-lg font-semibold  mt-1">{value}</p>
      <div className="w-full h-3 rounded-full mt-3">
        <div className={`${color} h-3 rounded-full transition-all`} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

/* --- INVENTORY SECTION --- */
function InventorySection({ filters, setFilters }) {
  const samples = [
    { id: "S-240041-001", type: "Blood", location: "Freezer A / BTC1", status: "Active", date: "2024-03-01", time: "08:30", test: "Genomic WGS" },
    { id: "S-240038-114", type: "Saliva", location: "Freezer B / BVC5", status: "Active", date: "2024-02-28", time: "14:15", test: "PGx Panel" },
    { id: "S-240735-043", type: "Tissue", location: "Freezer C / BXd-3", status: "Warning", date: "2024-03-02", time: "11:45", test: "Exome Seq" },
    { id: "S-240402-273", type: "Blood", location: "Freezer A / AXCd", status: "Stored", date: "2024-02-27", time: "09:20", test: "Targeted Panel" },
  ];

  return (
    <div className="mt-4  border border-zinc-700 rounded-xl p-6 shadow-md">
      {/* Search & Filters */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by ID, patient, or test"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="w-full  placeholder-gray-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-sm  md:justify-start">
          <Filter label="Location" value={filters.location} onChange={(v) => setFilters(f => ({ ...f, location: v }))} options={["All","A","B","C"]} />
          <Filter label="Type" value={filters.type} onChange={(v) => setFilters(f => ({ ...f, type: v }))} options={["All","Blood","Saliva","Tissue"]} />
          <Filter label="Status" value={filters.status} onChange={(v) => setFilters(f => ({ ...f, status: v }))} options={["All","Active","Stored","Warning"]} />
        </div>
        <div className="flex items-center gap-3 text-sm  md:ml-auto md:justify-end">
          <Filter label="Sort" value={filters.sortBy} onChange={(v) => setFilters(f => ({ ...f, sortBy: v }))} options={["ID","Date","Status","Type"]} />
          <button className="border border-zinc-700  px-4 py-1 rounded-md  transition text-sm">Advanced Filtering</button>
        </div>
      </div>

      {/* Sample Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {samples.map((s) => (
          <SampleCard key={s.id} data={s} />
        ))}
      </div>
    </div>
  );
}

/* --- FILTER COMPONENT --- */
function Filter({ label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-2">
      <label>{label}:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md px-3 py-1 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

/* --- SAMPLE CARD --- */
function SampleCard({ data }) {
  const dotColor =
    data.status === "Active"
      ? "bg-green-500"
      : data.status === "Warning"
      ? "bg-amber-400"
      : "bg-blue-400";

  return (
    <div className=" border border-zinc-700 rounded-xl p-4 shadow-md hover:shadow-lg transition w-full">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-sm md:text-base">{data.id}</h3>
        <span className="flex items-center gap-1 text-xs  md:text-sm">
          <span className={`w-3 h-3 rounded-full ${dotColor}`}></span>
          {data.status}
        </span>
      </div>

      <div className="mt-1 space-y-1  text-xs md:text-sm">
        <p>Type: {data.type}</p>
        <p>Patient / Location: {data.location}</p>
        <p>Collected: {data.date}</p>
        <p>Time: {data.time}</p>
        <p>Test: {data.test}</p>
      </div>

      <div className="flex justify-between mt-3">
        {["Status", "Transfer", "Log"].map((btn) => (
          <button
            key={btn}
            className="border border-zinc-700 rounded-lg px-2 py-1 text-xs   transition"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Page;
