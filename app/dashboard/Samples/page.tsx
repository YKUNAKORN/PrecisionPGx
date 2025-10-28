const Page = () => {
  return (
    <div className="min-h-dvh ">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold">Sample Management</h1>
        <h3 className="text-sm text-muted-foreground">
          Inventory, storage, and chain-of-custody controls.
        </h3>

        {/* Cards Section */}
        <div className="flex flex-wrap justify-center gap-5 mt-5">
          <Card title="Storage Capacity" value="68%" />
          <Card title="Temperature Alerts" value="1" />
          <Card title="Expiring Soon (30d)" value="1" />
        </div>

        {/* Chart Section */}
        <div className="mt-5 flex justify-center">
          <Chart
            title="Levey–Jennings Control Chart"
            value="Westgard checks: 1-3s (fail), 2-2s (fail), 1-2s (warn), R-4s (fail), 4-1s (warn), 10x (warn)"
          />
        </div>

        {/* Alerts */}
        <div className="mt-5 flex justify-center">
          <Alerts title="Alerts" value="xxxxxxx" />
        </div>

        {/* Inventory */}
        <div className="mt-5 flex justify-center">
          <Inventory title="Control Inventory" value="xxxxxxxxx" />
        </div>

        {/* Status */}
        <div className="mt-5 flex justify-center">
          <Status value="Status colors: Pass green, Warning orange, Failure red, Info blue. Control limits and target lines follow high-contrast styling for accessibility." />
        </div>
      </div>
    </div>
  );
};

/* ✅ ปรับเฉพาะ style เท่านั้น ไม่ยุ่ง logic */
function Card({ title, value }) {
  return (
    <div className=" border border-border rounded-xl p-5 shadow-sm w-64">
      <h3 className="text-sm text-muted-foreground">{title}</h3>
      {value && <p className="text-lg font-semibold">{value}</p>}
    </div>
  );
}

function Chart({ title, value }) {
  return (
    <div className=" border border-border rounded-xl p-6 shadow-sm w-full max-w-3xl">
      <h3 className="text-sm font-semibold">{title}</h3>
      {value && <p className="text-sm text-muted-foreground mt-2">{value}</p>}
    </div>
  );
}

function Alerts({ title, value }) {
  return (
    <div className=" border border-border rounded-xl p-6 shadow-sm w-full max-w-3xl">
      <h3 className="text-sm font-semibold">{title}</h3>
      {value && <p className="text-sm text-muted-foreground mt-2">{value}</p>}
    </div>
  );
}

function Inventory({ title, value }) {
  return (
    <div className=" border border-border rounded-xl p-6 shadow-sm w-full max-w-3xl">
      <h3 className="text-sm font-semibold">{title}</h3>
      {value && <p className="text-sm text-muted-foreground mt-2">{value}</p>}
    </div>
  );
}

function Status({ value }) {
  return (
    <div className=" border border-border rounded-xl p-6 shadow-sm w-full max-w-3xl">
      {value && <p className="text-sm text-muted-foreground mt-2">{value}</p>}
    </div>
  );
}

export default Page;
