import { Plus } from "lucide-react";

export default function LeaveManagement({ showLeaveModal, setShowLeaveModal }) {
  const leaveBalances = [
    { type: "Casual Leave", remaining: 5 },
    { type: "Sick Leave", remaining: 3 },
    { type: "Earned Leave", remaining: 10 },
  ];

  const leaveHistory = [
    { date: "2025-10-03", type: "Sick Leave", status: "Approved" },
    { date: "2025-09-15", type: "Casual Leave", status: "Pending" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Leave Balance</h3>
        <button
          onClick={() => setShowLeaveModal(true)}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={16} /> Apply Leave
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {leaveBalances.map((leave, i) => (
          <div key={i} className="border rounded-lg p-4 text-center">
            <h4 className="font-semibold text-gray-800">{leave.type}</h4>
            <p className="text-blue-600 font-bold text-xl">{leave.remaining}</p>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">Leave History</h3>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaveHistory.map((leave, i) => (
            <tr key={i}>
              <td className="border p-2">{leave.date}</td>
              <td className="border p-2">{leave.type}</td>
              <td className="border p-2 text-blue-600">{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
