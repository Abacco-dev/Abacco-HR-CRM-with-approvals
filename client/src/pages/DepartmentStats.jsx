import React from "react";

export default function DepartmentStats({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Department Stats</h2>
      <div className="space-y-4">
        {data.slice(0, 6).map((dept, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{dept.department}</span>
              <span className="text-xs font-semibold text-gray-900">{dept.count}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                  style={{ width: `${dept.performance}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-gray-600">{dept.performance}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
