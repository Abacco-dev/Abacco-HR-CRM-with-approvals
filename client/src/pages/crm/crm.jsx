// client/src/pages/crm/Clients.jsx
import React, { useEffect, useState } from "react";
import { apiGet } from "../../services/api";

const Clients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    apiGet("/crm/clients").then(setClients);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <ul className="space-y-2">
        {clients.map((c) => (
          <li key={c.id} className="p-3 border rounded shadow">
            {c.name} – {c.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clients;
