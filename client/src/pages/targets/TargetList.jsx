// src/targets/TargetList.jsx
import React from "react";
import TargetCard from "./TargetCard.jsx";

export default function TargetList({ targets = [], onView }) {
  if (!targets || targets.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center text-gray-500">
        No targets available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {targets.map(t => <TargetCard key={t.id} target={t} onView={onView} />)}
    </div>
  );
}
