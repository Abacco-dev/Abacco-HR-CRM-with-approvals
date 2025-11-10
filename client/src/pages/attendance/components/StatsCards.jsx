// import { Calendar, Timer, AlertCircle, CheckCircle } from "lucide-react";

// export default function StatsCards() {
//   const stats = [
//     { icon: Calendar, label: "Days Present", value: 22, color: "text-green-600" },
//     { icon: AlertCircle, label: "Days Absent", value: 2, color: "text-red-600" },
//     { icon: Timer, label: "Total Hours", value: "176h", color: "text-blue-600" },
//     { icon: CheckCircle, label: "Overtime Hours", value: "8h", color: "text-indigo-600" },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//       {stats.map((stat, index) => (
//         <div key={index} className="bg-white rounded-lg shadow-sm p-5 flex items-center gap-3">
//           <stat.icon className={`${stat.color}`} />
//           <div>
//             <div className="text-sm text-gray-500">{stat.label}</div>
//             <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
