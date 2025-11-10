import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Save } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Approvals() {
  const { currentUser } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState({});
  const [decisionMap, setDecisionMap] = useState({});

  const isAdmin = currentUser?.role?.toUpperCase() === "ADMIN";

  // ✅ Fetch only case-sensitive "PENDING" leaves
  useEffect(() => {
    const fetchPendingLeaves = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/leaves");
        const allLeaves = data?.leaves || [];
        const pending = allLeaves.filter((l) => l.status === "PENDING"); // ✅ exact match
        setLeaves(pending);
      } catch (err) {
        console.error("❌ Failed to load leaves:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingLeaves();
  }, []);

  // ✅ Handle decision select
  const handleDecisionChange = (id, decision) => {
    setDecisionMap((prev) => ({ ...prev, [id]: decision }));
  };

  // ✅ Save action — updates backend and removes row
  const handleSave = async (id) => {
    const decision = decisionMap[id];
    if (!decision) {
      alert("Please select Approve or Reject before saving.");
      return;
    }

    if (!window.confirm(`Are you sure to ${decision.toLowerCase()} this leave?`)) return;

    try {
      setUpdating((prev) => ({ ...prev, [id]: true }));
      await axios.patch(`/api/leaves/${id}/approval`, { decision });
      // ✅ Remove approved/rejected record
      setLeaves((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("❌ Error updating leave:", err);
      alert("Failed to update leave status.");
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pending Leave Approvals</h1>
        <div className="text-sm text-gray-500">
          {leaves.length} pending request{leaves.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-12 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin mr-2 text-blue-600" />
          Loading pending leaves...
        </div>
      ) : leaves.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          <p>No pending leave requests found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border font-medium">Employee</th>
                <th className="p-3 border font-medium">Leave Type</th>
                <th className="p-3 border font-medium">Start Date</th>
                <th className="p-3 border font-medium">End Date</th>
                <th className="p-3 border font-medium">Days</th>
                <th className="p-3 border font-medium">Reason</th>
                {isAdmin && (
                  <>
                    <th className="p-3 border font-medium">Decision</th>
                    <th className="p-3 border font-medium">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    {leave.user?.name || "Employee"}
                    <div className="text-xs text-gray-400">{leave.user?.email}</div>
                  </td>
                  <td className="p-3">{leave.type}</td>
                  <td className="p-3">{formatDate(leave.startDate)}</td>
                  <td className="p-3">{formatDate(leave.endDate)}</td>
                  <td className="p-3">{leave.noOfDays ?? "-"}</td>
                  <td className="p-3">{leave.reason || "-"}</td>

                  {isAdmin && (
                    <>
                      <td className="p-3">
                        <select
                          value={decisionMap[leave.id] || ""}
                          onChange={(e) => handleDecisionChange(leave.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="">Select</option>
                          <option value="APPROVED">Approve</option>
                          <option value="REJECTED">Reject</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleSave(leave.id)}
                          disabled={updating[leave.id]}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm disabled:bg-gray-300"
                        >
                          {updating[leave.id] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Save
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
