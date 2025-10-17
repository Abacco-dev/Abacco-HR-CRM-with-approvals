// src/targets/TargetCard.jsx
import React from "react";
import { Calendar, Users, AlertTriangle, Eye } from "lucide-react";

export default function TargetCard({ target, onView }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "at_risk": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{target.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(target.status)}`}>
              {target.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{target.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {target.deadline}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} />
              {target.assignedTo}
            </span>
            <span className={`flex items-center gap-1 ${getPriorityColor(target.priority)}`}>
              <AlertTriangle size={12} />
              {target.priority} priority
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">
            {target.achievedValue.toLocaleString()} / {target.targetValue.toLocaleString()}
            <span className="text-gray-500 ml-1">({target.progress}%)</span>
          </span>
        </div>
        <div className="bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${target.progress >= 100 ? 'bg-green-500' :
              target.progress >= 75 ? 'bg-blue-500' :
                target.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            style={{ width: `${Math.min(target.progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onView && onView(target)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
        >
          <Eye size={14} />
          View Details
        </button>
      </div>
    </div>
  );
}
