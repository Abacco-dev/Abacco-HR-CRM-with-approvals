import { Users, Target, TrendingUp, BarChart3 } from "lucide-react";

export default function TeamAnalytics({ teams = [], getTeamProgress }) {
    const renderAnalytics = () => (
        <div className="space-y-6">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Teams</p>
                            <p className="text-2xl font-bold">{teams.length}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Members</p>
                            <p className="text-2xl font-bold">
                                {teams.reduce((sum, team) => sum + (team.members?.length || 0), 0)}
                            </p>
                        </div>
                        <Target className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Overall Target (Leads)</p>
                            <p className="text-2xl font-bold">
                                {teams.reduce((sum, team) => sum + (team.totalLeads || 0), 0).toLocaleString()}
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Overall Achievement (Leads)</p>
                            <p className="text-2xl font-bold">
                                {teams.reduce(
                                    (sum, team) =>
                                        sum +
                                        team.members.reduce(
                                            (memberSum, member) => memberSum + (member.achievedLeads || 0),
                                            0
                                        ),
                                    0
                                ).toLocaleString()}
                            </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-orange-600" />
                    </div>
                </div>
            </div>

            {/* Team Performance Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Team Performance Overview</h3>
                <div className="space-y-4">
                    {teams.map((team) => {
                        const { totalLeads, totalAchieved, progressPercentage } = getTeamProgress(team);
                        return (
                            <div
                                key={team.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded"
                            >
                                <div>
                                    <h4 className="font-medium">{team.name}</h4>
                                    <p className="text-sm text-gray-600">Leader: {team.leader.name}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600">Target: {totalLeads.toLocaleString()} leads</div>
                                        <div className="text-sm text-gray-600">Achieved: {totalAchieved.toLocaleString()} leads</div>
                                    </div>
                                    <div className="w-32 bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full ${progressPercentage >= 100
                                                    ? "bg-green-500"
                                                    : progressPercentage >= 75
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                                }`}
                                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-right">
                                        <div
                                            className={`font-semibold ${progressPercentage >= 100
                                                    ? "text-green-600"
                                                    : progressPercentage >= 75
                                                        ? "text-yellow-600"
                                                        : "text-red-600"
                                                }`}
                                        >
                                            {progressPercentage.toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Historical Performance */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Historical Performance</h3>
                <div className="space-y-6">
                    {teams.map((team) => (
                        <div key={team.id}>
                            <h4 className="font-medium mb-2">{team.name}</h4>
                            <div className="space-y-2">
                                {team.history?.map((record, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center p-3 bg-gray-50 rounded"
                                    >
                                        <span className="font-medium">{record.month}</span>
                                        <span className="text-sm">
                                            Target: {Number(record?.target || 0).toLocaleString()} leads
                                        </span>
                                        <span className="text-sm">
                                            Achieved: {Number(record?.achieved || 0).toLocaleString()}
                                        </span>
                                        <span
                                            className={`text-sm font-semibold ${record?.target && (record.achieved / record.target) * 100 >= 100
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                }`}
                                        >
                                            {record?.target
                                                ? ((record.achieved / record.target) * 100).toFixed(1)
                                                : "0.0"}
                                            %
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Team Analytics</h3>
            {teams && teams.length > 0 ? (
                renderAnalytics()
            ) : (
                <p className="text-gray-600">Analytics charts and performance summary will appear here.</p>
            )}
        </div>
    );
}
