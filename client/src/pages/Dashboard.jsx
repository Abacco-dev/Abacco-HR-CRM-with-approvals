// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Users, Calendar, UserCheck, Briefcase } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import StatCard from "../pages/StatCard";
import PerformanceChart from "../pages/PerformanceChart";
import DepartmentStats from "../pages/DepartmentStats";
import EmployeeTable from "../pages/EmployeeTable";
import AnnouncementsAndInterviews from "./AnnouncementsAndInterviews";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Dashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [overview, setOverview] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    attendanceRate: 0,
    pendingLeaveRequests: 0,
    newHires: 0,
    openPositions: 0,
  });

  const isAdminOrHR = user.role === "ADMIN" || user.role === "HR";

  // ✅ Centralized fetch helper
  const fetchAPI = async (endpoint) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed ${endpoint}: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`❌ Error fetching ${endpoint}:`, err);
      return null;
    }
  };

  // ✅ Fetch all dashboard data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch main data sets
        const [empRes, leaveRes, perfRes, dashboardRes] = await Promise.all([
          fetchAPI("/api/employees"),
          fetchAPI("/api/leaves"),
          fetchAPI("/api/performance/reviews"), // ✅ fixed
          fetchAPI("/api/analytics/dashboard"),  // ✅ now contains announcements + interviews
        ]);

        // ✅ Parse data safely
        const empList = Array.isArray(empRes) ? empRes : empRes?.data || [];
        const leaveList = Array.isArray(leaveRes) ? leaveRes : leaveRes?.data || [];

        setEmployees(empList);
        setLeaves(leaveList);
        setPerformanceData(perfRes || []);

        // ✅ Extract dashboard values
        setAnnouncements(dashboardRes?.announcements || []);
        setInterviews(dashboardRes?.interviews || []);
        setDepartmentStats(dashboardRes?.departmentStats || []); // optional placeholder

        calculateOverview(empList, leaveList);
      } catch (err) {
        console.error("Dashboard data error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ✅ Overview calculation from real data
  const calculateOverview = (empList, leaveList) => {
    const total = empList?.length || 0;
    const active = empList?.filter((e) => e.role !== "INACTIVE")?.length || 0;
    const attendanceRate = total > 0 ? Math.round((active / total) * 100) : 0;
    const pendingLeaveRequests =
      leaveList?.filter((l) => l.status === "PENDING")?.length || 0;
    const newHires = Math.floor(total * 0.05);

    setOverview({
      totalEmployees: total,
      activeEmployees: active,
      attendanceRate,
      pendingLeaveRequests,
      newHires,
      openPositions: 12, // later can be replaced with API-driven data
    });
  };

  // ✅ Role-based employee visibility
  const visibleEmployees =
    user.role === "EMPLOYEE"
      ? employees.filter((emp) => emp.email === user.email)
      : employees;

  if (loading)
    return <p className="p-8 text-gray-500 text-center">Loading dashboard...</p>;

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.role === "EMPLOYEE" ? "My Dashboard" : "HR Dashboard"}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome back, {user.name}
            </p>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 max-w-7xl mx-auto">
          {isAdminOrHR && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard
                title="Total Employees"
                value={overview.totalEmployees}
                subtitle={`${overview.activeEmployees} active`}
                icon={Users}
                color="bg-blue-500"
                trend="+2 this month"
              />
              <StatCard
                title="Attendance Rate"
                value={`${overview.attendanceRate}%`}
                subtitle="Today's attendance"
                icon={UserCheck}
                color="bg-green-500"
                trend="+1.2%"
              />
              <StatCard
                title="Leave Requests"
                value={overview.pendingLeaveRequests}
                subtitle="Pending approval"
                icon={Calendar}
                color="bg-orange-500"
              />
              <StatCard
                title="Open Positions"
                value={overview.openPositions}
                subtitle={`${overview.newHires} new hires`}
                icon={Briefcase}
                color="bg-purple-500"
              />
            </div>
          )}

          {/* Charts and sections */}
          <PerformanceChart data={performanceData} />

          {isAdminOrHR && (
            <>
              <DepartmentStats data={departmentStats} />
              <AnnouncementsAndInterviews
                data={{ announcements, upcomingInterviews: interviews }}
              />
            </>
          )}

          <EmployeeTable employees={visibleEmployees} role={user.role} />
        </div>
      </div>
    </>
  );
}





// import React, { useState, useEffect } from "react";
// import { Users, Calendar, Clock, UserCheck, Briefcase } from "lucide-react";
// import { useAuth } from "../contexts/AuthContext.jsx";
// import StatCard from "../pages/StatCard";
// import PerformanceChart from "../pages/PerformanceChart";
// import DepartmentStats from "../pages/DepartmentStats";
// import EmployeeTable from "../pages/EmployeeTable";
// import AnnouncementsAndInterviews from "./AnnouncementsAndInterviews";

// // 🔑 User Authentication - Replace with actual auth context
// const loggedInUser = {
//   role: "ADMIN", // Options: "ADMIN" | "HR" | "EMPLOYEE"
// };

// // --------- Dummy Data ---------
// const dummyData = {
//   overview: {
//     totalEmployees: 522,
//     activeEmployees: 500,
//     attendanceRate: 95.8,
//     pendingLeaveRequests: 15,
//     newHires: 8,
//     openPositions: 12,
//   },
//   performanceMetrics: [
//     { month: "Apr", closed: 145, target: 150, efficiency: 96 },
//     { month: "May", closed: 178, target: 180, efficiency: 98 },
//     { month: "Jun", closed: 165, target: 170, efficiency: 97 },
//     { month: "Jul", closed: 192, target: 200, efficiency: 96 },
//     { month: "Aug", closed: 210, target: 210, efficiency: 100 },
//     { month: "Sep", closed: 198, target: 200, efficiency: 99 },
//   ],
//   departmentStats: [
//     { department: "Sales", count: 145, performance: 94 },
//     { department: "Marketing", count: 78, performance: 91 },
//     // { department: "Developing", count: 120, performance: 95 },
//     // { department: "HR", count: 32, performance: 88 },
//     // { department: "Finance", count: 45, performance: 92 },
//     // { department: "Operations", count: 66, performance: 89 },
//   ],
//   employees: [
//     {
//       id: "EMP002",
//       name: "Aditya Wibowo",
//       role: "Creative Director",
//       department: "Marketing",
//       jobLevel: "Senior Staff",
//       status: "Active",
//       avatar: "AW",
//       totalLeads: 120,
//       pendingLeads: 5,
//       loginTime: "09:10 AM",
//       performance: 96,
//     },
//     {
//       id: "EMP003",
//       name: "Fahmi Pratama",
//       role: "Project Manager",
//       department: "Developing",
//       jobLevel: "Middle Staff",
//       status: "Active",
//       avatar: "FP",
//       totalLeads: 95,
//       pendingLeads: 10,
//       loginTime: "09:20 AM",
//       performance: 92,
//     },
//     {
//       id: "EMP001",
//       name: "Fakhri Boden",
//       role: "Fullstack Developer",
//       department: "Developing",
//       jobLevel: "Junior Staff",
//       status: "On Leave",
//       avatar: "FB",
//       totalLeads: 40,
//       pendingLeads: 8,
//       loginTime: "On Leave",
//       performance: 88,
//     },
//     {
//       id: "EMP004",
//       name: "Sarah Mitchell",
//       role: "Sales Executive",
//       department: "Sales",
//       jobLevel: "Middle Staff",
//       status: "Active",
//       avatar: "SM",
//       totalLeads: 87,
//       pendingLeads: 6,
//       loginTime: "08:45 AM",
//       performance: 94,
//     },
//     {
//       id: "EMP005",
//       name: "David Chen",
//       role: "HR Manager",
//       department: "HR",
//       jobLevel: "Senior Staff",
//       status: "Active",
//       avatar: "DC",
//       totalLeads: 65,
//       pendingLeads: 3,
//       loginTime: "09:00 AM",
//       performance: 89,
//     },
//   ],
//   announcements: [
//     {
//       id: 1,
//       title: "Company-Wide Town Hall Meeting",
//       desc: "Join us for Q3 review and Q4 planning on Oct 15, 2025",
//       date: "2025-10-15",
//       priority: "high",
//     },
//     {
//       id: 2,
//       title: "Mass Leave Period",
//       desc: "Collective leave scheduled for Dec 24-26, 2025",
//       date: "2025-12-24",
//       priority: "medium",
//     },
//     {
//       id: 3,
//       title: "New Health Benefits",
//       desc: "Enhanced health insurance coverage starting Nov 1",
//       date: "2025-11-01",
//       priority: "high",
//     },
//     {
//       id: 4,
//       title: "Team Building Event",
//       desc: "Annual retreat scheduled for Nov 20-22, 2025",
//       date: "2025-11-20",
//       priority: "low",
//     },
//   ],
//   upcomingInterviews: [
//     {
//       id: 1,
//       candidate: "Chiurul Aji",
//       position: "UI/UX Designer",
//       department: "Design",
//       time: "11:00 AM",
//       date: "2025-10-06",
//       interviewer: "Aditya Wibowo",
//       type: "Technical Round",
//     },
//     {
//       id: 3,
//       candidate: "Lisa Anderson",
//       position: "Sales Manager",
//       department: "Sales",
//       time: "10:00 AM",
//       date: "2025-10-07",
//       interviewer: "Sarah Mitchell",
//       type: "HR Round",
//     },
//   ],
// };

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [data, setData] = useState(dummyData); // Using dummy data directly

//   // Uncomment for future backend integration
//   /*
//   useEffect(() => {
//     import("../pages/targets/data/dummyData")
//       .then((module) => setData(module.default))
//       .catch((err) => console.error("Error loading dummy data:", err));
//   }, []);
//   */

//   const visibleEmployees =
//     user.role === "EMPLOYEE"
//       ? data.employees.filter((emp) => emp.id === user.id)
//       : data.employees;

//   const isAdminOrHR = user.role === "ADMIN" || user.role === "HR";

//   return (
//     <>
//       <header className=" bg-white border-b border-gray-200 sticky top-0 z-10 ">
//         <div className="px-6 py-4 flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               {user.role === "EMPLOYEE" ? "My Dashboard" : "HR Dashboard"}
//             </h1>
//             <p className="text-sm text-gray-600 mt-1">
//               Welcome back, {user.name}
//             </p>
//           </div>
//         </div>
//       </header>
//       <div className="min-h-screen bg-gray-50">
//         <div className="p-6 max-w-7xl mx-auto">
//           {isAdminOrHR && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//               <StatCard
//                 title="Total Employees"
//                 value={data.overview.totalEmployees}
//                 subtitle={`${data.overview.activeEmployees} active`}
//                 icon={Users}
//                 color="bg-blue-500"
//                 trend="+12 this month"
//               />
//               <StatCard
//                 title="Attendance Rate"
//                 value={`${data.overview.attendanceRate}%`}
//                 subtitle="Today's attendance"
//                 icon={UserCheck}
//                 color="bg-green-500"
//                 trend="+2.4%"
//               />
//               <StatCard
//                 title="Leave Requests"
//                 value={data.overview.pendingLeaveRequests}
//                 subtitle="Pending approval"
//                 icon={Calendar}
//                 color="bg-orange-500"
//               />
//               <StatCard
//                 title="Open Positions"
//                 value={data.overview.openPositions}
//                 subtitle={`${data.overview.newHires} new hires`}
//                 icon={Briefcase}
//                 color="bg-purple-500"
//               />
//             </div>
//           )}

//           <PerformanceChart data={data.performanceMetrics} />

//           {isAdminOrHR && <DepartmentStats data={data.departmentStats} />}

//           <EmployeeTable employees={visibleEmployees} role={loggedInUser.role} />

//           {isAdminOrHR && <AnnouncementsAndInterviews data={data} />}
//         </div>
//       </div>
//     </>
//   );
// }






// // import React, { useState, useEffect } from "react";
// // import { Users, Calendar, Clock, UserCheck, Briefcase } from "lucide-react";
// // import StatCard from "../pages/StatCard";
// // import PerformanceChart from "../pages/PerformanceChart";
// // import DepartmentStats from "../pages/DepartmentStats";
// // import EmployeeTable from "../pages/EmployeeTable";
// // import AnnouncementsAndInterviews from "./AnnouncementsAndInterviews";

// // // 🔑 User Authentication - Replace with actual auth context
// // const loggedInUser = {
// //   role: "ADMIN", // Options: "ADMIN" | "HR" | "EMPLOYEE"
// //   name: "Fakhri Boden",
// //   id: "EMP001",
// // };

// // export default function Dashboard() {
// //   const [data, setData] = useState(null);

// //   useEffect(() => {
// //     // Replace with API call in real project
// //     import("../pages/targets/data/dummyData").then((module) => setData(module.default));
// //   }, []);

// //   if (!data) return <p>Loading dashboard...</p>;

// //   const visibleEmployees =
// //     loggedInUser.role === "EMPLOYEE"
// //       ? data.employees.filter((emp) => emp.id === loggedInUser.id)
// //       : data.employees;

// //   const isAdminOrHR = loggedInUser.role === "ADMIN" || loggedInUser.role === "HR";

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* Header */}
// //       <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
// //         <div className="px-6 py-4 flex items-center justify-between">
// //           <div>
// //             <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
// //             <p className="text-sm text-gray-600 mt-1">Welcome back, {loggedInUser.name}</p>
// //           </div>
// //         </div>
// //       </header>

// //       <div className="p-6 max-w-7xl mx-auto">
// //         {isAdminOrHR && (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
// //             <StatCard
// //               title="Total Employees"
// //               value={data.overview.totalEmployees}
// //               subtitle={`${data.overview.activeEmployees} active`}
// //               icon={Users}
// //               color="bg-blue-500"
// //               trend="+12 this month"
// //             />
// //             <StatCard
// //               title="Attendance Rate"
// //               value={`${data.overview.attendanceRate}%`}
// //               subtitle="Today's attendance"
// //               icon={UserCheck}
// //               color="bg-green-500"
// //               trend="+2.4%"
// //             />
// //             <StatCard
// //               title="Leave Requests"
// //               value={data.overview.pendingLeaveRequests}
// //               subtitle="Pending approval"
// //               icon={Calendar}
// //               color="bg-orange-500"
// //             />
// //             <StatCard
// //               title="Open Positions"
// //               value={data.overview.openPositions}
// //               subtitle={`${data.overview.newHires} new hires`}
// //               icon={Briefcase}
// //               color="bg-purple-500"
// //             />
// //           </div>
// //         )}

// //         <PerformanceChart data={data.performanceMetrics} />

// //         {isAdminOrHR && <DepartmentStats data={data.departmentStats} />}

// //         <EmployeeTable employees={visibleEmployees} role={loggedInUser.role} />

// //         {isAdminOrHR && <AnnouncementsAndInterviews data={data} />}
// //       </div>
// //     </div>
// //   );
// // }
