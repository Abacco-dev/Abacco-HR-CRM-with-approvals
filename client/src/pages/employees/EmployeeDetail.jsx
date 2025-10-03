// EmployeeDetail.jsx
import React, { useState } from "react";
import { ChevronLeft, User, FileText, DollarSign, Clock, Star } from "lucide-react";

export default function EmployeeDetail({ employee, onBack }) {
  const [activeTab, setActiveTab] = useState("Employment");

  const tabs = [
    { key: "Employment", icon: User },
    { key: "Detail", icon: FileText },
    { key: "Payroll", icon: DollarSign },
    { key: "Timeoff", icon: Clock },
    { key: "Reviews", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center">
        <button onClick={onBack} className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">
          {employee.firstName} {employee.lastName}
        </h1>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 flex space-x-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" /> {tab.key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto">
        {activeTab === "Employment" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p><strong>Job Title:</strong> {employee.jobTitle}</p>
            <p><strong>Designation:</strong> {employee.designation}</p>
            <p><strong>Office:</strong> {employee.office}</p>
          </div>
        )}

        {activeTab === "Detail" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3">
            <p><strong>Phone:</strong> {employee.phone}</p>
            <p><strong>Alt Phone:</strong> {employee.altPhone}</p>
            <p><strong>Permanent Address:</strong> {employee.permanentAddress}</p>
            <p><strong>Current Address:</strong> {employee.currentAddress}</p>
            <p><strong>Adhar:</strong> {employee.adhar}</p>
            <p><strong>PAN:</strong> {employee.pan}</p>
            <p><strong>Employee ID:</strong> {employee.employeeId}</p>
          </div>
        )}

        {activeTab === "Payroll" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p><strong>Currency:</strong> {employee.currency}</p>
            <p><strong>Salary:</strong> {employee.salary}</p>
            <p><strong>Frequency:</strong> {employee.frequency}</p>
          </div>
        )}

        {activeTab === "Timeoff" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p>No time off records yet.</p>
          </div>
        )}

        {activeTab === "Reviews" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p>No reviews available.</p>
          </div>
        )}
      </div>
    </div>
  );
}


// import React, { useState } from "react";
// import EmploymentTab from "./EmploymentTab";
// import DocumentTab from "./DocumentTab";
// import Payroll from "./Payroll";
// import TimeoffTab from "./TimeoffTab";
// import ReviewsTab from "./ReviewsTab";

// export default function EmployeeDetail({ employee, onBack }) {
//   const [activeTab, setActiveTab] = useState("employment");

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <button 
//           onClick={onBack} 
//           className="mb-4 text-blue-600 hover:underline"
//         >
//           ← Back to Employees
//         </button>

//         <div className="bg-white rounded-lg shadow border border-gray-200">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-2xl font-semibold text-gray-900">
//               {employee.firstName} {employee.lastName}
//             </h2>
//             <p className="text-gray-600">{employee.jobTitle}</p>
//           </div>

//           {/* Tabs */}
//           <div className="border-b border-gray-200">
//             <nav className="flex space-x-6 px-6 -mb-px">
//               {[
//                 { key: "employment", label: "Employment" },
//                 { key: "documents", label: "Documents" },
//                 { key: "payroll", label: "Payroll" },
//                 { key: "timeoff", label: "Time Off" },
//                 { key: "reviews", label: "Reviews" }
//               ].map((tab) => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setActiveTab(tab.key)}
//                   className={`py-4 text-sm font-medium border-b-2 ${
//                     activeTab === tab.key
//                       ? "border-blue-600 text-blue-600"
//                       : "border-transparent text-gray-600 hover:text-gray-900"
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           <div className="p-6">
//             {activeTab === "employment" && <EmploymentTab employee={employee} />}
//             {activeTab === "documents" && <DocumentTab />}
//             {activeTab === "payroll" && <Payroll />}
//             {activeTab === "timeoff" && <TimeoffTab />}
//             {activeTab === "reviews" && <ReviewsTab />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
