import React, { useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from "recharts";
import { Trophy, TrendingUp, Users, Target } from "lucide-react";

// Sample data - replace with your actual dummyEmployees import
const dummyEmployees = [
  { id: 1, name: "John Doe", target: 60, todayAchieved: 5, weeklyAchieved: 19, totalLeads: 45 },
  { id: 2, name: "Jane Smith", target: 60, todayAchieved: 5, weeklyAchieved: 15, totalLeads: 20 },
  { id: 3, name: "Mike Johnson", target: 70, todayAchieved: 3, weeklyAchieved: 10, totalLeads: 13 },
  { id: 4, name: "Sarah Williams", target: 60, todayAchieved: 2, weeklyAchieved: 10, totalLeads: 12 },
  { id: 5, name: "David Brown", target: 30, todayAchieved: 0, weeklyAchieved: 5, totalLeads: 30 },
];

export default function EmployeeTargets() {
  const [employees] = useState(dummyEmployees);

  // Calculate summary stats
  const totalTarget = employees.reduce((sum, emp) => sum + emp.target, 0);
  const totalAchieved = employees.reduce((sum, emp) => sum + emp.totalLeads, 0);
  const avgPerformance = ((totalAchieved / (totalTarget )) * 100).toFixed(1);
  const topPerformer = employees.reduce((max, emp) => 
    emp.totalLeads > max.totalLeads ? emp : max
  );

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{payload[0].payload.name}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
          <p className="text-xs text-gray-500 mt-2 pt-2 border-t">
            Achievement: {((payload[1].value / payload[0].value) * 100).toFixed(0)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Get color based on performance
  const getPerformanceColor = (achieved, target) => {
    const percentage = (achieved / target) * 100;
    if (percentage >= 90) return "text-green-600 bg-green-50";
    if (percentage >= 70) return "text-green-600 bg-green-10";
    if (percentage >= 50) return "text-blue-600 bg-blue-50";
    if (percentage >= 30) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getBarColor = (value, target) => {
    const percentage = (value / target) * 100;
    if (percentage >= 90) return "#2B7A0B";
    if (percentage >= 70) return "#08CB00";
    if (percentage >= 50) return "#f59e0b";
    if (percentage >= 30) return "#FF9A00";
    return "#ef4444";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
            <p className="text-gray-600 mt-1">Track team targets and achievements</p>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="text-sm opacity-90">Team Performance</div>
            <div className="text-2xl font-bold">{avgPerformance}%</div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Team</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Target</p>
                <p className="text-2xl font-bold text-gray-900">{totalTarget}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{totalAchieved}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-5 shadow-md hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white opacity-90 mb-1">Top Performer</p>
                <p className="text-lg font-bold text-white">{topPerformer.name}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Employee Performance</h3>
              <p className="text-gray-600 mt-1">Target vs Total Leads comparison</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Target</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Achieved</span>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={employees} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C00FE" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#7C00FE" stopOpacity={1}/>
                </linearGradient>
                <linearGradient id="colorAchieved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
              <Bar 
                dataKey="target" 
                name="Target" 
                fill="url(#colorTarget)" 
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
              <Bar 
                dataKey="totalLeads" 
                name="Total Leads" 
                fill="url(#colorAchieved)" 
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              >
                {employees.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.totalLeads, entry.target)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h3 className="text-xl font-bold text-white">Detailed Performance Metrics</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Employee Name</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">Target</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">Today</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">Weekly</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">Total Leads</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">Performance</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => {
                  const performancePercent = ((emp.totalLeads / (emp.target )) * 100).toFixed(0);
                  return (
                    <tr 
                      key={emp.id} 
                      className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      <td className="p-4 text-gray-700 font-medium">{idx + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-semibold">
                            {emp.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{emp.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                          {emp.target}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
                          {emp.todayAchieved}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700">
                          {emp.weeklyAchieved}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                          {emp.totalLeads}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getPerformanceColor(emp.totalLeads, emp.target * 4.5)}`}>
                          {performancePercent}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}