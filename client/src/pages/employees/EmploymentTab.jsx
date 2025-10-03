import React from "react";

export default function EmploymentTab({ employee }) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Employment Information</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
          <dd className="text-sm text-gray-900">{employee.employeeId}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Position</dt>
          <dd className="text-sm text-gray-900">{employee.position}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Manager</dt>
          <dd className="text-sm text-gray-900">{employee.manager}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Office</dt>
          <dd className="text-sm text-gray-900">{employee.office}</dd>
        </div>
      </dl>
    </div>
  );
}
