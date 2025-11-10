// import { Plus } from "lucide-react";

// export default function OvertimeRequests({ showOvertimeModal, setShowOvertimeModal }) {
//   const overtime = [
//     { date: "2025-10-04", hours: "2h", status: "Approved" },
//     { date: "2025-09-28", hours: "3h", status: "Pending" },
//   ];

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold text-gray-900">Overtime Requests</h3>
//         <button
//           onClick={() => setShowOvertimeModal(true)}
//           className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2"
//         >
//           <Plus size={16} /> Request Overtime
//         </button>
//       </div>

//       <table className="w-full border text-sm">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-2 border">Date</th>
//             <th className="p-2 border">Hours</th>
//             <th className="p-2 border">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {overtime.map((ot, i) => (
//             <tr key={i}>
//               <td className="border p-2">{ot.date}</td>
//               <td className="border p-2">{ot.hours}</td>
//               <td className="border p-2 text-blue-600">{ot.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
