import React, { useState } from "react";

export default function EmployeeForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    country: "",
    startDate: "",
    employmentType: "",
    team: "",
    manager: "",
    office: "",
    salary: "",
    currency: "",
    frequency: "",
    status: "Permanent",
    image: "https://via.placeholder.com/100", // default profile image
  });

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Add Employee
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Basic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
                required
              />
            </div>
          </div>

          {/* Employment Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="country"
                placeholder="Country of Employment"
                value={formData.country}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="text"
                name="jobTitle"
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              >
                <option value="">Select Type</option>
                <option value="Permanent">Permanent</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          {/* Teams and Offices */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Teams and Offices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="team"
                placeholder="Team"
                value={formData.team}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
              <input
                type="text"
                name="manager"
                placeholder="Line Manager"
                value={formData.manager}
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
          </div>

          {/* Salary Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Salary Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              >
                <option value="">Select Currency</option>
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
              </select>
              <input
                type="number"
                name="salary"
                placeholder="Amount"
                value={formData.salary}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              />
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="p-3 border rounded-lg w-full"
              >
                <option value="">Select Frequency</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
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
    </div>
  );
}
