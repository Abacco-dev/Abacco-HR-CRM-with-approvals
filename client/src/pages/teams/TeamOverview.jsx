// src/pages/teams/TeamOverview.jsx
import React, { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, MessageSquare, Trash2, Plus, Users } from "lucide-react";

export default function TeamOverview({
  teams = [],
  employees = [],
  getAlerts = () => [],
  addMemberToTeam = () => { },
  removeMemberFromTeam = () => { },
  deleteTeam = () => { },
  setShowMessageModal = () => { },
}) {
  const [expanded, setExpanded] = useState([]);
  const [showAddMemberFor, setShowAddMemberFor] = useState(null);

  const toggle = (id) =>
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <div className="space-y-4">
      {teams.map((team) => {
        // ✅ Safely calculate alerts with fallback for member name
        const alerts = getAlerts({
          ...team,
          members: (team.members || []).map((m) => ({
            ...m,
            name: m.name || m.user?.name || "Unnamed Member",
            email: m.email || m.user?.email || "—",
          })),
        });

        const isExpanded = expanded.includes(team.id);
        const totalAchieved = (team.members || []).reduce(
          (s, m) => s + (m.achieved || 0),
          0
        );
        const progress = team.monthlyTarget
          ? (totalAchieved / team.monthlyTarget) * 100
          : 0;

        return (
          <div key={team.id} className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggle(team.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {team.name}
                    </h3>
                    <p className="text-gray-600">
                      Leader: {team.leader?.name || "—"}
                    </p>
                  </div>

                  {alerts.length > 0 && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">
                        {alerts.length} alert{alerts.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowMessageModal(team.id)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                    title="Team Messages"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <div className="text-right">
                    <div className="text-sm text-gray-600">Total Leads</div>
                    <div className="font-semibold">{team.monthlyTarget ?? 0}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-600">Achieved</div>
                    <div className="font-semibold">{totalAchieved}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-600">Progress</div>
                    <div
                      className={`font-semibold ${progress >= 100
                        ? "text-green-600"
                        : progress >= 75
                          ? "text-yellow-600"
                          : "text-red-600"
                        }`}
                    >
                      {progress.toFixed(1)}%
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTeam(team.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${progress >= 100
                      ? "bg-green-600"
                      : progress >= 75
                        ? "bg-yellow-500"
                        : "bg-red-500"
                      }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              {alerts.length > 0 && (
                <div className="mt-4 space-y-2">
                  {alerts.slice(0, 2).map((a, idx) => (
                    <div
                      key={idx}
                      className={`text-sm p-2 rounded flex items-center gap-2 ${a.type === "critical"
                        ? "bg-red-50 text-red-700"
                        : a.type === "warning"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-green-50 text-green-700"
                        }`}
                    >
                      <AlertTriangle className="w-3 h-3" /> {a.message}
                    </div>
                  ))}
                  {alerts.length > 2 && (
                    <div className="text-sm text-gray-500">
                      +{alerts.length - 2} more alerts
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />{" "}
                  <span>{(team.members || []).length} members</span>
                </div>

                {isExpanded && (
                  <button
                    onClick={() => setShowAddMemberFor(team.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Member
                  </button>
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Team Members
                </h4>

                {(team.members || []).length === 0 ? (
                  <p className="text-gray-500">No members added yet.</p>
                ) : (
                  <div className="grid gap-3">
                    {(team.members || []).map((member) => {
                      const memberName =
                        member.name || member.user?.name || "Unnamed Member";
                      const memberEmail =
                        member.email || member.user?.email || "—";
                      const memberProgress = member.monthlyTarget
                        ? ((member.achieved || 0) / member.monthlyTarget) * 100
                        : 0;
                      const daysSinceLogin = Math.floor(
                        (new Date() -
                          new Date(member.lastLogin || Date.now())) /
                        (1000 * 60 * 60 * 24)
                      );

                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                        >
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {memberName}
                              {daysSinceLogin > 3 && (
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                  Inactive {daysSinceLogin}d
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {memberEmail}
                            </div>
                            {/* <div className="text-xs text-gray-500">
                              Last login: {member.lastLogin || "—"}
                            </div> */}
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-xs text-gray-600">Target</div>
                              <div className="font-medium">
                                {member.monthlyTarget ?? 0}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-xs text-gray-600">
                                Achieved
                              </div>
                              <div className="font-medium">
                                {member.achieved ?? 0}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-xs text-gray-600">
                                Progress
                              </div>
                              <div
                                className={`font-medium ${memberProgress >= 100
                                  ? "text-green-600"
                                  : memberProgress >= 75
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                  }`}
                              >
                                {memberProgress.toFixed(1)}%
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                removeMemberFromTeam(team.id, member.id)
                              }
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {showAddMemberFor === team.id && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <select
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) return;
                          addMemberToTeam(team.id, val);
                          setShowAddMemberFor(null);
                        }}
                      >
                        <option value="">Select employee to add</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => setShowAddMemberFor(null)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
