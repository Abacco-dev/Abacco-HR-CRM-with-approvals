// // src/pages/attendes/components/Header.jsx
// import React from "react";

// export default function Header({ employee, currentTime }) {
//   return (
//     <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex justify-between items-start">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
//         <div className="mt-2 text-gray-600">
//           <p>Welcome back, {employee.name} ({employee.employeeId})</p>
//           <p>Department: {employee.department} | Shift: 17:30 - 03:30</p>
//         </div>
//       </div>

//       <div className="text-right">
//         <div className="text-sm text-gray-600">Current Time</div>
//         <div className="text-2xl font-bold text-blue-600">{currentTime}</div>
//         <div className="text-sm text-gray-600">{new Date().toLocaleDateString('en-GB')}</div>
//       </div>
//     </div>
//   );
// }

