import { X, Send } from 'lucide-react';

export default function MessageModal({ 
  teams, 
  messages, 
  showMessageModal, 
  newMessage, 
  setNewMessage, 
  sendMessage, 
  setShowMessageModal 
}) {
  return (
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
  );
}