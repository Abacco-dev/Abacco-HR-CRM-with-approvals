// src/pages/teams/TeamNotifications.jsx
import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function TeamNotifications({ notifications: initial = [], teams = [] }) {
  const [notifications, setNotifications] = useState(initial);

  useEffect(() => setNotifications(initial), [initial]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ read: true }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Active Notifications</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-gray-500">No notifications.</div>
          ) : (
            notifications.map((notification) => {
              const team = teams.find((t) => t.id === notification.teamId);
              const type = notification.type || notification.ntype || "warning";
              const style =
                type === "success" ? "border-green-500 bg-green-50 text-green-800" :
                  type === "warning" ? "border-yellow-500 bg-yellow-50 text-yellow-800" :
                    "border-red-500 bg-red-50 text-red-800";

              return (
                <div key={notification.id} className={`p-4 rounded-lg border-l-4 ${style} flex justify-between items-start`}>
                  <div>
                    <div className="font-medium">{notification.content || notification.message}</div>
                    <div className="text-sm text-gray-600">{team?.name || "General"} | {notification.email || ""}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{new Date(notification.createdAt || notification.timestamp || Date.now()).toLocaleString()}</div>
                    {!notification.read && <button onClick={() => markAsRead(notification.id)} className="mt-2 text-xs text-blue-600">Mark read</button>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
