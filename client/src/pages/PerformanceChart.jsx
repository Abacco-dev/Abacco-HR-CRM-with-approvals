import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function PerformanceChart() {
  // ✅ Dummy Data (replace later with backend data)
  const yearlyData = {
    2023: [
      { month: "Jan", closed: 20, target: 30 },
      { month: "Feb", closed: 25, target: 35 },
      { month: "Mar", closed: 22, target: 32 },
      { month: "Apr", closed: 28, target: 40 },
      { month: "May", closed: 26, target: 38 },
      { month: "Jun", closed: 30, target: 42 },
      { month: "Jul", closed: 29, target: 40 },
      { month: "Aug", closed: 34, target: 45 },
      { month: "Sep", closed: 36, target: 46 },
      { month: "Oct", closed: 40, target: 50 },
      { month: "Nov", closed: 45, target: 52 },
      { month: "Dec", closed: 50, target: 55 },
    ],
    2024: [
      { month: "Jan", closed: 32, target: 35 },
      { month: "Feb", closed: 38, target: 40 },
      { month: "Mar", closed: 34, target: 38 },
      { month: "Apr", closed: 40, target: 42 },
      { month: "May", closed: 42, target: 44 },
      { month: "Jun", closed: 46, target: 48 },
      { month: "Jul", closed: 45, target: 50 },
      { month: "Aug", closed: 50, target: 52 },
      { month: "Sep", closed: 48, target: 50 },
      { month: "Oct", closed: 52, target: 55 },
      { month: "Nov", closed: 54, target: 58 },
      { month: "Dec", closed: 60, target: 62 },
    ],
    2025: [
      { month: "Jan", closed: 40, target: 45 },
      { month: "Feb", closed: 45, target: 50 },
      { month: "Mar", closed: 48, target: 52 },
      { month: "Apr", closed: 50, target: 55 },
      { month: "May", closed: 53, target: 57 },
      { month: "Jun", closed: 55, target: 60 },
      { month: "Jul", closed: 58, target: 62 },
      { month: "Aug", closed: 60, target: 65 },
      { month: "Sep", closed: 62, target: 66 },
      { month: "Oct", closed: 65, target: 70 },
      { month: "Nov", closed: 68, target: 72 },
      { month: "Dec", closed: 70, target: 75 },
    ],
  };

  const [inputYear, setInputYear] = useState("2025");
  const [selectedYear, setSelectedYear] = useState("2025");

  // Default months with zero values (used when data not found)
  const emptyYearData = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ].map((m) => ({ month: m, closed: 0, target: 0 }));

  // Display either real data or zeros
  const data = yearlyData[selectedYear] || emptyYearData;

  const handleApply = () => {
    setSelectedYear(inputYear.trim());
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Performance Overview</h2>
          <p className="text-sm text-gray-500">
            Lead closure vs targets ({selectedYear})
          </p>
        </div>

        {/* Year Input + Apply */}
        <div className="flex items-center gap-3">
          <input
            type="number"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Year (e.g., 2025)"
            value={inputYear}
            onChange={(e) => setInputYear(e.target.value)}
          />
          <button
            onClick={handleApply}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: "12px" }} />
            <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="target" name="Target" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="closed" name="Closed Leads" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Message when no data found */}
      {!yearlyData[selectedYear] && (
        <p className="text-center text-red-500 mt-4 font-medium">
          No data found for {selectedYear}. Showing zeros.
        </p>
      )}
    </div>
  );
}

/*
📘 Later you can replace dummy logic with:
useEffect(() => {
  fetch(`/api/performance/${selectedYear}`)
    .then(res => res.json())
    .then(data => setData(data || emptyYearData));
}, [selectedYear]);
*/
