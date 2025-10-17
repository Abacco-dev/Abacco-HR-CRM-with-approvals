import { Calendar, Users, Edit, Eye } from "lucide-react"

export default function GoalCard({ goal }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{goal.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {goal.startDate} - {goal.endDate}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} />
              {goal.assignedTo}
            </span>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            goal.status === "completed"
              ? "bg-green-100 text-green-700"
              : goal.status === "in_progress"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {goal.status.replace("_", " ")}
        </span>
      </div>
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{goal.progress}%</span>
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
          <Edit size={14} />
          Edit
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
          <Eye size={14} />
          View
        </button>
      </div>
    </div>
  )
}
