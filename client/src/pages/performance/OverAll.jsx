import React, { useState, useEffect } from "react";
import { Filter, TrendingUp, Users, Calendar, Award, AlertCircle, BarChart3 } from "lucide-react";

export default function OverAll() {
  const [leads, setLeads] = useState([]);
  const [selectedLeadType, setSelectedLeadType] = useState("All");
  const [timeRange, setTimeRange] = useState("Daily");
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // 🔹 Dummy data (replace later with backend fetch)
  // ---------------------------
  const dummyData = [
    { id: 1, employee: "John Doe", leadType: "Association", date: "2025-10-06" },
    { id: 2, employee: "Jane Smith", leadType: "Industry", date: "2025-10-06" },
    { id: 3, employee: "Alice Johnson", leadType: "Attendees", date: "2025-10-05" },
    { id: 4, employee: "Bob Brown", leadType: "Association", date: "2025-09-30" },
    { id: 5, employee: "Emma Wilson", leadType: "Industry", date: "2025-09-15" },
  ];

  // ---------------------------
  // 🔹 Backend Integration Placeholder
  // ---------------------------
  const fetchLeads = async () => {
    try {
      setLoading(true);
      // Example backend call:
      // const res = await fetch("http://localhost:4000/api/leads");
      // const data = await res.json();
      // setLeads(data);

      // For now, use generated dummy data
      setLeads(generateDummyLeads());
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate dummy leads for past year
  const generateDummyLeads = () => {
    const employees = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Brown", "Emma Wilson"];
    const leadTypes = ["Association", "Industry", "Attendees"];
    const startDate = new Date("2024-10-07");
    const endDate = new Date("2025-10-06");
    const leads = [];

    let idCounter = 1;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const numLeads = Math.floor(Math.random() * 6);
      for (let i = 0; i < numLeads; i++) {
        const employee = employees[Math.floor(Math.random() * employees.length)];
        const leadType = leadTypes[Math.floor(Math.random() * leadTypes.length)];
        const dateStr = d.toISOString().split("T")[0];
        leads.push({ id: idCounter++, employee, leadType, date: dateStr });
      }
    }
    return [...dummyData, ...leads];
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // ---------------------------
  // 🔹 Filtering Logic
  // ---------------------------
  const getFilteredLeads = () => {
    if (!leads.length) return [];

    const today = new Date();
    let filtered = [...leads];

    if (selectedLeadType !== "All") {
      filtered = filtered.filter((l) => l.leadType === selectedLeadType);
    }

    filtered = filtered.filter((l) => {
      const leadDate = new Date(l.date);
      const diffDays = (today - leadDate) / (1000 * 60 * 60 * 24);
      switch (timeRange) {
        case "Daily":
          return diffDays < 1;
        case "Weekly":
          return diffDays < 7;
        case "Monthly":
          return diffDays < 30;
        case "Yearly":
          return diffDays < 365;
        default:
          return true;
      }
    });

    return filtered;
  };

  const filteredLeads = getFilteredLeads();

  // ---------------------------
  // 🔹 Count per employee
  // ---------------------------
  const leadCounts = filteredLeads.reduce((acc, lead) => {
    acc[lead.employee] = (acc[lead.employee] || 0) + 1;
    return acc;
  }, {});

  // ---------------------------
  // 🔹 12-Month Target Calculation
  // ---------------------------
  const monthlyTarget = 20;
  const totalSets = 12;

  const leadsByMonth = leads.reduce((acc, lead) => {
    const date = new Date(lead.date);
    const key = `${lead.employee}-${date.getFullYear()}-${date.getMonth() + 1}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const setSummary = {};
  Object.keys(leadCounts).forEach((emp) => {
    let achieved = 0;
    for (let i = 0; i < totalSets; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${emp}-${date.getFullYear()}-${date.getMonth() + 1}`;
      const leadsInMonth = leadsByMonth[key] || 0;
      if (leadsInMonth >= monthlyTarget) achieved++;
    }
    const notAchieved = totalSets - achieved;
    setSummary[emp] = { achieved, notAchieved };
  });

  // ---------------------------
  // 🔹 Final Table Data
  // ---------------------------
  const tableData = Object.entries(leadCounts).map(([employee, count]) => ({
    employee,
    count,
    totalSets,
    achieved: setSummary[employee]?.achieved || 0,
    notAchieved: setSummary[employee]?.notAchieved || 12,
  }));

  // Calculate summary statistics
  const totalLeads = filteredLeads.length;
  const totalEmployees = tableData.length;
  const totalAchieved = tableData.reduce((sum, row) => sum + row.achieved, 0);
  const avgAchievement = totalEmployees > 0 ? ((totalAchieved / (totalEmployees * totalSets)) * 100).toFixed(1) : 0;

  // Lead type breakdown
  const leadTypeBreakdown = filteredLeads.reduce((acc, lead) => {
    acc[lead.leadType] = (acc[lead.leadType] || 0) + 1;
    return acc;
  }, {});

  const getAchievementColor = (achieved, total) => {
    const percentage = (achieved / total) * 100;
    if (percentage >= 80) return "bg-green-100 text-green-700";
    if (percentage >= 60) return "bg-blue-100 text-blue-700";
    if (percentage >= 40) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getProgressBarColor = (achieved, total) => {
    const percentage = (achieved / total) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  // ---------------------------
  // 🔹 UI
  // ---------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Overall Leads Dashboard</h1>
            <p className="text-gray-600 mt-1">Track and analyze lead performance across your team</p>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="text-sm opacity-90">Average Achievement</div>
            <div className="text-2xl font-bold">{avgAchievement}%</div>
          </div>
        </div>

        {/* Summary Cards */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

           <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Time Period</p>
                <p className="text-xl font-bold text-gray-900">{timeRange}</p>
                <p className="text-xs text-gray-500 mt-1">Current filter</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
                <p className="text-xs text-gray-500 mt-1">{timeRange} view</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Employees</p>
                <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
                <p className="text-xs text-gray-500 mt-1">Contributing</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sets Achieved</p>
                <p className="text-2xl font-bold text-gray-900">{totalAchieved}</p>
                <p className="text-xs text-gray-500 mt-1">Out of {totalEmployees * totalSets}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

         
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Lead Type</label>
              <select
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                value={selectedLeadType}
                onChange={(e) => setSelectedLeadType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Association">Association</option>
                <option value="Industry">Industry</option>
                <option value="Attendees">Attendees</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Time Range</label>
              <select
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            {/* Lead Type Breakdown */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Distribution</label>
              <div className="space-y-2">
                {Object.entries(leadTypeBreakdown).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{type}:</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-white" />
              <h3 className="text-xl font-bold text-white">Employee Performance Breakdown</h3>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="text-gray-500 mt-4">Loading leads data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Employee</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Lead Count</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Total Sets</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Achieved</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Not Achieved</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.length > 0 ? (
                    tableData.map((row, i) => {
                      const achievementPercent = ((row.achieved / row.totalSets) * 100).toFixed(0);
                      return (
                        <tr key={i} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                          <td className="p-4 text-gray-700 font-medium">{i + 1}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                {row.employee.charAt(0)}
                              </div>
                              <span className="font-medium text-gray-900">{row.employee}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                              {row.count}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                              {row.totalSets}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                              {row.achieved}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                              {row.notAchieved}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${getProgressBarColor(row.achieved, row.totalSets)}`}
                                  style={{ width: `${achievementPercent}%` }}
                                ></div>
                              </div>
                              <span className={`text-xs font-semibold px-2 py-1 rounded ${getAchievementColor(row.achieved, row.totalSets)}`}>
                                {achievementPercent}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="w-12 h-12 text-gray-400" />
                          <p className="text-gray-500 font-medium">No leads found for selected filters</p>
                          <p className="text-sm text-gray-400">Try adjusting your filter criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Backend Integration Ready</p>
              <p className="text-sm text-blue-700 mt-1">
                The backend fetch function is prepared in the code. Simply uncomment the API call in the <code className="bg-blue-100 px-1 rounded">fetchLeads()</code> function to connect to your backend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}