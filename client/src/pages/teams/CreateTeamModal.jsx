export default function CreateTeamModal({ 
  employees, 
  newTeam, 
  setNewTeam, 
  createTeam, 
  setShowCreateTeam 
}) {
  return (
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
  );
}