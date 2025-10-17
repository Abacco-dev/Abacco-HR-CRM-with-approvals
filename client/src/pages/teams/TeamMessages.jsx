export default function TeamMessages({ 
  messages, 
  teams, 
  selectedTeamFilter, 
  setSelectedTeamFilter,
  setShowMessageModal
}) {
  const filteredMessages = selectedTeamFilter === 'all' 
    ? messages 
    : messages.filter(msg => msg.teamId === parseInt(selectedTeamFilter));

  return (
    <div className="space-y-4">
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
}