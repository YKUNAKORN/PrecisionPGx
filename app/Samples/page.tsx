const Page = () => {
  return (
    <div className="p-5">
      <h1>Sample Management</h1>
      <h3>Inventory, storage, and chain-of-custody controls.</h3>

      <div className="flex flex-wrap justify-center gap-5 mt-5">
        <Card title="Storage Capacity" value="68%" />
        <Card title="Temperature Alerts" value="1" />
        <Card title="Expiring Soon (30d)" value="1" />
      </div>

       <div className="mt-5 flex justify-center">
        <Chart title="Levey–Jennings Control Chart" value="Westgard checks: 1-3s (fail), 2-2s (fail), 1-2s (warn), R-4s (fail), 4-1s (warn), 10x (warn)" />
      </div>

      <div className="mt-5 flex justify-center">
        <Alerts title="Alerts" value="xxxxxxx" />
      </div>

      <div className="mt-5 flex justify-center">
        <Inventory title="Control Inventory" value="xxxxxxxxx" />
      </div>
    
    <div className="mt-5 flex justify-center">
        <Status value="Status colors: Pass green, Warning orange, Failure red, Info blue. Control limits and target lines follow high-contrast styling for accessibility." />
      </div>

    </div> 
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm w-85">
      <h3 className="text-sm text-gray-600 mt-2">{title}</h3>
      {value && <p className="text-lg font-semibold">{value}</p>}
    </div>
  );
}

function Chart({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-md w-265">
      <h3 className="text-sm font-bold">{title}</h3>
      {value && <p className="text-base text-gray-700 mt-3">{value}</p>}
    </div>
  );
}

function Alerts({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-md w-265">
      <h3 className="text-sm font-bold">{title}</h3>
      {value && <p className="text-base text-gray-700 mt-3">{value}</p>}
    </div>
  );
}

function Inventory({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-md w-265">
      <h3 className="text-sm font-bold">{title}</h3>
      {value && <p className="text-base text-gray-700 mt-3">{value}</p>}
    </div>
  );
}

function Status({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-md w-265">
      {value && <p className="text-base text-gray-700 mt-3">{value}</p>}
    </div>
  );
}
export default Page;
