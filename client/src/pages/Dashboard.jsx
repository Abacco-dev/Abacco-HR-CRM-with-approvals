import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// 🔑 Assume we get role from AuthContext or backend
// Example: "ADMIN" | "HR" | "EMPLOYEE"
const loggedInUser = {
  role: "ADMIN", // change to EMPLOYEE to test employee view
  name: "Fakhri Boden",
};

export default function Dashboard() {
  const dummyData = {
    totalEmployees: 522,
    attendanceToday: 500,
    requestPaidLeave: 15,
    employeePerformance: [
      { date: "2025-09-01", closed: 12, target: 15 },
      { date: "2025-09-02", closed: 18, target: 20 },
      { date: "2025-09-03", closed: 22, target: 25 },
      { date: "2025-09-04", closed: 15, target: 20 },
      { date: "2025-09-05", closed: 30, target: 30 },
      { date: "2025-09-06", closed: 25, target: 28 },
    ],
    employees: [
      {
        name: "Aditya Wibowo",
        role: "Creative Director",
        jobLevel: "Senior Staff",
        status: "Active",
        totalLeads: 120,
        pendingLeads: 5,
        loginTime: "09:10 AM",
      },
      {
        name: "Fahmi Pratama",
        role: "Project Manager",
        jobLevel: "Middle Staff",
        status: "Active",
        totalLeads: 95,
        pendingLeads: 10,
        loginTime: "09:20 AM",
      },
      {
        name: "Fakhri Boden",
        role: "Fullstack Developer",
        jobLevel: "Junior Staff",
        status: "Paid Leave",
        totalLeads: 40,
        pendingLeads: 8,
        loginTime: "On Leave",
      },
    ],
    announcements: [
      { title: "Mass Leave", desc: "Collective leave May 1–3, 2024" },
      { title: "Eid Al-Fitr", desc: "Holiday set for Wed–Thu, Apr 10–11, 2024" },
      { title: "Birthday Fahmi Pratama", desc: "Fahmi turns 33 today 🎉" },
      { title: "Birthday Fakhri Boden", desc: "Fakhri turns 28 today 🎉" },
      { title: "Pay Day", desc: "Salary has been processed, check your account" },
    ],
    interviews: [
      {
        candidate: "Chiurul Aji",
        position: "UI/UX Designer",
        time: "11:00 AM",
      },
      {
        candidate: "Gusto Nusamba",
        position: "Fullstack Developer",
        time: "2:00 PM",
      },
    ],
  };

  const [data, setData] = useState(null);

  useEffect(() => {
    setData(dummyData);
  }, []);

  if (!data) return <p className="text-center mt-10">Loading dashboard...</p>;

  // 🔽 Filter employees for Employee role
  const visibleEmployees =
    loggedInUser.role === "EMPLOYEE"
      ? data.employees.filter((emp) => emp.name === loggedInUser.name)
      : data.employees;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Top Stats */}
      {loggedInUser.role !== "EMPLOYEE" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Total Employees</p>
            <h2 className="text-3xl font-bold">{data.totalEmployees}</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Today Attendance</p>
            <h2 className="text-3xl font-bold">{data.attendanceToday}</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Request Paid Leave</p>
            <h2 className="text-3xl font-bold">{data.requestPaidLeave}</h2>
          </div>
        </div>
      )}

      {/* Employee Performance */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="font-semibold mb-4">Employee Performance (Leads)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.employeePerformance}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="closed"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Closed Leads"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#6366f1"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              name="Target"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Employee Status with Leads + Login Time */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="font-semibold mb-4">
          {loggedInUser.role === "EMPLOYEE" ? "My Status" : "Employee Status"}
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Role</th>
              <th className="p-2">Job Level</th>
              <th className="p-2">Status</th>
              <th className="p-2">Total Leads</th>
              <th className="p-2">Pending Leads</th>
              <th className="p-2">Login Time</th>
            </tr>
          </thead>
          <tbody>
            {visibleEmployees.map((emp, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{emp.name}</td>
                <td className="p-2">{emp.role}</td>
                <td className="p-2">{emp.jobLevel}</td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      emp.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="p-2">{emp.totalLeads}</td>
                <td className="p-2">{emp.pendingLeads}</td>
                <td className="p-2">{emp.loginTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Announcements & Interviews */}
      {loggedInUser.role !== "EMPLOYEE" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold mb-4">Announcements</h2>
            <ul className="space-y-3">
              {data.announcements.map((a, i) => (
                <li key={i} className="border-b pb-2">
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-gray-600 text-sm">{a.desc}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold mb-4">Schedule Interviews</h2>
            <ul className="space-y-3">
              {data.interviews.map((i, idx) => (
                <li key={idx} className="border-b pb-2">
                  <p className="font-semibold">{i.candidate}</p>
                  <p className="text-gray-600 text-sm">
                    {i.position} - {i.time}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// export default function Dashboard() {
//   // Dummy data (instead of backend API)
//   const dummyData = {
//     totalEmployees: 522,
//     attendanceToday: 500,
//     requestPaidLeave: 15,
//     employeePerformance: [
//       { date: "2025-09-01", closed: 12, target: 15 },
//       { date: "2025-09-02", closed: 18, target: 20 },
//       { date: "2025-09-03", closed: 22, target: 25 },
//       { date: "2025-09-04", closed: 15, target: 20 },
//       { date: "2025-09-05", closed: 30, target: 30 },
//       { date: "2025-09-06", closed: 25, target: 28 },
//     ],
//     employees: [
//       {
//         name: "Aditya Wibowo",
//         role: "Creative Director",
//         jobLevel: "Senior Staff",
//         status: "Active",
//       },
//       {
//         name: "Fahmi Pratama",
//         role: "Project Manager",
//         jobLevel: "Middle Staff",
//         status: "Active",
//       },
//       {
//         name: "Fakhri Boden",
//         role: "Fullstack Developer",
//         jobLevel: "Junior Staff",
//         status: "Paid Leave",
//       },
//     ],
//     announcements: [
//       { title: "Mass Leave", desc: "Collective leave May 1–3, 2024" },
//       { title: "Eid Al-Fitr", desc: "Holiday set for Wed–Thu, Apr 10–11, 2024" },
//       { title: "Birthday Fahmi Pratama", desc: "Fahmi turns 33 today 🎉" },
//       { title: "Birthday Fakhri Boden", desc: "Fakhri turns 28 today 🎉" },
//       { title: "Pay Day", desc: "Salary has been processed, check your account" },
//     ],
//     interviews: [
//       {
//         candidate: "Chiurul Aji",
//         position: "UI/UX Designer",
//         time: "11:00 AM",
//       },
//       {
//         candidate: "Gusto Nusamba",
//         position: "Fullstack Developer",
//         time: "2:00 PM",
//       },
//     ],
//   };

//   const [data, setData] = useState(null);

//   useEffect(() => {
//     // 🔽 Commented backend fetch
//     /*
//     fetch("http://localhost:4000/api/analytics/dashboard", {
//       method: "GET",
//       credentials: "include",
//     })
//       .then((res) => res.json())
//       .then((json) => setData(json))
//       .catch((err) => console.error("Error loading dashboard:", err));
//     */

//     // 🔽 Using dummy data instead
//     setData(dummyData);
//   }, []);

//   if (!data) return <p className="text-center mt-10">Loading dashboard...</p>;

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

//       {/* Top Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div className="bg-white p-6 rounded-2xl shadow">
//           <p className="text-gray-500">Total Employees</p>
//           <h2 className="text-3xl font-bold">{data.totalEmployees}</h2>
//         </div>
//         <div className="bg-white p-6 rounded-2xl shadow">
//           <p className="text-gray-500">Today Attendance</p>
//           <h2 className="text-3xl font-bold">{data.attendanceToday}</h2>
//         </div>
//         <div className="bg-white p-6 rounded-2xl shadow">
//           <p className="text-gray-500">Request Paid Leave</p>
//           <h2 className="text-3xl font-bold">{data.requestPaidLeave}</h2>
//         </div>
//       </div>

//       {/* Employee Performance */}
//       <div className="bg-white p-6 rounded-2xl shadow mb-6">
//         <h2 className="font-semibold mb-4">Employee Performance (Leads)</h2>
//         <ResponsiveContainer width="100%" height={250}>
//           <LineChart data={data.employeePerformance}>
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="closed"
//               stroke="#10b981"
//               strokeWidth={3}
//               dot={{ r: 4 }}
//               name="Closed Leads"
//             />
//             <Line
//               type="monotone"
//               dataKey="target"
//               stroke="#6366f1"
//               strokeWidth={2}
//               strokeDasharray="5 5"
//               dot={{ r: 4 }}
//               name="Target"
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Employee Status */}
//       <div className="bg-white p-6 rounded-2xl shadow mb-6">
//         <h2 className="font-semibold mb-4">Employee Status</h2>
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="border-b">
//               <th className="p-2">Name</th>
//               <th className="p-2">Role</th>
//               <th className="p-2">Job Level</th>
//               <th className="p-2">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.employees.map((emp, i) => (
//               <tr key={i} className="border-b">
//                 <td className="p-2">{emp.name}</td>
//                 <td className="p-2">{emp.role}</td>
//                 <td className="p-2">{emp.jobLevel}</td>
//                 <td className="p-2">
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm ${
//                       emp.status === "Active"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-yellow-100 text-yellow-700"
//                     }`}
//                   >
//                     {emp.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Announcements & Interviews */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Announcements */}
//         <div className="bg-white p-6 rounded-2xl shadow">
//           <h2 className="font-semibold mb-4">Announcements</h2>
//           <ul className="space-y-3">
//             {data.announcements.map((a, i) => (
//               <li key={i} className="border-b pb-2">
//                 <p className="font-semibold">{a.title}</p>
//                 <p className="text-gray-600 text-sm">{a.desc}</p>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Schedule Interviews */}
//         <div className="bg-white p-6 rounded-2xl shadow">
//           <h2 className="font-semibold mb-4">Schedule Interviews</h2>
//           <ul className="space-y-3">
//             {data.interviews.map((i, idx) => (
//               <li key={idx} className="border-b pb-2">
//                 <p className="font-semibold">{i.candidate}</p>
//                 <p className="text-gray-600 text-sm">
//                   {i.position} - {i.time}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }
