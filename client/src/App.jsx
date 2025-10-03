// App.jsx
import React from "react";
import { Routes, Route, Navigate, Link, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import EmployeesList from "./pages/employees/EmployeesList";
import EmployeeDetail from "./pages/employees/EmployeeDetail";
import Teams from "./pages/teams/Teams";
import Targets from "./pages/targets/Targets";
import Performance from "./pages/performance/Performance";
import Attendance from "./pages/attendance/Attendance";
import Training from "./pages/training/Training";
import Recruitment from "./pages/recruitment/Recruitment";
import Engagement from "./pages/engagement/Engagement";
import Compensation from "./pages/compensation/Compensation";
import Analytics from "./pages/analytics/Analytics";
import Settings from "./pages/settings/Settings";
import Approvals from "./pages/Approvals";
import Automation from "./pages/automation/Automation"

// ProtectedLayout Component
function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// Layout Component
function Layout() {
  const { user, logout } = useAuth();

  const menu = [
    { to: "/", label: "Dashboard", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { to: "/employees", label: "Employees", roles: ["ADMIN", "MANAGER"] },
    { to: "/teams", label: "Teams", roles: ["ADMIN", "MANAGER"] },
    { to: "/targets", label: "Targets", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { to: "/performance", label: "Performance", roles: ["ADMIN","MANAGER"] },
    { to: "/attendance", label: "Attendance", roles: ["ADMIN","MANAGER"] },
    { to: "/training", label: "Training", roles: ["ADMIN","MANAGER","EMPLOYEE"] },
    { to: "/recruitment", label: "Recruitment", roles: ["ADMIN","MANAGER"] },
    { to: "/engagement", label: "Engagement", roles: ["ADMIN","MANAGER"] },
    { to: "/compensation", label: "Compensation", roles: ["ADMIN","MANAGER"] },
    { to: "/analytics", label: "Analytics", roles: ["ADMIN","MANAGER"] },
    { to: "/settings", label: "Settings", roles: ["ADMIN"] },
    { to: "/approvals", label: "Approvals", roles: ["ADMIN"] },
    { to: "/automation", label: "Integration & Automation", roles: ["ADMIN"] },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r">
        <div className="p-4 font-bold text-xl">Abacco HR CRM</div>
        <nav className="flex flex-col gap-1 p-2">
          {menu
            .filter((m) => m.roles.includes(user.role))
            .map(({ to, label }) => (
              <Link
                key={to}
                className="px-3 py-2 rounded hover:bg-gray-100"
                to={to}
              >
                {label}
              </Link>
            ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">
        <div className="flex justify-end gap-3 mb-4">
          <span className="badge">
            {user?.name} ({user?.role})
          </span>
          <button className="btn" onClick={logout}>
            Logout
          </button>
        </div>

        {/* Nested pages render here */}
        <Outlet />
      </main>
    </div>
  );
}

// App Component
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedLayout />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<EmployeesList />} />
            <Route path="employees/:id" element={<EmployeeDetail />} />
            <Route path="teams" element={<Teams />} />
            <Route path="targets" element={<Targets />} />
            <Route path="performance" element={<Performance />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="training" element={<Training />} />
            <Route path="recruitment" element={<Recruitment />} />
            <Route path="engagement" element={<Engagement />} />
            <Route path="compensation" element={<Compensation />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="approvals" element={<Approvals />} />
             <Route path="automation" element={<Automation />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}
