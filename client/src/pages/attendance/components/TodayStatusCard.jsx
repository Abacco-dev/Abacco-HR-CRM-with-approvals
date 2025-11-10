// import { useState, useEffect } from "react";
// import { Clock, CheckCircle, XCircle, LogIn } from "lucide-react";

// export default function TodayStatusCard({ todayStatus, onClockAction, loading }) {
//   const [schedule, setSchedule] = useState({ login: "", logout: "" });
//   const [checkedIn, setCheckedIn] = useState(false);

//   useEffect(() => {
//     const now = new Date();
//     const day = now.getDay(); // 0 = Sunday, 6 = Saturday
//     let loginTime = "";
//     let logoutTime = "";

//     if (day >= 1 && day <= 5) {
//       loginTime = "5:30 PM";
//       logoutTime = "3:30 AM";
//     } else if (day === 6) {
//       loginTime = "2:30 PM";
//       logoutTime = "10:00 PM";
//     } else {
//       loginTime = "Holiday";
//       logoutTime = "Holiday";
//     }

//     setSchedule({ login: loginTime, logout: logoutTime });
//   }, []);

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">
//             Today's Status
//           </h2>

//           <div className="text-sm text-gray-700 mb-2">
//             <p>
//               <strong>Shift:</strong>{" "}
//               {schedule.login === "Holiday"
//                 ? "Sunday (Holiday)"
//                 : `${schedule.login} → ${schedule.logout}`}
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <Clock className="text-blue-500" />
//             <span className="text-gray-700 text-sm">
//               {todayStatus.clockedIn
//                 ? `Clocked in at ${todayStatus.clockInTime}`
//                 : "Not clocked in yet"}
//             </span>
//           </div>
//         </div>

//         <div className="flex gap-3">
//           {/* Step 1: Check In */}
//           {!checkedIn && schedule.login !== "Holiday" && (
//             <button
//               onClick={() => setCheckedIn(true)}
//               disabled={loading}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
//             >
//               <LogIn size={18} /> Check In
//             </button>
//           )}

//           {/* Step 2: Clock In */}
//           {checkedIn && !todayStatus.clockedIn && (
//             <button
//               onClick={() => onClockAction("clockIn")}
//               disabled={loading}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
//             >
//               <CheckCircle size={18} /> Clock In
//             </button>
//           )}

//           {/* Step 3: Clock Out */}
//           {todayStatus.clockedIn && !todayStatus.clockedOut && (
//             <button
//               onClick={() => onClockAction("clockOut")}
//               disabled={loading}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
//             >
//               <XCircle size={18} /> Clock Out
//             </button>
//           )}

//           {/* Step 4: Completed */}
//           {todayStatus.clockedOut && (
//             <span className="text-green-600 font-medium">Day Completed</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
