import React, { useState } from "react";
import { Download } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Brush,
} from "recharts";

const Reports = () => {
  const dummyData = [
    { month: "Jan", leads: 40, conversions: 12 },
    { month: "Feb", leads: 55, conversions: 20 },
    { month: "Mar", leads: 35, conversions: 10 },
    { month: "Apr", leads: 60, conversions: 25 },
    { month: "May", leads: 45, conversions: 14 },
    { month: "Jun", leads: 70, conversions: 30 },
    { month: "Jul", leads: 65, conversions: 26 },
    { month: "Aug", leads: 50, conversions: 18 },
    { month: "Sep", leads: 75, conversions: 33 },
    { month: "Oct", leads: 80, conversions: 35 },
    { month: "Nov", leads: 68, conversions: 28 },
    { month: "Dec", leads: 90, conversions: 40 },
  ];

  const [reportData] = useState(dummyData);
  const [selectedRange, setSelectedRange] = useState([0, dummyData.length - 1]); // default full range

  // Ensure at least one month is selected
  const handleBrushChange = (range) => {
    if (!range) return;
    const [start, end] = [range.startIndex, range.endIndex];
    if (end - start < 0) return; // min 1 month
    setSelectedRange([start, end]);
  };

  const filteredData = reportData.slice(selectedRange[0], selectedRange[1] + 1);

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;

    const headers = ["Month", "Leads", "Conversions", "Conversion Rate (%)"];
    const csvRows = [headers.join(",")];

    filteredData.forEach(({ month, leads, conversions }) => {
      const rate = ((conversions / leads) * 100).toFixed(1);
      csvRows.push([month, leads, conversions, rate].join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "performance-report.csv";
    link.click();
  };

  const selectedMonths =
    filteredData.length > 0
      ? `${filteredData[0].month} – ${filteredData[filteredData.length - 1].month}`
      : "";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          Performance Reports
        </h1>

        <p className="mb-4 text-gray-600 font-medium">
          Selected Range: {selectedMonths || "None"}
        </p>

        <div className="bg-gray-100 p-4 rounded-xl shadow-inner select-none">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="conversions"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Brush
                dataKey="month"
                height={30}
                stroke="#8884d8"
                startIndex={selectedRange[0]}
                endIndex={selectedRange[1]}
                onChange={handleBrushChange}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Table */}
        {filteredData.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border text-center">Month</th>
                  <th className="p-3 border text-center">Total Leads</th>
                  <th className="p-3 border text-center">Conversions</th>
                  <th className="p-3 border text-center">Conversion Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(({ month, leads, conversions }, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3 border text-center">{month}</td>
                    <td className="p-3 border text-center">{leads}</td>
                    <td className="p-3 border text-center">{conversions}</td>
                    <td className="p-3 border text-center">
                      {((conversions / leads) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex mt-8">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Download className="w-5 h-5" /> Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;


// import React, { useState, useEffect } from "react";
// import { Download } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   Legend,
//   Brush,
// } from "recharts";

// const Reports = () => {
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedRange, setSelectedRange] = useState([0, 11]); // default full range

//   const dummyData = [
//     { month: "Jan", leads: 40, conversions: 12 },
//     { month: "Feb", leads: 55, conversions: 20 },
//     { month: "Mar", leads: 35, conversions: 10 },
//     { month: "Apr", leads: 60, conversions: 25 },
//     { month: "May", leads: 45, conversions: 14 },
//     { month: "Jun", leads: 70, conversions: 30 },
//     { month: "Jul", leads: 65, conversions: 26 },
//     { month: "Aug", leads: 50, conversions: 18 },
//     { month: "Sep", leads: 75, conversions: 33 },
//     { month: "Oct", leads: 80, conversions: 35 },
//     { month: "Nov", leads: 68, conversions: 28 },
//     { month: "Dec", leads: 90, conversions: 40 },
//   ];

//   useEffect(() => {
//     setLoading(true);
//     const timer = setTimeout(() => {
//       setReportData(dummyData);
//       setLoading(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   // Filter data based on selected brush range
//   const filteredData = reportData.slice(selectedRange[0], selectedRange[1] + 1);

//   // CSV export
//   const handleExportCSV = () => {
//     if (filteredData.length === 0) return;

//     const headers = ["Month", "Leads", "Conversions", "Conversion Rate (%)"];
//     const csvRows = [headers.join(",")];

//     filteredData.forEach(({ month, leads, conversions }) => {
//       const rate = ((conversions / leads) * 100).toFixed(1);
//       csvRows.push([month, leads, conversions, rate].join(","));
//     });

//     const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "performance-report.csv";
//     link.click();
//   };

//   // Display selected range months
//   const selectedMonths =
//     filteredData.length > 0
//       ? `${filteredData[0].month} – ${filteredData[filteredData.length - 1].month}`
//       : "";

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6">
//         <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
//           Performance Reports
//         </h1>

//         {loading ? (
//           <p className="text-center text-gray-500">Loading data...</p>
//         ) : (
//           <>
//             {/* Selected Range Display */}
//             <p className="mb-4 text-gray-600 font-medium">
//               Selected Range: {selectedMonths || "None"}
//             </p>

//             {/* Chart */}
//             <div className="bg-gray-100 p-4 rounded-xl shadow-inner select-none">
//               <ResponsiveContainer width="100%" height={350}>
//                 <LineChart data={reportData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="leads"
//                     stroke="#3b82f6"
//                     strokeWidth={2}
//                     dot={{ r: 4 }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="conversions"
//                     stroke="#10b981"
//                     strokeWidth={2}
//                     dot={{ r: 4 }}
//                   />
//                   <Brush
//                     dataKey="month"
//                     height={30}
//                     stroke="#8884d8"
//                     onChange={(range) =>
//                       setSelectedRange([range.startIndex, range.endIndex])
//                     }
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Summary Table */}
//             {filteredData.length > 0 && (
//               <div className="mt-8 overflow-x-auto">
//                 <table className="min-w-full border border-gray-200">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="p-3 border text-left">Month</th>
//                       <th className="p-3 border text-left">Total Leads</th>
//                       <th className="p-3 border text-left">Conversions</th>
//                       <th className="p-3 border text-left">Conversion Rate (%)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredData.map(({ month, leads, conversions }, i) => (
//                       <tr key={i} className="hover:bg-gray-50">
//                         <td className="p-3 border">{month}</td>
//                         <td className="p-3 border">{leads}</td>
//                         <td className="p-3 border">{conversions}</td>
//                         <td className="p-3 border">
//                           {((conversions / leads) * 100).toFixed(1)}%
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {/* Export Button */}
//             <div className="flex mt-8">
//               <button
//                 onClick={handleExportCSV}
//                 className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//               >
//                 <Download className="w-5 h-5" /> Export CSV
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Reports;
