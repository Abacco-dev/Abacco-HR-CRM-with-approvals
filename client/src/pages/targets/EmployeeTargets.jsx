// src/targets/EmployeeTargets.jsx
import React, { useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { dummyEmployees } from "./data/dummyData.js";

export default function EmployeeTargets() {
  const [employees, setEmployees] = useState(dummyEmployees);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    target: "",
    todayAchieved: "",
    weeklyAchieved: "",
    totalLeads: "",
    leadEmails: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const emp = {
      id: `e${Date.now()}`,
      name: newEmployee.name || "Unnamed",
      target: Number(newEmployee.target) || 0,
      todayAchieved: Number(newEmployee.todayAchieved) || 0,
      weeklyAchieved: Number(newEmployee.weeklyAchieved) || 0,
      totalLeads: Number(newEmployee.totalLeads) || 0,
      leadEmails: newEmployee.leadEmails || "admin@company.com"
    };
    setEmployees(prev => [emp, ...prev]);
    setNewEmployee({ name: "", target: "", todayAchieved: "", weeklyAchieved: "", totalLeads: "", leadEmails: "" });
  };

  return (
    <div className="min-h-[300px]">
      {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold mb-4">Add Employee (local)</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="name" value={newEmployee.name} onChange={handleChange} placeholder="Employee Name" className="border rounded p-2" />
          <input name="target" value={newEmployee.target} onChange={handleChange} type="number" placeholder="Target" className="border rounded p-2" />
          <input name="totalLeads" value={newEmployee.totalLeads} onChange={handleChange} type="number" placeholder="Total Leads" className="border rounded p-2" />
          <input name="todayAchieved" value={newEmployee.todayAchieved} onChange={handleChange} type="number" placeholder="Today Achieved" className="border rounded p-2" />
          <input name="weeklyAchieved" value={newEmployee.weeklyAchieved} onChange={handleChange} type="number" placeholder="Weekly Achieved" className="border rounded p-2" />
          <input name="leadEmails" value={newEmployee.leadEmails} onChange={handleChange} placeholder="Admin Emails" className="border rounded p-2" />
          <div className="md:col-span-3 flex justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Employee</button>
          </div>
        </form>
      </div> */}

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Employee Performance</h3>
      <ResponsiveContainer width="100%" height={350}>
              <BarChart data={employees}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="target" name="Target" fill="#3b82f6" />
                <Bar dataKey="totalLeads" name="Total Leads" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
    
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Target</th>
                <th className="p-2 border">Today</th>
                <th className="p-2 border">Weekly</th>
                <th className="p-2 border">Total Leads</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{emp.name}</td>
                  <td className="p-2 border">{emp.target}</td>
                  <td className="p-2 border">{emp.todayAchieved}</td>
                  <td className="p-2 border">{emp.weeklyAchieved}</td>
                  <td className="p-2 border">{emp.totalLeads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
