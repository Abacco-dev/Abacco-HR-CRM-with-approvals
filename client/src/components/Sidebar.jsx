// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menu = [
    { to: "/", label: "Dashboard", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { to: "/teams", label: "Teams", roles: ["ADMIN", "MANAGER"] },
    { to: "/targets", label: "Targets", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { to: "/performance", label: "Performance", roles: ["ADMIN", "MANAGER"] },
    { to: "/attendance", label: "Attendance", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { to: "/training", label: "Training", roles: ["ADMIN", "MANAGER", "EMPLOYEE"] },
    { to: "/recruitment", label: "Recruitment", roles: ["ADMIN", "MANAGER"] },
    // { to: "/engagement", label: "Engagement", roles: ["ADMIN", "MANAGER"] },
    // { to: "/compensation", label: "Compensation", roles: ["ADMIN", "MANAGER"] },
    { to: "/analytics", label: "Analytics", roles: ["ADMIN", "MANAGER"] },
    // { to: "/settings", label: "Settings", roles: ["ADMIN"] },
    { to: "/approvals", label: "Approvals", roles: ["ADMIN"] },
    { to: "/automation", label: "Integration & Automation", roles: ["ADMIN"] },
  ];

  return (
    <aside
      className="w-64 bg-white border-r fixed top-0 left-0 h-screen flex flex-col justify-between"
      style={{ overflow: "hidden" }}
    >
      {/* Top Section */}
      <div>
        <div className="p-4 font-bold text-xl border-b">Abacco HR CRM</div>

        <nav className="flex flex-col gap-1 p-2 overflow-y-auto">
          {menu
            .filter((m) => m.roles.includes(user.role))
            .map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 rounded hover:bg-gray-100 transition-colors ${
                  location.pathname === to ? "bg-gray-200 font-semibold" : ""
                }`}
              >
                {label}
              </Link>
            ))}
        </nav>
      </div>

      {/* Bottom Section (User info + Logout) */}
      <div className="border-t p-3 text-center">
        <div className="text-sm text-gray-600 mb-2">
          {user?.name} ({user?.role})
        </div>
        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
