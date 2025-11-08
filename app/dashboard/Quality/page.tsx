import { AlertTriangle, Info } from "lucide-react";

const Page = () => {
  return (
    <div className="p-5 bg-[#F6F2FA] min-h-screen text-[#4A4458]">
      {/* Header */}
      <h1 className="text-2xl font-bold text-[#000000]">Quality Control</h1>
      <h3 className="text-[#000000]">
        Real-time control monitoring, Westgard rules, and inventory status.
      </h3>

      {/* Cards */}
      <div className="flex flex-wrap justify-start gap-5 mt-5">
        <Card title="Pass Rate" value="96.4%" />
        <Card title="Warnings (24h)" value="1" />
        <Card title="Failures (24h)" value="0" />
        <Card title="MTSF" value="36.5 h" />
      </div>

      {/* Main content grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chart (2 cols) */}
        <div className="lg:col-span-2">
          <Chart
            title="Levey–Jennings Control Chart"
            value="Westgard checks: 1-3s (Warn), 2-2s (Warn), R-4s (Warn), 1-4s (Warn), 10x (Warn)"
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

function Card({ title, value }) {
  return (
    <div className="bg-[#F9F6FF] border border-[#CCC2DC] rounded-xl p-5 shadow-sm w-60">
      <h3 className="text-sm text-[#000000]">{title}</h3>
      {value && <p className="text-lg font-semibold text-[#4F378B] mt-1">{value}</p>}
    </div>
  );
}

function Chart({ title, value }) {
  return (
    <div className="bg-[#F9F6FF] border border-[#CCC2DC] rounded-xl p-6 shadow-md w-full">
      <h3 className="text-sm font-bold text-[#000000]">{title}</h3>
      {value && <p className="text-sm text-[#938F99] mt-3">{value}</p>}
      <div className="h-56 bg-[#D0BCFF1A] mt-4 rounded-md flex items-center justify-center text-[#938F99] text-xs border border-[#CCC2DC]">
        Chart Area
      </div>
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
    <div className="bg-[#F9F6FF] rounded-xl p-4 shadow-md w-full border border-[#CCC2DC]">
      <h2 className="mb-3 text-lg font-semibold text-[#000000]">Alerts</h2>
      <div className="space-y-2">
        {alertsData.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start justify-between rounded-lg bg-[#D0BCFF1A] p-3 border border-[#CCC2DC]"
          >
            <div className="flex items-start gap-3">
              {renderIcon(alert.type)}
              <div>
                <p className="text-sm font-medium text-[#4A4458]">{alert.title}</p>
                <p className="text-xs text-[#000000]">{alert.description}</p>
              </div>
            </div>
            <span className="text-xs text-[#000000]">{alert.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Inventory() {
  const inventoryData = [
    { analyte: "HbA1c L2", lot: "AS-2405", expires: "2026-01-31", stock: 18 },
    { analyte: "Lipid Panel L1", lot: "LP-2402", expires: "2025-12-15", stock: 7 },
  ];

  const getStockColor = (stock) => {
    if (stock < 10) return "text-[#000000] font-semibold";
    if (stock < 20) return "text-[#000000] font-semibold";
    return "text-[#000000] font-semibold";
  };

  return (
    <div className="bg-[#F9F6FF] rounded-xl p-4 shadow-md w-full border border-[#CCC2DC]">
      <h3 className="text-lg font-semibold mb-4 text-[#000000]">Control Inventory</h3>
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-[#CCC2DC] text-[#000000] uppercase text-xs tracking-wider">
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
              className="border-b border-[#EAE4F5] last:border-0 hover:bg-[#D0BCFF1A] transition"
            >
              <td className="py-2 text-[#4A4458]">{item.analyte}</td>
              <td className="py-2 text-[#4A4458]">{item.lot}</td>
              <td className="py-2 text-[#4A4458]">{item.expires}</td>
              <td className={`py-2 ${getStockColor(item.stock)}`}>{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Status({ value }) {
  return (
    <div className="bg-[#F9F6FF] border border-[#CCC2DC] rounded-lg p-4 shadow-sm w-full max-w-4xl">
      {value && <p className="text-xs text-[#000000]">{value}</p>}
    </div>
  );
}

export default Page;