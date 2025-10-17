import React from "react";
import { Clock } from "lucide-react";

export default function EmployeeTable({ employees, role }) {
  const isAdminOrHR = role === "ADMIN" || role === "HR";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {role === "EMPLOYEE" ? "My Profile" : "Employee Directory"}
          </h2>
          <p className="text-sm text-gray-500">Current status and performance metrics</p>
        </div>
        {isAdminOrHR && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            View All Employees
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Employee</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Department</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Level</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Leads</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Performance</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Login</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {emp.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.role}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">{emp.department}</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{emp.jobLevel}</span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    emp.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>{emp.status}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">{emp.totalLeads}</span>
                    <span className="text-gray-500"> / </span>
                    <span className="text-orange-600">{emp.pendingLeads} pending</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                      <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: `${emp.performance}%` }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700">{emp.performance}%</span>
                  </div>
                </td>
                <td className="py-4 px-4 flex items-center gap-2 text-sm text-gray-600"><Clock className="w-4 h-4" />{emp.loginTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
