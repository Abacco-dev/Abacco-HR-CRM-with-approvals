export default function AttendanceRecords() {
  const records = [
    { date: "2025-10-01", inTime: "09:10 AM", outTime: "06:00 PM", status: "Present" },
    { date: "2025-10-02", inTime: "09:20 AM", outTime: "06:05 PM", status: "Present" },
    { date: "2025-10-03", inTime: "-", outTime: "-", status: "Absent" },
    { date: "2025-10-04", inTime: "09:05 AM", outTime: "05:55 PM", status: "Present" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Records</h3>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Clock In</th>
              <th className="p-2 border">Clock Out</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, i) => (
              <tr key={i}>
                <td className="border p-2">{rec.date}</td>
                <td className="border p-2">{rec.inTime}</td>
                <td className="border p-2">{rec.outTime}</td>
                <td
                  className={`border p-2 font-medium ${
                    rec.status === "Present" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {rec.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
