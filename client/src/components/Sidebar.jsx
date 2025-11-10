// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Target,
  BarChart3,
  CalendarCheck,
  GraduationCap,
  Briefcase,
  LineChart,
  CheckSquare,
  Workflow,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menu = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} />, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { to: "/teams", label: "Teams", icon: <Users size={18} />, roles: ["ADMIN", "MANAGER"] },
    { to: "/targets", label: "Targets", icon: <Target size={18} />, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    // { to: "/performance", label: "Performance", icon: <BarChart3 size={18} />, roles: ["ADMIN", "MANAGER"] },
    { to: "/attendance", label: "Attendance", icon: <CalendarCheck size={18} />, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { to: "/training", label: "Training", icon: <GraduationCap size={18} />, roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { to: "/recruitment", label: "Recruitment", icon: <Briefcase size={18} />, roles: ["ADMIN", "MANAGER"] },
    { to: "/analytics", label: "Analytics", icon: <LineChart size={18} />, roles: ["ADMIN", "MANAGER"] },
    { to: "/approvals", label: "Approvals", icon: <CheckSquare size={18} />, roles: ["ADMIN"] },
    // { to: "/automation", label: "Integration & Automation", icon: <Workflow size={18} />, roles: ["ADMIN"] },
  ];

  return (
    <aside
      className="w-64 bg-white border-r fixed top-0 left-0 h-screen flex flex-col"
      style={{
        overflowY: "auto",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
      }}
      // Hide scrollbar for Chrome, Safari, Edge
      onWheel={(e) => {
        const el = e.currentTarget;
        el.scrollTop += e.deltaY;
      }}
    >
      <style>
        {`
          aside::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      {/* Header */}
      <div className="p-4 font-bold text-xl border-b">Abacco HR CRM</div>

      {/* Scrollable Menu */}
      <nav className="flex-1 p-2">
        {menu
          .filter((m) => m.roles.includes(user.role))
          .map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${location.pathname === to
                  ? "bg-gray-200 font-semibold text-gray-800"
                  : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
      </nav>

      {/* Fixed Bottom Section */}
      <div className="border-t p-3 text-center bg-white sticky bottom-0">
        <div className="text-sm text-gray-600 mb-2 truncate">
          {user?.name} ({user?.role})
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
