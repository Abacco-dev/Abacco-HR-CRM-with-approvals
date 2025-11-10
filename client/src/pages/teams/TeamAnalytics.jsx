// src/pages/teams/TeamAnalytics.jsx
import React, { useEffect, useState } from "react";
import { Users, Target, TrendingUp, BarChart3 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function TeamAnalytics({ teams = [], getTeamProgress }) {
    const [serverData, setServerData] = useState(null);

    useEffect(() => {
        // optional: try load server-side team analytics if available
        const load = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/api/analytics/teams`, {
                    headers: { Authorization: token ? `Bearer ${token}` : "" },
                });
                if (!res.ok) return;
                const data = await res.json();
                setServerData(data);
            } catch (err) {
                // gracefully ignore
                console.debug("Team analytics not available from server", err);
            }
        };
        load();
    }, []);

    const dataSource = serverData || teams;

    const totalTeams = (teams || []).length;
    const totalMembers = (teams || []).reduce((s, t) => s + (t.members?.length || 0), 0);
    const overallTarget = (teams || []).reduce((s, t) => s + (t.monthlyTarget || 0), 0);
    const overallAchieved = (teams || []).reduce((s, t) => s + ((t.members || []).reduce((ms, m) => ms + (m.achieved || 0), 0) || 0), 0);

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Team Analytics</h3>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Teams</p>
                                <p className="text-2xl font-bold">{totalTeams}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Members</p>
                                <p className="text-2xl font-bold">{totalMembers}</p>
                            </div>
                            <Target className="w-8 h-8 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Overall Target</p>
                                <p className="text-2xl font-bold">{overallTarget.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Overall Achievement</p>
                                <p className="text-2xl font-bold">{overallAchieved.toLocaleString()}</p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Team Performance Overview</h3>
                    <div className="space-y-4">
                        {(teams || []).map((team) => {
                            const { totalLeads, totalAchieved, progressPercentage } = (getTeamProgress && typeof getTeamProgress === "function") ? getTeamProgress(team) : {
                                totalLeads: team.monthlyTarget || (team.members || []).reduce((s, m) => s + (m.monthlyTarget || 0), 0),
                                totalAchieved: (team.members || []).reduce((s, m) => s + (m.achieved || 0), 0),
                                progressPercentage: 0,
                            };

                            return (
                                <div key={team.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                                    <div>
                                        <h4 className="font-medium">{team.name}</h4>
                                        <p className="text-sm text-gray-600">Leader: {team.leader?.name || "—"}</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">Target: {Number(totalLeads || 0).toLocaleString()}</div>
                                            <div className="text-sm text-gray-600">Achieved: {Number(totalAchieved || 0).toLocaleString()}</div>
                                        </div>

                                        <div className="w-32 bg-gray-200 rounded-full h-3">
                                            <div className={`h-3 rounded-full ${progressPercentage >= 100 ? "bg-green-500" : progressPercentage >= 75 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${Math.min(progressPercentage || 0, 100)}%` }} />
                                        </div>

                                        <div className="text-right">
                                            <div className={`font-semibold ${progressPercentage >= 100 ? "text-green-600" : progressPercentage >= 75 ? "text-yellow-600" : "text-red-600"}`}>{(progressPercentage || 0).toFixed(1)}%</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
