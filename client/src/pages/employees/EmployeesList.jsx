// EmployeesList.jsx
import React, { useState } from "react";
import EmployeeDetail from "./EmployeeDetail";

export default function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    designation: "",
    phone: "",
    altPhone: "",
    permanentAddress: "",
    currentAddress: "",
    adhar: "",
    pan: "",
    country: "",
    startDate: "",
    employmentType: "",
    team: "",
    office: "",
    currency: "",
    salary: "",
    frequency: "",
  });
  const [view, setView] = useState("list"); // list | detail | form
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle add employee
  const handleSubmit = (e) => {
    e.preventDefault();
    const newEmployee = { id: Date.now(), ...formData };
    setEmployees([...employees, newEmployee]);
    setFormData({
      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      jobTitle: "",
      designation: "",
      phone: "",
      altPhone: "",
      permanentAddress: "",
      currentAddress: "",
      adhar: "",
      pan: "",
      country: "",
      startDate: "",
      employmentType: "",
      team: "",
      office: "",
      currency: "",
      salary: "",
      frequency: "",
    });
    setView("list");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {view === "list" && (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Employees</h2>
            <button
              onClick={() => setView("form")}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              + Add Employee
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {emp.employeeId}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-blue-600 hover:underline cursor-pointer"
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setView("detail");
                      }}
                    >
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {emp.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {emp.jobTitle}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === "form" && (
        <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Add Employee
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={formData.employeeId}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
                required
              />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone No."
                value={formData.phone}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="text"
                name="altPhone"
                placeholder="Alt Phone No."
                value={formData.altPhone}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="permanentAddress"
                placeholder="Permanent Address"
                value={formData.permanentAddress}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="text"
                name="currentAddress"
                placeholder="Current Address"
                value={formData.currentAddress}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
            </div>

            {/* Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="adhar"
                placeholder="Adhar No."
                value={formData.adhar}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="text"
                name="pan"
                placeholder="PAN No."
                value={formData.pan}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
            </div>

            {/* Job */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="jobTitle"
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="text"
                name="designation"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="text"
                name="office"
                placeholder="Office Name"
                value={formData.office}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setView("list")}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Add Employee
              </button>
            </div>
          </form>
        </div>
      )}

      {view === "detail" && selectedEmployee && (
        <EmployeeDetail
          employee={selectedEmployee}
          onBack={() => setView("list")}
        />
      )}
    </div>
  );
}



// import React, { useState } from 'react';
// import { ChevronLeft, Edit, Users, FileText, DollarSign, Clock, Star, Settings, Building2, Calendar, User } from 'lucide-react';

// // Mock data
// const employees = [
//   {
//     id: 1,
//     employeeId: "EMP001",
//     firstName: "John",
//     lastName: "Carter",
//     image: "",
//     email: "john@example.com",
//     jobTitle: "Developer",
//     position: "Team Lead",
//     status: "Permanent",
//     manager: "Braun Kelton",
//     office: "Focus Technologies",
//     workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
//     reportsTo: [
//       { name: "Alice Johnson", avatar: "AJ" },
//       { name: "Bob Smith", avatar: "BS" },
//       { name: "Carol Davis", avatar: "CD" },
//       { name: "David Wilson", avatar: "DW" },
//       { name: "+3", avatar: "+3" }
//     ]
//   },
//   {
//     id: 2,
//     employeeId: "EMP002",
//     firstName: "Sophia",
//     lastName: "White",
//     image: "https://www.shutterstock.com/image-photo/traveler-woman-arms-raised-triumph-260nw-2457990309.jpg",
//     email: "sophia@example.com",
//     jobTitle: "UI Designer",
//     position: "Senior Designer",
//     status: "Contract",
//     manager: "Emma Thompson",
//     office: "Creative Studios",
//     workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
//     reportsTo: [
//       { name: "Mike Johnson", avatar: "MJ" },
//       { name: "Sara Lee", avatar: "SL" }
//     ]
//   }
// ];

// // Employee List Component
// function EmployeeList({ onSelectEmployee }) {
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <h2 className="text-2xl font-semibold text-gray-900">Employees</h2>
//             <p className="text-gray-600 mt-1">Manage your team members</p>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Employee ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Job Title
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {employees.map((emp) => (
//                   <tr
//                     key={emp.id}
//                     className="hover:bg-gray-50 transition-colors duration-200"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {emp.employeeId}
//                     </td>
//                     <td
//                       className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium hover:underline transition-colors duration-200"
//                       onClick={() => onSelectEmployee(emp)}
//                     >
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10">
//                           <img
//                             className="h-10 w-10 rounded-full object-cover"
//                             src={emp.image}
//                             alt={`${emp.firstName} ${emp.lastName}`}
//                           />
//                         </div>
//                         <div className="ml-3">
//                           {emp.firstName} {emp.lastName}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                       {emp.email}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {emp.jobTitle}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${emp.status === "Permanent"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-orange-100 text-orange-800"
//                           }`}
//                       >
//                         {emp.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// // Employee Detail Component
// function EmployeeDetail({ employee, onBack }) {
//   const [activeTab, setActiveTab] = useState('Employment');

//   const tabs = [
//     { name: 'Employment', icon: 'User' },
//     { name: 'Detail', icon: 'FileText' },
//     { name: 'Document', icon: 'FileText' },
//     { name: 'Payroll', icon: 'DollarSign' },
//     { name: 'Timeoff', icon: 'Clock' },
//     { name: 'Reviews', icon: 'Star' },
//     { name: 'Settings', icon: 'Settings' }
//   ];

//   const getIcon = (iconName) => {
//     const icons = {
//       User,
//       FileText,
//       DollarSign,
//       Clock,
//       Star,
//       Settings
//     };
//     return icons[iconName];
//   };

//   const getDayInitial = (day) => {
//     const dayMap = {
//       'Mon': 'M', 'Tue': 'T', 'Wed': 'W',
//       'Thu': 'T', 'Fri': 'F', 'Sat': 'S', 'Sun': 'S'
//     };
//     return dayMap[day] || day;
//   };

//   const getDayColor = (day) => {
//     const colorMap = {
//       'Mon': 'bg-green-500', 'Tue': 'bg-blue-500', 'Wed': 'bg-yellow-500',
//       'Thu': 'bg-purple-500', 'Fri': 'bg-pink-500', 'Sat': 'bg-red-500', 'Sun': 'bg-orange-500'
//     };
//     return colorMap[day] || 'bg-gray-500';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4">
//         <div className="flex items-center">
//           <button
//             onClick={onBack}
//             className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//           >
//             <ChevronLeft className="h-5 w-5 text-gray-600" />
//           </button>
//           <h1 className="text-xl font-semibold text-gray-900">Employees</h1>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="px-6">
//           <nav className="flex space-x-8">
//             {tabs.map((tab) => {
//               const IconComponent = getIcon(tab.icon);
//               return (
//                 <button
//                   key={tab.name}
//                   onClick={() => setActiveTab(tab.name)}
//                   className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.name
//                       ? 'border-blue-500 text-blue-600'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                     }`}
//                 >
//                   <IconComponent className="h-4 w-4 mr-2" />
//                   {tab.name}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-6">
//         <div className="max-w-4xl mx-auto">
//           {activeTab === 'Employment' && (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//               <div className="p-6 space-y-6">
//                 {/* Position */}
//                 <div className="flex items-center justify-between py-4 border-b border-gray-200">
//                   <div className="flex-1">
//                     <label className="text-sm font-medium text-gray-700 mb-2 block">Position</label>
//                     <div className="flex items-center space-x-2">
//                       <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                         {employee.position}
//                       </span>
//                       <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
//                         {employee.status}
//                       </span>
//                     </div>
//                   </div>
//                   <Edit className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
//                 </div>

//                 {/* Manager */}
//                 <div className="flex items-center justify-between py-4 border-b border-gray-200">
//                   <div className="flex-1">
//                     <label className="text-sm font-medium text-gray-700 mb-2 block">Manager</label>
//                     <div className="flex items-center">
//                       <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-white text-sm font-semibold mr-3">
//                         {employee.manager.split(' ').map(n => n[0]).join('')}
//                       </div>
//                       <span className="text-gray-900 font-medium">{employee.manager}</span>
//                     </div>
//                   </div>
//                   <Edit className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
//                 </div>

//                 {/* Who Reports to */}
//                 <div className="flex items-center justify-between py-4 border-b border-gray-200">
//                   <div className="flex-1">
//                     <label className="text-sm font-medium text-gray-700 mb-2 block">Who Reports to {employee.firstName} {employee.lastName}</label>
//                     <div className="flex items-center space-x-2">
//                       {employee.reportsTo.map((person, index) => (
//                         <div
//                           key={index}
//                           className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold"
//                         >
//                           {person.avatar}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="text-blue-600 cursor-pointer hover:text-blue-800 text-2xl font-semibold">
//                     +
//                   </div>
//                 </div>

//                 {/* Office */}
//                 <div className="flex items-center justify-between py-4 border-b border-gray-200">
//                   <div className="flex-1">
//                     <label className="text-sm font-medium text-gray-700 mb-2 block">Office</label>
//                     <div className="flex items-center">
//                       <Building2 className="h-5 w-5 text-blue-500 mr-2" />
//                       <span className="text-gray-900 font-medium">{employee.office}</span>
//                     </div>
//                   </div>
//                   <Edit className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
//                 </div>

//                 {/* Working Week */}
//                 <div className="flex items-center justify-between py-4">
//                   <div className="flex-1">
//                     <label className="text-sm font-medium text-gray-700 mb-2 block">Working Week</label>
//                     <div className="flex items-center space-x-1">
//                       {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
//                         <div
//                           key={day}
//                           className={`h-8 w-8 rounded flex items-center justify-center text-white text-sm font-medium ${employee.workingDays.includes(day)
//                               ? getDayColor(day)
//                               : 'bg-gray-300'
//                             }`}
//                         >
//                           {getDayInitial(day)}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                   <Edit className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'Detail' && (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {/* Left Section - Profile */}
//                 <div className="flex flex-col items-center text-center space-y-4">
//                   <img
//                     src={employee.image}
//                     alt="Profile"
//                     className="w-24 h-24 rounded-full border"
//                   />
//                   <div>
//                     <h2 className="text-lg font-semibold text-gray-900">
//                       {employee.firstName} {employee.lastName}
//                     </h2>
//                     <p className="text-sm text-gray-600">{employee.email}</p>
//                   </div>

//                   {/* Info boxes */}
//                   <div className="flex gap-4 mt-4">
//                     <div className="bg-gray-50 p-3 rounded-lg text-center">
//                       <p className="text-xs text-gray-500">Nationality</p>
//                       <p className="text-gray-900">{employee.nationality || "American"}</p>
//                     </div>
//                     <div className="bg-gray-50 p-3 rounded-lg text-center">
//                       <p className="text-xs text-gray-500">Date of Birth</p>
//                       <p className="text-gray-900">{employee.dob || "05 May 1990"}</p>
//                     </div>
//                     <div className="bg-gray-50 p-3 rounded-lg text-center">
//                       <p className="text-xs text-gray-500">Blood Group</p>
//                       <p className="text-gray-900">{employee.bloodGroup || "O positive"}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Section - Contact Details */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                     Contact Details
//                   </h3>
//                   <div className="space-y-3">
//                     <div className="p-3 bg-gray-50 rounded-lg">
//                       <span className="text-gray-900">
//                         {employee.phone || "+1 56598 98956"}
//                       </span>
//                     </div>
//                     <div className="p-3 bg-gray-50 rounded-lg">
//                       <span className="text-blue-600">
//                         {employee.website || "www.focustechnology.com"}
//                       </span>
//                     </div>
//                     <div className="p-3 bg-gray-50 rounded-lg">
//                       <span className="text-gray-900">
//                         {employee.social || "#johncarter"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'Document' && (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
//                   <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
//                     Upload Document
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   {[
//                     { name: "Resume.pdf", type: "PDF", size: "2.3 MB", date: "2024-01-15", status: "Verified" },
//                     { name: "ID_Proof.jpg", type: "Image", size: "1.8 MB", date: "2024-01-10", status: "Pending" },
//                     { name: "Contract_2024.docx", type: "Document", size: "124 KB", date: "2024-01-05", status: "Verified" },
//                     { name: "Certification.pdf", type: "PDF", size: "892 KB", date: "2023-12-20", status: "Verified" }
//                   ].map((doc, index) => (
//                     <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
//                       <div className="flex items-center space-x-4">
//                         <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                           <FileText className="h-5 w-5 text-blue-600" />
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900">{doc.name}</p>
//                           <p className="text-sm text-gray-500">{doc.type} • {doc.size} • Uploaded on {doc.date}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-3">
//                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${doc.status === 'Verified'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-yellow-100 text-yellow-800'
//                           }`}>
//                           {doc.status}
//                         </span>
//                         <button className="text-blue-600 hover:text-blue-800">Download</button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'Payroll' && (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//               <div className="p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-6">Payroll Information</h3>

//                 {/* Salary Overview */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                   <div className="bg-green-50 p-6 rounded-lg">
//                     <div className="flex items-center">
//                       <DollarSign className="h-8 w-8 text-green-600 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-green-600">Annual Salary</p>
//                         <p className="text-2xl font-bold text-green-900">$85,000</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="bg-blue-50 p-6 rounded-lg">
//                     <div className="flex items-center">
//                       <Calendar className="h-8 w-8 text-blue-600 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-blue-600">Monthly Salary</p>
//                         <p className="text-2xl font-bold text-blue-900">$7,083</p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="bg-purple-50 p-6 rounded-lg">
//                     <div className="flex items-center">
//                       <Clock className="h-8 w-8 text-purple-600 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-purple-600">Hourly Rate</p>
//                         <p className="text-2xl font-bold text-purple-900">$40.87</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Payment Details */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <h4 className="font-semibold text-gray-900 mb-4">Payment Information</h4>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Bank Name:</span>
//                         <span className="font-medium">Chase Bank</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Account Number:</span>
//                         <span className="font-medium font-mono">****1234</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Routing Number:</span>
//                         <span className="font-medium font-mono">021000021</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Pay Frequency:</span>
//                         <span className="font-medium">Bi-weekly</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="font-semibold text-gray-900 mb-4">Tax Information</h4>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Tax ID:</span>
//                         <span className="font-medium font-mono">XXX-XX-1234</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Filing Status:</span>
//                         <span className="font-medium">Single</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Allowances:</span>
//                         <span className="font-medium">2</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Additional Withholding:</span>
//                         <span className="font-medium">$0.00</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'Timeoff' && (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900">Time Off</h3>
//                   <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
//                     Request Time Off
//                   </button>
//                 </div>

//                 {/* Leave Balance */}
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//                   <div className="bg-blue-50 p-4 rounded-lg text-center">
//                     <p className="text-2xl font-bold text-blue-900">18</p>
//                     <p className="text-sm text-blue-600">Vacation Days</p>
//                     <p className="text-xs text-gray-500">Remaining</p>
//                   </div>
//                   <div className="bg-green-50 p-4 rounded-lg text-center">
//                     <p className="text-2xl font-bold text-green-900">12</p>
//                     <p className="text-sm text-green-600">Sick Days</p>
//                     <p className="text-xs text-gray-500">Remaining</p>
//                   </div>
//                   <div className="bg-purple-50 p-4 rounded-lg text-center">
//                     <p className="text-2xl font-bold text-purple-900">3</p>
//                     <p className="text-sm text-purple-600">Personal Days</p>
//                     <p className="text-xs text-gray-500">Remaining</p>
//                   </div>
//                   <div className="bg-orange-50 p-4 rounded-lg text-center">
//                     <p className="text-2xl font-bold text-orange-900">2</p>
//                     <p className="text-sm text-orange-600">Mental Health</p>
//                     <p className="text-xs text-gray-500">Days Used</p>
//                   </div>
//                 </div>

//                 {/* Recent Time Off Requests */}
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-4">Recent Requests</h4>
//                   <div className="space-y-4">
//                     {[
//                       { type: "Vacation", dates: "Dec 20-24, 2024", days: "5", status: "Approved", reason: "Holiday break" },
//                       { type: "Sick Leave", dates: "Nov 15, 2024", days: "1", status: "Approved", reason: "Doctor appointment" },
//                       { type: "Personal", dates: "Jan 8, 2025", days: "1", status: "Pending", reason: "Personal matters" }
//                     ].map((request, index) => (
//                       <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                         <div className="flex items-center space-x-4">
//                           <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
//                             <Calendar className="h-5 w-5 text-indigo-600" />
//                           </div>
//                           <div>
//                             <p className="font-medium text-gray-900">{request.type}</p>
//                             <p className="text-sm text-gray-500">{request.dates} • {request.days} day(s)</p>
//                             <p className="text-xs text-gray-400">{request.reason}</p>
//                           </div>
//                         </div>
//                         <span className={`px-3 py-1 text-sm font-semibold rounded-full ${request.status === 'Approved'
//                             ? 'bg-green-100 text-green-800'
//                             : request.status === 'Pending'
//                               ? 'bg-yellow-100 text-yellow-800'
//                               : 'bg-red-100 text-red-800'
//                           }`}>
//                           {request.status}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'Reviews' && (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900">Performance Reviews</h3>
//                   <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
//                     Schedule Review
//                   </button>
//                 </div>

//                 {/* Performance Overview */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                   <div className="bg-green-50 p-6 rounded-lg text-center">
//                     <div className="flex justify-center mb-3">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className="h-5 w-5 text-green-500 fill-current" />
//                       ))}
//                     </div>
//                     <p className="text-2xl font-bold text-green-900">4.8</p>
//                     <p className="text-sm text-green-600">Overall Rating</p>
//                   </div>
//                   <div className="bg-blue-50 p-6 rounded-lg text-center">
//                     <p className="text-2xl font-bold text-blue-900">12</p>
//                     <p className="text-sm text-blue-600">Goals Completed</p>
//                     <p className="text-xs text-gray-500">This year</p>
//                   </div>
//                   <div className="bg-purple-50 p-6 rounded-lg text-center">
//                     <p className="text-2xl font-bold text-purple-900">3</p>
//                     <p className="text-sm text-purple-600">Reviews</p>
//                     <p className="text-xs text-gray-500">Completed</p>
//                   </div>
//                 </div>

//                 {/* Review History */}
//                 <div>
//                   <h4 className="font-semibold text-gray-900 mb-4">Review History</h4>
//                   <div className="space-y-4">
//                     {[
//                       {
//                         date: "Q4 2024",
//                         rating: 4.9,
//                         reviewer: "Sarah Johnson",
//                         type: "Annual Review",
//                         feedback: "Excellent performance, exceeded all expectations"
//                       },
//                       {
//                         date: "Q2 2024",
//                         rating: 4.7,
//                         reviewer: "Mike Davis",
//                         type: "Mid-Year Review",
//                         feedback: "Strong technical skills, good team collaboration"
//                       },
//                       {
//                         date: "Q4 2023",
//                         rating: 4.6,
//                         reviewer: "Sarah Johnson",
//                         type: "Annual Review",
//                         feedback: "Solid performance with room for leadership growth"
//                       }
//                     ].map((review, index) => (
//                       <div key={index} className="p-4 border border-gray-200 rounded-lg">
//                         <div className="flex items-center justify-between mb-3">
//                           <div className="flex items-center space-x-3">
//                             <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
//                               <Star className="h-5 w-5 text-yellow-600" />
//                             </div>
//                             <div>
//                               <p className="font-medium text-gray-900">{review.type}</p>
//                               <p className="text-sm text-gray-500">{review.date} • Reviewed by {review.reviewer}</p>
//                             </div>
//                           </div>
//                           <div className="flex items-center space-x-1">
//                             {[...Array(5)].map((_, i) => (
//                               <Star
//                                 key={i}
//                                 className={`h-4 w-4 ${i < Math.floor(review.rating)
//                                     ? 'text-yellow-400 fill-current'
//                                     : 'text-gray-300'
//                                   }`}
//                               />
//                             ))}
//                             <span className="ml-2 font-semibold text-gray-900">{review.rating}</span>
//                           </div>
//                         </div>
//                         <p className="text-gray-700 text-sm italic">"{review.feedback}"</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'Settings' && (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//               <div className="p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-6">Employee Settings</h3>

//                 <div className="space-y-8">
//                   {/* Account Settings */}
//                   <div>
//                     <h4 className="font-semibold text-gray-900 mb-4">Account Settings</h4>
//                     <div className="space-y-4">
//                       <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                         <div>
//                           <p className="font-medium text-gray-900">Email Notifications</p>
//                           <p className="text-sm text-gray-500">Receive email updates about your account</p>
//                         </div>
//                         <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200">
//                           Enabled
//                         </button>
//                       </div>

//                       <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                         <div>
//                           <p className="font-medium text-gray-900">Two-Factor Authentication</p>
//                           <p className="text-sm text-gray-500">Add extra security to your account</p>
//                         </div>
//                         <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors duration-200">
//                           Setup
//                         </button>
//                       </div>

//                       <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
//                         <div>
//                           <p className="font-medium text-gray-900">Profile Visibility</p>
//                           <p className="text-sm text-gray-500">Control who can see your profile information</p>
//                         </div>
//                         <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
//                           <option>Everyone</option>
//                           <option>Team Only</option>
//                           <option>Managers Only</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Access & Permissions */}
//                   <div>
//                     <h4 className="font-semibold text-gray-900 mb-4">Access & Permissions</h4>
//                     <div className="space-y-4">
//                       {[
//                         { permission: "View Company Directory", status: "Granted" },
//                         { permission: "Submit Time Off Requests", status: "Granted" },
//                         { permission: "Access Payroll Information", status: "Granted" },
//                         { permission: "Manage Team Members", status: "Restricted" },
//                         { permission: "Approve Expenses", status: "Restricted" }
//                       ].map((item, index) => (
//                         <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                           <span className="text-gray-900">{item.permission}</span>
//                           <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'Granted'
//                               ? 'bg-green-100 text-green-800'
//                               : 'bg-red-100 text-red-800'
//                             }`}>
//                             {item.status}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Danger Zone */}
//                   <div>
//                     <h4 className="font-semibold text-red-900 mb-4">Danger Zone</h4>
//                     <div className="border border-red-200 rounded-lg p-4 bg-red-50">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="font-medium text-red-900">Deactivate Employee</p>
//                           <p className="text-sm text-red-600">This will suspend the employee's access to all systems</p>
//                         </div>
//                         <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors duration-200">
//                           Deactivate
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Main App Component
// export default function EmployeeManagementSystem() {
//   const [currentView, setCurrentView] = useState('list');
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   const handleSelectEmployee = (employee) => {
//     setSelectedEmployee(employee);
//     setCurrentView('detail');
//   };

//   const handleBack = () => {
//     setCurrentView('list');
//     setSelectedEmployee(null);
//   };

//   return (
//     <div>
//       {currentView === 'list' ? (
//         <EmployeeList onSelectEmployee={handleSelectEmployee} />
//       ) : (
//         <EmployeeDetail employee={selectedEmployee} onBack={handleBack} />
//       )}
//     </div>
//   );
// }