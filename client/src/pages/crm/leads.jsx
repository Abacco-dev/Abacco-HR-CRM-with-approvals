// client/src/pages/crm/Leads.jsx
import React, { useEffect, useState } from "react";
import { apiGet } from "../../services/api";

const Leads = () => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    apiGet("/crm/leads").then(setLeads);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leads</h1>
      <ul className="space-y-2">
        {leads.map((l) => (
          <li key={l.id} className="p-3 border rounded shadow">
            {l.name} – {l.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leads;
