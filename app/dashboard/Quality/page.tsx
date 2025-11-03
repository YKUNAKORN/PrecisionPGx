import { AlertTriangle, Info } from "lucide-react";

const Page = () => {
  return (
    <div className="p-5  min-h-screen ">
      {/* Header */}
      <h1 className="text-2xl font-bold">Quality Control</h1>
      <h3 className="text-gray-300">
        Real-time control monitoring, Westgard rules, and inventory status.
      </h3>

      {/* Cards */}
      <div className="flex flex-wrap justify-start gap-5 mt-5">
        <Card title="Pass Rate" value="96.4%" />
        <Card title="Warnings (24h)" value="2" />
        <Card title="Failures (24h)" value="0" />
        <Card title="MTBF" value="36.5 h" />
      </div>

      {/* Main content grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chart (2 cols) */}
        <div className="lg:col-span-2">
          <Chart
            title="Levey–Jennings Control Chart"
            value="Westgard checks: 1-3s (fail), 2-2s (fail), 1-2s (warn), R-4s (fail), 4-1s (warn), 10x (warn)"
          />
        </div>

        {/* Right: Alerts */}
        <div className="space-y-5">
          <Alerts />
          <Inventory />
        </div>
      </div>

      {/* Status */}
      <div className="mt-5 flex justify-center">
        <Status value="Status colors: Pass green, Warning orange, Failure red, Info blue. Control limits and target lines follow high-contrast styling for accessibility." />
      </div>
    </div>
  );
};

// ✅ Card
function Card({ title, value }) {
  return (
    <div className=" border border-zinc-700 rounded-lg p-5 shadow-sm w-60">
      <h3 className="text-sm text-gray-400">{title}</h3>
      {value && <p className="text-lg font-semibold  mt-1">{value}</p>}
    </div>
  );
}

// ✅ Chart
function Chart({ title, value }) {
  return (
    <div className="border border-zinc-700 rounded-lg p-6 shadow-md w-full relative overflow-hidden">
      <h3 className="text-sm font-bold">{title}</h3>
      {value && <p className="text-sm text-gray-400 mt-3">{value}</p>}

      {/* พื้นที่ chart พร้อมเบลอ */}
      <div className="h-56 mt-4 rounded-md flex items-center justify-center text-gray-400 text-sm backdrop-blur-sm bg-zinc-900/50">
        <span className="font-medium text-gray-500 animate-pulse">Coming Soon</span>
      </div>
    </div>
  );
}


// ✅ Alerts
function Alerts() {
  const alertsData = [
    {
      id: 1,
      title: "1-2s warning on HbA1c Level 2",
      description: "Result 2.2σ above mean",
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
        return <AlertTriangle size={18} className="text-amber-400 mt-0.5" />;
      case "info":
        return <Info size={18} className="text-blue-400 mt-0.5" />;
      default:
        return null;
    }
  };

  return (
    <div className=" rounded-xl p-4 shadow-lg w-full border border-zinc-700">
      <h2 className="mb-3 text-lg font-semibold ">Alerts</h2>
      <div className="space-y-2">
        {alertsData.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start justify-between rounded-lg p-3"
          >
            <div className="flex items-start gap-3">
              {renderIcon(alert.type)}
              <div>
                <p className="text-sm font-medium ">{alert.title}</p>
                <p className="text-xs text-gray-400">{alert.description}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">{alert.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ Inventory
function Inventory() {
  const inventoryData = [
    { analyte: "HbA1c L2", lot: "A2-2406", expires: "2026-01-31", stock: 18 },
    { analyte: "Lipid Panel L1", lot: "LP-2402", expires: "2025-12-15", stock: 9 },
    { analyte: "LFT L3", lot: "LFT-2408", expires: "2026-03-12", stock: 25 },
  ];

  const getStockColor = (stock) => {
    if (stock < 10) return "text-red-400 font-semibold";
    if (stock < 20) return "text-amber-400 font-semibold";
    return " font-semibold";
  };

  return (
    <div className=" rounded-xl p-4 shadow-md w-full border border-zinc-700">
      <h3 className="text-lg font-semibold mb-4 ">Control Inventory</h3>
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-700 text-gray-300 uppercase text-xs tracking-wider">
            <th className="pb-2 pt-1">Analyte</th>
            <th className="pb-2 pt-1">Lot</th>
            <th className="pb-2 pt-1">Expires</th>
            <th className="pb-2 pt-1">Stock</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map((item, idx) => (
            <tr
              key={idx}
              className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition"
            >
              <td className="py-2 text-white">{item.analyte}</td>
              <td className="py-2 text-white">{item.lot}</td>
              <td className="py-2 text-white">{item.expires}</td>
              <td className={`py-2 ${getStockColor(item.stock)}`}>{item.stock}</td>
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
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 shadow-md w-full max-w-4xl">
      {value && <p className="text-xs text-gray-300">{value}</p>}
    </div>
  );
}

export default Page;