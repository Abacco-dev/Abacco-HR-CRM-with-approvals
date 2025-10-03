import React, { useEffect, useState } from "react";
import { fetchEmployees, addEmployee } from "../../services/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    const data = await fetchEmployees();
    setEmployees(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await addEmployee(form);
    setForm({ name: "", email: "", role: "" });
    loadEmployees();
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Employees</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2 rounded"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {employees.map((emp) => (
          <li key={emp.id} className="p-2 border rounded">
            {emp.name} – {emp.email} – {emp.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
