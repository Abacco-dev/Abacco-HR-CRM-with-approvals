const API_BASE = "http://localhost:4000/api";

export async function fetchEmployees() {
  const res = await fetch(`${API_BASE}/employees`);
  return res.json();
}

export async function addEmployee(employee) {
  const res = await fetch(`${API_BASE}/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  });
  return res.json();
}
