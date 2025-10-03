import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@abacco.com");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");

    try {
      await login(email, password);
      navigate("/"); // redirect to dashboard/home
    } catch (e) {
      setErr(e?.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-3 p-6 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center">Abacco HR CRM</h1>

        {err && <div className="text-red-600 text-sm">{err}</div>}

        <input
          className="input w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="input w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn w-full bg-blue-600 text-white" type="submit">
          Login
        </button>

        <p className="text-xs text-gray-500 text-center mt-2">
          Tip: Use seeded credentials admin@abacco.com / admin123
        </p>
      </form>
    </div>
  );
}
