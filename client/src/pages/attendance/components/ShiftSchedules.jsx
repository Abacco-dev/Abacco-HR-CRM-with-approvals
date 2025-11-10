// export default function ShiftSchedules() {
//   const shifts = [
//     { date: "2025-10-10", shift: "09:00 - 18:00", status: "Completed" },
//     { date: "2025-10-11", shift: "09:00 - 18:00", status: "Ongoing" },
//     { date: "2025-10-12", shift: "10:00 - 19:00", status: "Upcoming" },
//   ];

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Shift Schedule</h3>
//       <table className="w-full border text-sm">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-2 border">Date</th>
//             <th className="p-2 border">Shift</th>
//             <th className="p-2 border">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {shifts.map((s, i) => (
//             <tr key={i}>
//               <td className="border p-2">{s.date}</td>
//               <td className="border p-2">{s.shift}</td>
//               <td className="border p-2 text-blue-600">{s.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
