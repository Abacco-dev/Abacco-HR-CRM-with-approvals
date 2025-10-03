// client/src/pages/crm/Deals.jsx
import React, { useEffect, useState } from "react";
import { apiGet } from "../../services/api";

const Deals = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    apiGet("/crm/deals").then(setDeals);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Deals</h1>
      <ul className="space-y-2">
        {deals.map((d) => (
          <li key={d.id} className="p-3 border rounded shadow">
            {d.title} – {d.amount} USD
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Deals;
