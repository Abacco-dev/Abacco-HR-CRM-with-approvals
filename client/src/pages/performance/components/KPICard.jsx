import { TrendingUp } from "lucide-react"

export default function KPICard({ name, value, target, trend, change }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
            trend === "up"
              ? "bg-green-100 text-green-700"
              : trend === "down"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <TrendingUp size={12} />
          {change}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">/ {target}</span>
      </div>
      <div className="mt-3 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            value >= target ? "bg-green-500" : "bg-blue-500"
          }`}
          style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
        />
      </div>
    </div>
  )
}
