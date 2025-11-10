// src/pages/teams/Teams.jsx
import React, { useEffect, useState } from "react";
import TeamOverview from "./TeamOverview";
import TeamAnalytics from "./TeamAnalytics";
import TeamMessages from "./TeamMessages";
import TeamNotifications from "./TeamNotifications";
import CreateTeamModal from "./CreateTeamModal";
import MessageModal from "./MessageModal";
import { Bell, Users, BarChart3, MessageSquare } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Teams() {
  const hrUser = { id: "local-hr", name: "HR Admin" };

  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [activeView, setActiveView] = useState("overview");
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(null);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Add state for new team form
  const [newTeam, setNewTeam] = useState({ name: "", leaderId: "" });

  const headersWithAuth = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Fetch core data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [teamsRes, employeesRes, notificationsRes] = await Promise.all([
          fetch(`${API_URL}/api/teams`, { headers: headersWithAuth() }),
          fetch(`${API_URL}/api/employees`, { headers: headersWithAuth() }),
          fetch(`${API_URL}/api/notifications`, { headers: headersWithAuth() }),
        ]);

        const teamsJson = teamsRes.ok ? await teamsRes.json() : [];
        const employeesJson = employeesRes.ok ? await employeesRes.json() : [];
        const notesJson = notificationsRes.ok ? await notificationsRes.json() : [];

        // Normalize: if your backend returns objects with different shapes, adjust here
        setTeams(Array.isArray(teamsJson) ? teamsJson : teamsJson.data || []);
        setEmployees(Array.isArray(employeesJson) ? employeesJson : employeesJson.data || []);
        setNotifications(Array.isArray(notesJson) ? notesJson : notesJson.data || []);
      } catch (err) {
        console.error("Failed to load teams data:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Messages per team are fetched on demand by MessageModal / TeamMessages; keep local cache for quick ui
  const fetchTeamMessages = async (teamId) => {
    try {
      const res = await fetch(`${API_URL}/api/teams/${teamId}/messages`, { headers: headersWithAuth() });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages((prev) => {
        // replace team messages in cache
        const others = prev.filter((m) => m.teamId !== teamId);
        return [...others, ...(Array.isArray(data) ? data : data.data || [])];
      });
      return Array.isArray(data) ? data : data.data || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // Create team
  // Create team (Improved with detailed backend error logging)
  const handleCreateTeam = async () => {
    try {
      const res = await fetch(`${API_URL}/api/teams`, {
        method: "POST",
        headers: headersWithAuth(),
        body: JSON.stringify({ name: newTeam.name, leaderId: newTeam.leaderId }),
      });

      // Read server error messages, if any
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Server error:", data);
        throw new Error(data.error || data.message || "Failed to create team");
      }

      // ✅ Successfully created
      const createdTeam = data;
      setTeams((prev) => [createdTeam, ...prev]);
      setShowCreateTeam(false);
      setNewTeam({ name: "", leaderId: "" });
      alert("✅ Team created successfully!");
    } catch (err) {
      console.error("Create team error:", err);
      alert(`❌ Failed to create team: ${err.message}`);
    }
  };


  // Delete team
  const handleDeleteTeam = async (teamId) => {
    if (!confirm("Are you sure you want to delete this team?")) return;
    try {
      const res = await fetch(`${API_URL}/api/teams/${teamId}`, {
        method: "DELETE",
        headers: headersWithAuth(),
      });
      if (!res.ok) throw new Error("Failed to delete team");
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
    } catch (err) {
      console.error("Delete team error:", err);
      alert("Failed to delete team");
    }
  };

  // Add member
  const handleAddMember = async (teamId, userId) => {
    try {
      const res = await fetch(`${API_URL}/api/teams/${teamId}/members`, {
        method: "POST",
        headers: headersWithAuth(),
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Add member failed");
      const added = await res.json();
      setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, members: [...(t.members || []), added] } : t)));
      // remove from employees list if present
      setEmployees((prev) => prev.filter((e) => e.id !== userId));
    } catch (err) {
      console.error(err);
      alert("Failed to add member");
    }
  };

  // Remove member
  const handleRemoveMember = async (teamId, memberId) => {
    try {
      const res = await fetch(`${API_URL}/api/teams/${teamId}/members/${memberId}`, {
        method: "DELETE",
        headers: headersWithAuth(),
      });
      if (!res.ok) throw new Error("Remove member failed");
      setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, members: (t.members || []).filter((m) => m.id !== memberId) } : t)));
      // Optionally add back to employees (simple)
      // fetch member details or use minimal placeholder
      setEmployees((prev) => [...prev, { id: memberId, name: "Unknown", email: "" }]);
    } catch (err) {
      console.error(err);
      alert("Failed to remove member");
    }
  };

  // Send message to team
  const handleSendMessage = async (teamId, content) => {
    try {
      const res = await fetch(`${API_URL}/api/teams/${teamId}/messages`, {
        method: "POST",
        headers: headersWithAuth(),
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Send message failed");
      const saved = await res.json();
      setMessages((prev) => [...prev, saved]);
      return saved;
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  // Fetch notifications on demand
  const refreshNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notifications`, { headers: headersWithAuth() });
      if (!res.ok) throw new Error("Failed to load notifications");
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <p className="p-8 text-gray-500 text-center">Loading teams...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Teams</h1>
            <p className="text-sm text-gray-600">Manage teams, members, targets and communications</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-red-600">
              <Bell className="w-4 h-4" />
              <span className="text-sm">{notifications.length}</span>
            </div>

            <button onClick={() => setShowCreateTeam(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Create Team
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-3">
          <button onClick={() => setActiveView("overview")} className={`px-3 py-2 rounded ${activeView === "overview" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}>
            <Users className="w-4 h-4 inline" /> Overview
          </button>
          <button onClick={() => setActiveView("analytics")} className={`px-3 py-2 rounded ${activeView === "analytics" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}>
            <BarChart3 className="w-4 h-4 inline" /> Analytics
          </button>
          <button onClick={() => setActiveView("messages")} className={`px-3 py-2 rounded ${activeView === "messages" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}>
            <MessageSquare className="w-4 h-4 inline" /> Messages
          </button>
          <button onClick={() => { setActiveView("notifications"); refreshNotifications(); }} className={`px-3 py-2 rounded ${activeView === "notifications" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}>
            <Bell className="w-4 h-4 inline" /> Notifications <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">{notifications.length}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeView === "overview" && (
          <TeamOverview
            teams={teams}
            employees={employees}
            getAlerts={(team) => {
              // simple client-side alert logic (optionally server-side)
              const alerts = [];
              (team.members || []).forEach((member) => {
                const target = member.monthlyTarget || 0;
                const progress = target ? (member.achieved || 0) / target * 100 : 0;
                if (progress < 50) alerts.push({ type: "critical", message: `${member.name} is significantly behind (${progress.toFixed(1)}%)` });
                else if (progress < 75) alerts.push({ type: "warning", message: `${member.name} needs attention (${progress.toFixed(1)}%)` });
                else if (progress > 110) alerts.push({ type: "success", message: `${member.name} exceeded target (${progress.toFixed(1)}%)` });
              });
              return alerts;
            }}
            addMemberToTeam={handleAddMember}
            removeMemberFromTeam={handleRemoveMember}
            deleteTeam={handleDeleteTeam}
            setShowMessageModal={setShowMessageModal}
          />
        )}

        {activeView === "analytics" && <TeamAnalytics teams={teams} getTeamProgress={(team) => {
          const totalAchieved = (team.members || []).reduce((s, m) => s + (m.achieved || 0), 0);
          const totalLeads = team.monthlyTarget || (team.members || []).reduce((s, m) => s + (m.monthlyTarget || 0), 0);
          const progressPercentage = totalLeads ? (totalAchieved / totalLeads) * 100 : 0;
          return { totalLeads, totalAchieved, progressPercentage };
        }} />}

        {activeView === "messages" && (
          <TeamMessages
            messages={messages}
            teams={teams}
            selectedTeamFilter={selectedTeamFilter}
            setSelectedTeamFilter={setSelectedTeamFilter}
            setShowMessageModal={(id) => {
              setShowMessageModal(id);
              // prefetch messages
              fetchTeamMessages(id).catch(() => { });
            }}
          />
        )}

        {activeView === "notifications" && <TeamNotifications notifications={notifications} teams={teams} />}
      </div>

      {/* CreateTeam modal */}
      {showCreateTeam && (
        <CreateTeamModal
          newTeam={newTeam}
          setNewTeam={setNewTeam}
          createTeam={handleCreateTeam}
          setShowCreateTeam={setShowCreateTeam}
        />
      )}

      {/* Message modal */}
      {showMessageModal && (
        <MessageModal
          teamId={showMessageModal}
          onClose={() => setShowMessageModal(null)}
          onMessageSent={async ({ teamId, message }) => {
            await handleSendMessage(teamId, message);
            // refresh messages for that team
            fetchTeamMessages(teamId).catch(() => { });
          }}
        />
      )}
    </div>
  );
}