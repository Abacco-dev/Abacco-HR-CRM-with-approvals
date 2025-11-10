// src/pages/teams/MessageModal.jsx
import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function MessageModal({ teamId, onClose = () => { }, onMessageSent = () => { } }) {
  const [message, setMessage] = useState("");
  const [teamMessages, setTeamMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!teamId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/teams/${teamId}/messages`, { headers: { Authorization: token ? `Bearer ${token}` : "" } });
        if (!res.ok) return;
        const data = await res.json();
        setTeamMessages(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [teamId]);

  const handleSend = async (e) => {
    e?.preventDefault?.();
    if (!message.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/teams/${teamId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ content: message }),
      });
      if (!res.ok) throw new Error("Failed to send");
      const saved = await res.json();
      setTeamMessages((prev) => [...prev, saved]);
      onMessageSent({ teamId, message: saved.content || saved.message, id: saved.id });
      setMessage("");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Team Messages</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {loading ? <div className="text-center text-gray-500">Loading...</div> : (teamMessages.length === 0 ? <div className="text-gray-500">No messages yet.</div> : teamMessages.map((m) => (
            <div key={m.id} className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-sm">{m.sender?.name || m.senderName}</span>
                <span className="text-xs text-gray-500">{new Date(m.createdAt || m.timestamp).toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-700">{m.content || m.message}</div>
            </div>
          )))}
        </div>

        <form className="flex gap-2" onSubmit={handleSend}>
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." className="flex-1 border border-gray-300 rounded px-3 py-2" onKeyDown={(e) => e.key === "Enter" && handleSend(e)} />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">Send</button>
        </form>
      </div>
    </div>
  );
}
