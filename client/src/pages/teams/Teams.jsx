import { useState, useEffect } from 'react';
import {
  Plus, Users, Target, Edit, Trash2, ChevronDown, ChevronRight,
  MessageSquare, Bell, Calendar, TrendingUp, AlertTriangle,
  Send, X, BarChart3, Filter, Download
} from 'lucide-react';

export default function EnhancedTeamManagement() {
  // HR User (simulated)
  const hrUser = { id: 1, name: "HR Admin" };

  // Initial state
  const [employees, setEmployees] = useState([
    { id: 12, name: "Ramesh Iyer", email: "ramesh@company.com", role: "Employee" },
    { id: 13, name: "Lakshmi Pillai", email: "lakshmi@company.com", role: "Employee" },
    { id: 14, name: "Karthik Menon", email: "karthik@company.com", role: "Employee" },
    { id: 15, name: "Meera Kapoor", email: "meera@company.com", role: "Employee" }
  ]);

  const [teams, setTeams] = useState([
    {
      id: 1,
      name: "Alpha Team",
      leader: { 
        id: 101, 
        name: "Ashok Kumar",
        teamTarget: 100,
        teamAchieved: 95
      },
      monthlyTarget: 100,
      members: [
        { id: 201, name: "Arjun Reddy", achieved: 35, monthlyTarget: 40, lastLogin: "2024-01-15" },
        { id: 202, name: "Raj Patel", achieved: 40, monthlyTarget: 35, lastLogin: "2024-01-16" },
        { id: 203, name: "Neha Verma", achieved: 20, monthlyTarget: 25, lastLogin: "2024-01-14" }
      ]
    },
    {
      id: 2,
      name: "Beta Team",
      leader: { 
        id: 102, 
        name: "Priya Sharma",
        teamTarget: 80,
        teamAchieved: 75
      },
      monthlyTarget: 80,
      members: [
        { id: 204, name: "Deepika Rao", achieved: 25, monthlyTarget: 30, lastLogin: "2024-01-10" },
        { id: 205, name: "Lakshmi Pillai", achieved: 30, monthlyTarget: 25, lastLogin: "2024-01-16" },
        { id: 206, name: "Aman Joshi", achieved: 20, monthlyTarget: 25, lastLogin: "2024-01-15" }
      ]
    },
    {
      id: 3,
      name: "Gamma Team",
      leader: { 
        id: 103, 
        name: "Kiran Desai",
        teamTarget: 120,
        teamAchieved: 115
      },
      monthlyTarget: 120,
      members: [
        { id: 207, name: "Meera Kapoor", achieved: 50, monthlyTarget: 45, lastLogin: "2024-01-16" },
        { id: 208, name: "Suresh Babu", achieved: 40, monthlyTarget: 40, lastLogin: "2024-01-14" },
        { id: 209, name: "Anjali Jain", achieved: 25, monthlyTarget: 35, lastLogin: "2024-01-13" }
      ]
    },
    {
      id: 4,
      name: "Delta Team",
      leader: { 
        id: 104, 
        name: "Rahul Nair",
        teamTarget: 90,
        teamAchieved: 85
      },
      monthlyTarget: 90,
      members: [
        { id: 210, name: "Vinod Mehta", achieved: 30, monthlyTarget: 35, lastLogin: "2024-01-16" },
        { id: 211, name: "Sneha Singh", achieved: 35, monthlyTarget: 30, lastLogin: "2024-01-15" },
        { id: 212, name: "Karthik Menon", achieved: 20, monthlyTarget: 25, lastLogin: "2024-01-12" }
      ]
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      teamId: 1,
      senderId: 1,
      senderName: "Ashok Kumar",
      message: "Team meeting scheduled for tomorrow at 10 AM to discuss Q1 targets.",
      timestamp: "2024-01-16T09:00:00Z",
      type: "announcement"
    },
    {
      id: 2,
      teamId: 1,
      senderId: 2,
      senderName: "Priya Sharma",
      message: "Need assistance with the Johnson account. Anyone available?",
      timestamp: "2024-01-16T14:30:00Z",
      type: "request"
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      teamId: 1,
      message: "Arjun Reddy is 52% behind monthly target",
      type: "warning",
      timestamp: "2024-01-16T08:00:00Z",
      email: "arjun@company.com"
    },
    {
      id: 2,
      teamId: 2,
      message: "Deepika Rao hasn't logged in for 5 days",
      type: "alert",
      timestamp: "2024-01-16T08:15:00Z",
      email: "deepika@company.com"
    },
    {
      id: 3,
      teamId: 1,
      message: "Raj Patel exceeded target by 115%",
      type: "success",
      timestamp: "2024-01-16T09:00:00Z",
      email: "bijakalpramod@gmail.com"
    }
  ]);

  // Component state
  const [expandedTeams, setExpandedTeams] = useState([]);
  const [activeView, setActiveView] = useState('overview');
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showAddMember, setShowAddMember] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(null);
  const [editingTarget, setEditingTarget] = useState(null);
  const [newTeam, setNewTeam] = useState({ name: '', leaderId: '' });
  const [newMessage, setNewMessage] = useState("");
  const [sendTo, setSendTo] = useState("allTeamLeaders");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedTeamLeaders, setSelectedTeamLeaders] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');

  // Utility functions
  const toggleTeamExpansion = (teamId) => {
    setExpandedTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const getTeamProgress = (team) => {
    const totalAchieved = team.members.reduce((sum, member) => sum + member.achieved, 0);
    const progressPercentage = team.monthlyTarget
      ? (totalAchieved / team.monthlyTarget) * 100
      : 0;

    return { totalAchieved, progressPercentage };
  };

  const getAlerts = (team) => {
    const alerts = [];
    team.members.forEach(member => {
      const progress = member.monthlyTarget ? (member.achieved / member.monthlyTarget) * 100 : 0;

      if (progress < 50) {
        alerts.push({
          type: 'critical',
          message: `${member.name} is significantly behind target (${progress.toFixed(1)}%)`
        });
      } else if (progress < 75) {
        alerts.push({
          type: 'warning',
          message: `${member.name} needs attention (${progress.toFixed(1)}%)`
        });
      } else if (progress > 110) {
        alerts.push({
          type: 'success',
          message: `${member.name} exceeded target (${progress.toFixed(1)}%)`
        });
      }
    });
    return alerts;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    let recipients = [];
    let newMessages = [];

    switch (sendTo) {
      case "allTeamLeaders":
        recipients = teams.map(team => team.leader.id);
        break;
      case "teamLeader":
        recipients = [...selectedTeamLeaders];
        break;
      case "allEmployees":
        recipients = employees.map(emp => emp.id);
        break;
      case "employee":
        recipients = [...selectedEmployees];
        break;
      default:
        break;
    }

    const timestamp = new Date().toISOString();

    // Create messages for each recipient
    recipients.forEach((recipientId, index) => {
      newMessages.push({
        id: messages.length + index + 1,
        teamId: null,
        senderId: hrUser.id,
        senderName: hrUser.name,
        message: newMessage,
        timestamp,
        type: "announcement",
      });
    });

    setMessages(prev => [...prev, ...newMessages]);
    setNewMessage("");
    setSelectedTeamLeaders([]);
    setSelectedEmployees([]);
  };

  // CRUD operations
  const createTeam = () => {
    if (!newTeam.name || !newTeam.leaderId) {
      alert('Please fill in all fields');
      return;
    }

    const selectedLeader = employees.find(emp => emp.id === parseInt(newTeam.leaderId));
    if (!selectedLeader) {
      alert('Please select a valid leader');
      return;
    }

    const team = {
      id: Date.now(),
      name: newTeam.name,
      leader: { 
        id: selectedLeader.id, 
        name: selectedLeader.name,
        teamTarget: 0,
        teamAchieved: 0
      },
      monthlyTarget: 0,
      members: []
    };

    setTeams(prev => [...prev, team]);
    setEmployees(prev => prev.filter(emp => emp.id !== selectedLeader.id));
    setNewTeam({ name: '', leaderId: '' });
    setShowCreateTeam(false);
  };

  const updateTarget = (teamId, memberId, newTarget) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        if (memberId === 'team') {
          return { ...team, monthlyTarget: parseInt(newTarget) || 0 };
        } else {
          return {
            ...team,
            members: team.members.map(member =>
              member.id === memberId
                ? { ...member, monthlyTarget: parseInt(newTarget) || 0 }
                : member
            )
          };
        }
      }
      return team;
    }));
    setEditingTarget(null);
  };

  const sendMessage = (teamId) => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      teamId,
      senderId: hrUser.id,
      senderName: hrUser.name,
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: "message"
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const addMemberToTeam = (teamId, employeeId) => {
    const employee = employees.find(emp => emp.id === parseInt(employeeId));
    if (!employee) return;

    const newMember = {
      ...employee,
      achieved: 0,
      monthlyTarget: 0,
      lastLogin: new Date().toISOString().split('T')[0]
    };

    setTeams(prev => prev.map(team =>
      team.id === teamId
        ? { ...team, members: [...team.members, newMember] }
        : team
    ));

    setEmployees(prev => prev.filter(emp => emp.id !== employee.id));
    setShowAddMember(null);
  };

  const removeMemberFromTeam = (teamId, memberId) => {
    const team = teams.find(t => t.id === teamId);
    const member = team.members.find(m => m.id === memberId);

    setTeams(prev => prev.map(t =>
      t.id === teamId
        ? { ...t, members: t.members.filter(m => m.id !== memberId) }
        : t
    ));

    setEmployees(prev => [...prev, { 
      id: member.id, 
      name: member.name, 
      email: member.email, 
      role: 'Employee' 
    }]);
  };

  const deleteTeam = (teamId) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    const team = teams.find(t => t.id === teamId);

    const membersToAdd = [
      { id: team.leader.id, name: team.leader.name, email: team.leader.email, role: 'Employee' },
      ...team.members.map(m => ({ id: m.id, name: m.name, email: m.email, role: 'Employee' }))
    ];

    setEmployees(prev => [...prev, ...membersToAdd]);
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  // Generate dynamic notifications
  const generateDynamicNotifications = () => {
    const dynamicNotifications = [];
    const today = new Date();

    teams.forEach(team => {
      team.members.forEach(member => {
        const lastLoginDate = new Date(member.lastLogin);
        const daysSinceLogin = Math.floor((today - lastLoginDate) / (1000 * 60 * 60 * 24));

        // Late login notification
        if (daysSinceLogin >= 3) {
          dynamicNotifications.push({
            id: `late-${member.id}`,
            teamId: team.id,
            message: `${member.name} hasn't logged in for ${daysSinceLogin} days. LOP may apply.`,
            type: "alert",
            timestamp: today.toISOString(),
            email: member.email
          });
        }

        // Performance notification
        if (member.achieved < member.monthlyTarget) {
          dynamicNotifications.push({
            id: `perf-${member.id}`,
            teamId: team.id,
            message: `${member.name} is behind target by ${member.monthlyTarget - member.achieved}`,
            type: "warning",
            timestamp: today.toISOString(),
            email: member.email
          });
        }
      });
    });

    return dynamicNotifications;
  };

  // Combine static and dynamic notifications
  const allNotifications = [...notifications, ...generateDynamicNotifications()];

  // Render different views
  const renderOverview = () => (
    <div className="space-y-4">
      {teams.map(team => {
        const { totalAchieved, progressPercentage } = getTeamProgress(team);
        const alerts = getAlerts(team);
        const isExpanded = expandedTeams.includes(team.id);

        return (
          <div key={team.id} className="bg-white rounded-lg shadow-sm border">
            {/* Team Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleTeamExpansion(team.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{team.name}</h3>
                    <p className="text-gray-600">Leader: {team.leader.name}</p>
                  </div>
                  {alerts.length > 0 && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">{alerts.length} alert{alerts.length > 1 ? 's' : ''}</span>
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
                    <div className="text-sm text-gray-600">Team Target</div>
                    <div className="font-semibold">
                      {editingTarget === `team-${team.id}` ? (
                        <input
                          type="number"
                          defaultValue={team.monthlyTarget}
                          onBlur={(e) => updateTarget(team.id, 'team', e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && updateTarget(team.id, 'team', e.target.value)}
                          className="w-20 border rounded px-2 py-1 text-sm"
                          autoFocus
                        />
                      ) : (
                        <span
                          onClick={() => setEditingTarget(`team-${team.id}`)}
                          className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                        >
                          {team.monthlyTarget?.toLocaleString() || 0}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Achieved</div>
                    <div className="font-semibold">{totalAchieved.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Progress</div>
                    <div className={`font-semibold ${progressPercentage >= 100 ? 'text-green-600' :
                      progressPercentage >= 75 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                      {progressPercentage.toFixed(1)}%
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

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${progressPercentage >= 100 ? 'bg-green-600' :
                      progressPercentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Alerts */}
              {alerts.length > 0 && (
                <div className="mt-4 space-y-2">
                  {alerts.slice(0, 2).map((alert, index) => (
                    <div
                      key={index}
                      className={`text-sm p-2 rounded flex items-center gap-2 ${alert.type === 'critical' ? 'bg-red-50 text-red-700' :
                        alert.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-green-50 text-green-700'
                        }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {alert.message}
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
                  <Users className="w-4 h-4" />
                  <span>{team.members.length} members</span>
                </div>
                {isExpanded && (
                  <button
                    onClick={() => setShowAddMember(team.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Member
                  </button>
                )}
              </div>
            </div>

            {/* Team Members (Expanded) */}
            {isExpanded && (
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Team Members</h4>
                {team.members.length === 0 ? (
                  <p className="text-gray-500">No members added yet.</p>
                ) : (
                  <div className="grid gap-3">
                    {team.members.map(member => {
                      const memberProgress = member.monthlyTarget
                        ? (member.achieved / member.monthlyTarget) * 100
                        : 0;
                      const daysSinceLogin = Math.floor((new Date() - new Date(member.lastLogin)) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <div key={member.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {member.name}
                              {daysSinceLogin > 3 && (
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                  Inactive {daysSinceLogin}d
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">{member.email}</div>
                            <div className="text-xs text-gray-500">Last login: {member.lastLogin}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-xs text-gray-600">Target</div>
                              <div className="font-medium">{member.monthlyTarget ?? 0}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-600">Achieved</div>
                              <div className="font-medium">{member.achieved ?? 0}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-600">Progress</div>
                              <div className={`font-medium ${
                                memberProgress >= 100 ? 'text-green-600' : 
                                memberProgress >= 75 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {memberProgress.toFixed(1)}%
                              </div>
                            </div>
                            <button
                              onClick={() => removeMemberFromTeam(team.id, member.id)}
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

                {/* Add Member Dropdown */}
                {showAddMember === team.id && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            addMemberToTeam(team.id, e.target.value);
                          }
                        }}
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="">Select employee to add</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => setShowAddMember(null)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-2 rounded transition-colors"
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
              <p className="text-2xl font-bold">{teams.reduce((sum, team) => sum + team.members.length, 0)}</p>
            </div>
            <Target className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Overall Target</p>
              <p className="text-2xl font-bold">{teams.reduce((sum, team) => sum + team.monthlyTarget, 0).toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Overall Achievement</p>
              <p className="text-2xl font-bold">{teams.reduce((sum, team) => sum + team.members.reduce((memberSum, member) => memberSum + member.achieved, 0), 0).toLocaleString()}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Team Performance Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Team Performance Overview</h3>
        <div className="space-y-4">
          {teams.map(team => {
            const { totalAchieved, progressPercentage } = getTeamProgress(team);
            return (
              <div key={team.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <h4 className="font-medium">{team.name}</h4>
                  <p className="text-sm text-gray-600">Leader: {team.leader.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Target: {team.monthlyTarget.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Achieved: {totalAchieved.toLocaleString()}</div>
                  </div>
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${progressPercentage >= 100 ? 'bg-green-500' :
                        progressPercentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${progressPercentage >= 100 ? 'text-green-600' :
                      progressPercentage >= 75 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                      {progressPercentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderMessages = () => {
    const filteredMessages = selectedTeamFilter === 'all'
      ? messages
      : messages.filter(msg => msg.teamId === parseInt(selectedTeamFilter));

    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
          <h3 className="text-lg font-semibold mb-3">Send Message</h3>

          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full border border-gray-300 rounded p-2 mb-3"
          />

          <div className="flex items-center gap-3 mb-3">
            <select
              value={sendTo}
              onChange={(e) => setSendTo(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="allTeamLeaders">All Team Leaders</option>
              <option value="teamLeader">Individual Team Leader</option>
              <option value="allEmployees">All Employees</option>
              <option value="employee">Individual Employee</option>
            </select>

            {sendTo === "teamLeader" && (
              <div className="border rounded p-2 max-h-40 overflow-y-auto">
                {teams.map(team => (
                  <label key={team.id} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      value={team.leader.id}
                      checked={selectedTeamLeaders.includes(team.leader.id)}
                      onChange={(e) => {
                        const id = parseInt(e.target.value);
                        setSelectedTeamLeaders(prev =>
                          prev.includes(id)
                            ? prev.filter(x => x !== id)
                            : [...prev, id]
                        );
                      }}
                    />
                    {team.name} ({team.leader.name})
                  </label>
                ))}
              </div>
            )}

            {sendTo === "employee" && (
              <div className="border rounded p-2 max-h-40 overflow-y-auto">
                {employees.map(emp => (
                  <label key={emp.id} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      value={emp.id}
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={(e) => {
                        const id = parseInt(e.target.value);
                        setSelectedEmployees(prev =>
                          prev.includes(id)
                            ? prev.filter(x => x !== id)
                            : [...prev, id]
                        );
                      }}
                    />
                    {emp.name}
                  </label>
                ))}
              </div>
            )}

            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Team Communications</h3>
            <select
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="all">All Teams</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredMessages.map(message => {
              const team = teams.find(t => t.id === message.teamId);
              return (
                <div key={message.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{message.senderName}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">{message.message}</div>
                  <div className="text-xs text-blue-600">{team?.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderNotifications = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Active Notifications</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {allNotifications.map(notification => {
            const team = teams.find(t => t.id === notification.teamId);

            return (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 ${
                  notification.type === "success"
                    ? "border-green-500 bg-green-50"
                    : notification.type === "warning"
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className={`font-medium ${
                        notification.type === "success"
                          ? "text-green-800"
                          : notification.type === "warning"
                          ? "text-yellow-800"
                          : "text-red-800"
                      }`}
                    >
                      {notification.message}
                    </div>
                    <div className="text-sm text-gray-600">
                      {team?.name || "N/A"} | {notification.email}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Management System</h1>
              <p className="text-gray-600">Comprehensive team management with targets, communication & analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-red-600">
                <Bell className="w-4 h-4" />
                <span className="text-sm">{allNotifications.length}</span>
              </div>
              <button
                onClick={() => setShowCreateTeam(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Team
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-6 mt-6">
            {[
              { key: 'overview', label: 'Overview', icon: Users },
              { key: 'analytics', label: 'Analytics', icon: BarChart3 },
              { key: 'messages', label: 'Messages', icon: MessageSquare },
              { key: 'notifications', label: 'Notifications', icon: Bell }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeView === key
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {key === 'notifications' && allNotifications.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {allNotifications.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'analytics' && renderAnalytics()}
        {activeView === 'messages' && renderMessages()}
        {activeView === 'notifications' && renderNotifications()}
      </div>

      {/* Create Team Modal */}
      {showCreateTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Team</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Leader</label>
                <select
                  value={newTeam.leaderId}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, leaderId: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a leader</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={createTeam}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex-1 transition-colors"
              >
                Create Team
              </button>
              <button
                onClick={() => {
                  setShowCreateTeam(false);
                  setNewTeam({ name: '', leaderId: '' });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg flex-1 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Team Messages - {teams.find(t => t.id === showMessageModal)?.name}
              </h2>
              <button
                onClick={() => setShowMessageModal(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages
                .filter(msg => msg.teamId === showMessageModal)
                .map(message => (
                  <div key={message.id} className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">{message.senderName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">{message.message}</div>
                  </div>
                ))}
            </div>

            {/* Send Message */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(showMessageModal)}
              />
              <button
                onClick={() => sendMessage(showMessageModal)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Available Employees */}
      {employees.length > 0 && activeView === 'overview' && (
        <div className="max-w-7xl mx-auto px-6 pb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Available Employees ({employees.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {employees.map(emp => (
                <div key={emp.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium">{emp.name}</div>
                  <div className="text-sm text-gray-600">{emp.email}</div>
                  <div className="text-xs text-gray-500 mt-1">Ready to be assigned</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}