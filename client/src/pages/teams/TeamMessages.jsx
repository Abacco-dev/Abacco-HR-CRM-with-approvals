import React, { useState, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";
import MessageModal from "./MessageModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function TeamMessages({ teamId }) {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/teams/${teamId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    if (teamId) fetchMessages();
  }, [teamId]);

  return (
    <div className="p-6 bg-white rounded-lg shadow border mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> Team Messages
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          <Send size={16} /> New Message
        </button>
      </div>

      {messages.length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className="border-b pb-2 text-sm text-gray-700"
            >
              <strong>{msg.senderName}</strong>: {msg.content}
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <MessageModal
          teamId={teamId}
          onClose={() => setShowModal(false)}
          onMessageSent={fetchMessages}
        />
      )}
    </div>
  );
}
