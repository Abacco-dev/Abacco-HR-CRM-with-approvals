// src/targets/index.jsx
import React, { useState } from "react";
import { Bell, TrendingUp, BarChart3 } from "lucide-react";
import { useTargets } from "./hooks/useTargets.js";
import EmployeeTargets from "./EmployeeTargets.jsx";
import TargetOverview from "./TargetOverview.jsx";
import TargetReminders from "./TargetReminders.jsx";
import TargetAnalytics from "./TargetAnalytics.jsx";

const TabButton = ({ id, label, icon: Icon, isActive, onClick, count }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-600 hover:bg-gray-100'}`}
  >
    <Icon size={16} />
    {label}
    {count ? <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">{count}</span> : null}
  </button>
);

export default function Targets() {
  const { reminders } = useTargets();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Target Management</h1>
          <p className="text-gray-600">Set, track, and analyze targets for teams and individuals</p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <TabButton id="overview" label="Overview" icon={BarChart3} isActive={activeTab === 'overview'} onClick={setActiveTab} />
            <TabButton id="employees" label="Employee Targets" icon={TrendingUp} isActive={activeTab === 'employees'} onClick={setActiveTab} />
            <TabButton id="reminders" label="Reminders" icon={Bell} count={reminders.length} isActive={activeTab === 'reminders'} onClick={setActiveTab} />
            <TabButton id="analytics" label="Analytics" icon={TrendingUp} isActive={activeTab === 'analytics'} onClick={setActiveTab} />
          </div>
        </div>

        <div className="transition-all duration-200">
          {activeTab === 'overview' && <TargetOverview />}
          {activeTab === 'employees' && <EmployeeTargets />}
          {activeTab === 'reminders' && <TargetReminders />}
          {activeTab === 'analytics' && <TargetAnalytics />}
        </div>
      </div>
    </div>
  );
}
