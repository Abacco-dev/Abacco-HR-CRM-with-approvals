// src/pages/EmployeeTable.jsx
import React from "react";
import { User, Mail, Briefcase, Building2 } from "lucide-react";

export default function EmployeeTable({ employees = [], role }) {
  if (!Array.isArray(employees)) {
    console.error("Invalid employees data:", employees);
    return (
      <div className="bg-white shadow rounded-xl p-6 mt-6 text-center text-gray-500">
        Invalid employee data.
      </div>
    );
  }

  if (!employees.length) {
    return (
      <div className="bg-white shadow rounded-xl p-6 mt-6 text-center text-gray-500">
        No employees found.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 mt-6 overflow-x-auto border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
        <User className="w-5 h-5 text-blue-500" />
        Employee Directory
      </h2>

      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold">Department</th>
            <th className="px-4 py-3 font-semibold">Role</th>
            <th className="px-4 py-3 font-semibold">Job Title</th>
            {role !== "EMPLOYEE" && <th className="px-4 py-3 font-semibold text-center">Status</th>}
          </tr>
        </thead>

        <tbody>
          {employees.map((emp, index) => {
            const profile = emp.profile || {};
            const rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-50";
            return (
              <tr
                key={emp.id}
                className={`${rowBg} hover:bg-blue-50 transition-colors duration-150`}
              >
                {/* Name & Avatar */}
                <td className="px-4 py-3 font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 text-blue-700 flex items-center justify-center rounded-full text-sm font-semibold">
                      {emp.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 capitalize">
                        {emp.name || "—"}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {emp.id || "N/A"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm truncate">{emp.email || "—"}</span>
                  </div>
                </td>

                {/* Department */}
                <td className="px-4 py-3 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{profile.department || "—"}</span>
                  </div>
                </td>

                {/* Role */}
                <td className="px-4 py-3 text-gray-700 font-medium">
                  {emp.role || "—"}
                </td>

                {/* Job Title */}
                <td className="px-4 py-3 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{profile.jobTitle || "—"}</span>
                  </div>
                </td>

                {/* Status */}
                {role !== "EMPLOYEE" && (
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${emp.role === "INACTIVE"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-700"
                        }`}
                    >
                      {emp.role === "INACTIVE" ? "Inactive" : "Active"}
                    </span>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
