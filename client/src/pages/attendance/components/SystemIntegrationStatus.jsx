import { Server, Smartphone, Radio } from "lucide-react";

export default function SystemIntegrationStatus() {
  const systems = [
    { icon: Server, name: "Biometric System", status: "Active", color: "text-green-600" },
    { icon: Smartphone, name: "Mobile App", status: "Active", color: "text-green-600" },
    { icon: Radio, name: "RFID System", status: "Inactive", color: "text-red-600" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Integration Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {systems.map((sys, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 flex items-center gap-3"
          >
            <sys.icon className={sys.color} />
            <div>
              <p className="text-gray-800 font-medium">{sys.name}</p>
              <p className={`text-sm ${sys.color}`}>{sys.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
