// components/OvertimeModal.jsx
import { X } from "lucide-react";

export default function OvertimeModal({
  setShowOvertimeModal,
  newOvertimeRequest,
  setNewOvertimeRequest,
  handleOvertimeSubmit,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={() => setShowOvertimeModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Request Overtime
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleOvertimeSubmit();
          }}
          className="space-y-4"
        >
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={newOvertimeRequest.date}
              onChange={(e) =>
                setNewOvertimeRequest({
                  ...newOvertimeRequest,
                  date: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={newOvertimeRequest.startTime}
              onChange={(e) =>
                setNewOvertimeRequest({
                  ...newOvertimeRequest,
                  startTime: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={newOvertimeRequest.endTime}
              onChange={(e) =>
                setNewOvertimeRequest({
                  ...newOvertimeRequest,
                  endTime: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              rows={3}
              placeholder="Enter reason for overtime"
              value={newOvertimeRequest.reason}
              onChange={(e) =>
                setNewOvertimeRequest({
                  ...newOvertimeRequest,
                  reason: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowOvertimeModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
