import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function CreateTeamModal({
  createTeam,
  setShowCreateTeam,
  initialTeam = { name: "", leaderId: "" },
}) {
  const [newTeam, setNewTeam] = useState(initialTeam);
  const [localEmployees, setLocalEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Add this missing line
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/employees`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data.data || data.employees || [];
        setLocalEmployees(list);
      } catch (err) {
        console.error("Failed to load employees:", err);
        setLocalEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredLeaders = localEmployees.filter(
    (emp) => emp.role === "MANAGER" || emp.role === "ADMIN"
  );

  const handleCreateTeam = async () => {
    if (!newTeam.name.trim() || !newTeam.leaderId.trim()) {
      setErrorMsg("⚠️ Please enter team name and select a leader.");
      return;
    }

    try {
      setErrorMsg(""); // clear previous error
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(newTeam),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to create team");
      }

      alert("✅ Team created successfully!");
      setShowCreateTeam(false);
      setNewTeam({ name: "", leaderId: "" });
    } catch (err) {
      console.error("Error creating team:", err);
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-5 text-gray-900 text-center">
          Create New Team
        </h2>

        <div className="space-y-5">
          {/* Team Name Field */}
          <div>
            <label
              htmlFor="teamName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Team Name
            </label>
            <input
              id="teamName"
              type="text"
              value={newTeam.name}
              onChange={(e) =>
                setNewTeam((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter team name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Leader Dropdown */}
          <div>
            <label
              htmlFor="leader"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Leader
            </label>
            {loading ? (
              <p className="text-sm text-gray-500">Loading leaders...</p>
            ) : (
              <select
                id="leader"
                value={newTeam.leaderId}
                onChange={(e) =>
                  setNewTeam((prev) => ({ ...prev, leaderId: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a leader</option>
                {filteredLeaders.length > 0 ? (
                  filteredLeaders.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} {emp.email ? `(${emp.email})` : ""}
                    </option>
                  ))
                ) : (
                  <option value="">No eligible leaders found</option>
                )}
              </select>
            )}
          </div>

          {/* ✅ Show backend or validation errors */}
          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-300">
              {errorMsg}
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleCreateTeam}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all"
          >
            Create Team
          </button>
          <button
            onClick={() => {
              setShowCreateTeam(false);
              setErrorMsg("");
              setNewTeam({ name: "", leaderId: "" });
            }}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
