export default function TabButton({ id, label, icon: Icon, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isActive
          ? "bg-blue-100 text-blue-700 border border-blue-200"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  )
}
