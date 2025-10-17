export default function LeaveModal({ setShowLeaveModal }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Apply for Leave</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
            <select className="w-full border rounded-lg p-2">
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Earned Leave</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea className="w-full border rounded-lg p-2"></textarea>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowLeaveModal(false)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
