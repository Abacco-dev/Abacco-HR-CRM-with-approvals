import React from "react";

const payrollData = {
  salary: "$4500",
  bankName: "JPMorgan Chase Bank",
  accountNumber: "112300987652",
  sortCode: "LE00652",
  transactions: [
    { date: "15 May 2025", amount: "$4500", salaryFor: "Apr 2025" },
    { date: "10 Apr 2025", amount: "$4500", salaryFor: "Mar 2025" },
    { date: "13 Mar 2025", amount: "$4500", salaryFor: "Feb 2025" },
    { date: "12 Feb 2025", amount: "$4500", salaryFor: "Jan 2025" },
  ],
};

export default function PayrollTab() {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold text-lg mb-2">Current Salary</h3>
        <p>{payrollData.salary}</p>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold text-lg mb-2">Bank Details</h3>
        <p><strong>Bank Name:</strong> {payrollData.bankName}</p>
        <p><strong>Account Number:</strong> {payrollData.accountNumber}</p>
        <p><strong>Sort Code:</strong> {payrollData.sortCode}</p>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h3 className="font-semibold text-lg mb-2">Transactions</h3>
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Salary For</th>
            </tr>
          </thead>
          <tbody>
            {payrollData.transactions.map((t, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{t.date}</td>
                <td className="p-2">{t.amount}</td>
                <td className="p-2">{t.salaryFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
