// src/targets/TargetReminders.jsx
import React from "react";
import { Bell, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { dummyTargets } from "./data/dummyData.js";

export default function TargetReminders() {
  const overdue = dummyTargets.filter(t => t.status === "overdue" || (t.reminders || []).some(r => !r.sent && r.date <= new Date().toISOString().split("T")[0]));
  const upcoming = dummyTargets.filter(t => (t.reminders || []).some(r => !r.sent && r.date > new Date().toISOString().split("T")[0]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Automated Reminders</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Bell size={16} /> Configure Alerts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Overdue Targets</h3>
              <p className="text-sm text-gray-600">{overdue.length} targets need immediate attention</p>
            </div>
          </div>

          {overdue.slice(0,3).map(t => (
            <div key={t.id} className="p-3 bg-red-50 rounded-lg mb-2">
              <p className="font-medium text-red-900 text-sm">{t.title}</p>
              <p className="text-red-700 text-xs">Due: {t.deadline}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Upcoming Deadlines</h3>
              <p className="text-sm text-gray-600">Targets with reminders scheduled soon</p>
            </div>
          </div>

          {upcoming.slice(0,3).map(t => (
            <div key={t.id} className="p-3 bg-yellow-50 rounded-lg mb-2">
              <p className="font-medium text-yellow-900 text-sm">{t.title}</p>
              <p className="text-yellow-700 text-xs">Check reminders</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Recent Completions</h3>
              <p className="text-sm text-gray-600">Targets recently completed</p>
            </div>
          </div>

          {dummyTargets.filter(t => t.status === "completed").slice(0,3).map(t => (
            <div key={t.id} className="p-3 bg-green-50 rounded-lg mb-2">
              <p className="font-medium text-green-900 text-sm">{t.title}</p>
              <p className="text-green-700 text-xs">Completed: {t.createdDate}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reminder Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">50% Progress Reminder</p>
              <p className="text-sm text-gray-600">Send reminder when target reaches 50% completion</p>
            </div>
            <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">7-Day Deadline Warning</p>
              <p className="text-sm text-gray-600">Alert 7 days before deadline</p>
            </div>
            <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Overdue Notifications</p>
              <p className="text-sm text-gray-600">Daily reminders for overdue targets</p>
            </div>
            <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}
