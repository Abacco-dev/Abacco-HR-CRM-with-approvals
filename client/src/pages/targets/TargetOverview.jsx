// src/targets/TargetOverview.jsx
import React from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import { progressData, categoryData } from "./data/dummyData.js";
import TargetList from "./TargetList.jsx";
import { dummyTargets } from "./data/dummyData.js";
import { CheckCircle, Target } from "lucide-react";

const StatCard = ({ title, value, change, trend, icon: Icon, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <span className={`text-sm px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
        {change}
      </span>
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  </div>
);

export default function TargetOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Targets" value="37" change="+5 this month" trend="up" icon={Target} color="bg-blue-500" />
        <StatCard title="Completed" value="12" change="32% completion" trend="up" icon={CheckCircle} color="bg-green-500" />
        <StatCard title="In Progress" value="18" change="Avg 68% progress" trend="stable" icon={CheckCircle} color="bg-yellow-500" />
        <StatCard title="At Risk" value="7" change="Need attention" trend="down" icon={CheckCircle} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Target vs Achievement Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [value.toLocaleString(), '']} />
              <Area type="monotone" dataKey="target" stackId="1" stroke="#E5E7EB" fill="#F3F4F6" name="Target" />
              <Area type="monotone" dataKey="revenue" stackId="2" stroke="#3B82F6" fill="#DBEAFE" name="Achievement" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Targets by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                {categoryData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Progress Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [value.toLocaleString(), '']} />
            <Bar dataKey="target" fill="#E5E7EB" name="Target" />
            <Bar dataKey="revenue" fill="#3B82F6" name="Achievement" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Targets</h2>
        <TargetList targets={dummyTargets} />
      </div>
    </div>
  );
}
