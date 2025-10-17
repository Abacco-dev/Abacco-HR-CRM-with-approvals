// src/targets/TargetAnalytics.jsx
import React from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import { statusData } from "./data/dummyData.js";

export default function TargetAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Target Analytics</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Rate by Team</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { team: 'Sales', achievement: 85, target: 100 },
              { team: 'Marketing', achievement: 92, target: 100 },
              { team: 'Development', achievement: 78, target: 100 },
              { team: 'HR', achievement: 100, target: 100 },
              { team: 'Operations', achievement: 65, target: 100 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="achievement" fill="#3B82F6" />
              <Bar dataKey="target" fill="#E5E7EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} dataKey="count" label={({ name, count }) => `${name}: ${count}`}>
                {statusData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
