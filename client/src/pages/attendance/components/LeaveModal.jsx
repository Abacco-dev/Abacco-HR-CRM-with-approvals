import React, { useState } from "react";
import { X, Send, Calendar, Plus } from "lucide-react";

export default function LeaveModal({
  setShowLeaveModal,
  newLeaveRequest,
  setNewLeaveRequest,
  handleLeaveSubmit,
}) {
  const [showCustomTypeInput, setShowCustomTypeInput] = useState(false);
  const [customLeaveType, setCustomLeaveType] = useState("");

  // ✅ Add custom leave type
  const handleAddCustomLeave = () => {
    if (!customLeaveType.trim()) return;
    setNewLeaveRequest({ ...newLeaveRequest, type: customLeaveType });
    setShowCustomTypeInput(false);
    setCustomLeaveType("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative animate-fadeIn border border-gray-100">
        {/* Close Button */}
        <button
          onClick={() => setShowLeaveModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Apply for Leave
        </h2>

        {/* Leave Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLeaveSubmit();
          }}
          className="space-y-5"
        >
          {/* Leave Type */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Leave Type
              </label>
              <button
                type="button"
                onClick={() => setShowCustomTypeInput(!showCustomTypeInput)}
                className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-700 transition"
              >
                <Plus size={16} /> Add Custom
              </button>
            </div>

            {!showCustomTypeInput ? (
              <select
                value={newLeaveRequest.type}
                onChange={(e) =>
                  setNewLeaveRequest({
                    ...newLeaveRequest,
                    type: e.target.value,
                  })
                }
                className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 outline-none shadow-sm transition-all appearance-none"
              >
                <option value="">Select Leave Type</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
              </select>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter new leave type..."
                  value={customLeaveType}
                  onChange={(e) => setCustomLeaveType(e.target.value)}
                  className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 outline-none shadow-sm transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddCustomLeave}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              {/* calendar icon now clickable */}
              <button
                type="button"
                onClick={() => document.getElementById("startDateInput").showPicker?.()}
                className="absolute left-3 top-3 text-gray-400 hover:text-blue-500 transition cursor-pointer"
              >
                <Calendar size={18} />
              </button>
              <input
                id="startDateInput"
                type="date"
                value={newLeaveRequest.startDate}
                onChange={(e) => {
                  const newStart = e.target.value;
                  setNewLeaveRequest((prev) => ({
                    ...prev,
                    startDate: newStart,
                    endDate: prev.endDate || newStart, // 👈 auto-fill end date if empty
                  }));
                }}
                className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-10 py-2.5 text-gray-800 outline-none shadow-sm transition-all cursor-pointer"
              />

            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => document.getElementById("endDateInput").showPicker?.()}
                className="absolute left-3 top-3 text-gray-400 hover:text-blue-500 transition cursor-pointer"
              >
                <Calendar size={18} />
              </button>
              <input
                id="endDateInput"
                type="date"
                value={newLeaveRequest.endDate}
                onChange={(e) =>
                  setNewLeaveRequest({
                    ...newLeaveRequest,
                    endDate: e.target.value,
                  })
                }
                className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-10 py-2.5 text-gray-800 outline-none shadow-sm transition-all cursor-pointer"
              />
            </div>
          </div>


          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              placeholder="Enter your reason for leave..."
              value={newLeaveRequest.reason}
              onChange={(e) =>
                setNewLeaveRequest({
                  ...newLeaveRequest,
                  reason: e.target.value,
                })
              }
              className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2.5 text-gray-800 outline-none resize-none h-28 shadow-sm transition-all placeholder-gray-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowLeaveModal(false)}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md"
            >
              <Send size={18} />
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
