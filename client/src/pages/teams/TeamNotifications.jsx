export default function TeamNotifications({ notifications, teams }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Active Notifications</h3>
        <div className="space-y-3">
          {notifications.map(notification => {
            const team = teams.find(t => t.id === notification.teamId);
            return (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg border-l-4 ${
                  notification.type === 'success' ? 'border-green-500 bg-green-50' :
                  notification.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-medium ${
                      notification.type === 'success' ? 'text-green-800' :
                      notification.type === 'warning' ? 'text-yellow-800' :
                      'text-red-800'
                    }`}>
                      {notification.message}
                    </div>
                    <div className="text-sm text-gray-600">{team?.name}</div>
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
}