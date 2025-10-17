export default function TabNavigation({ currentTab, setCurrentTab }) {
  const tabs = [
    { id: "attendance", label: "Attendance Records" },
    { id: "leaves", label: "Leave Management" },
    { id: "overtime", label: "Overtime" },
    { id: "shifts", label: "Shift Schedules" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="flex flex-wrap border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium ${
              currentTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
