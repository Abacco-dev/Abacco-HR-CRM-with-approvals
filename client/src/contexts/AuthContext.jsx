import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ✅ correct for Vite

const AuthCtx = createContext(null);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
});

export function useAuth() {
  return useContext(AuthCtx);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const decoded = jwtDecode(token);

        // ✅ Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setUser(JSON.parse(userData));
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          logout();
        }
      } catch (err) {
        logout();
      }
    }

    setLoading(false);
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/api/auth/login", { email, password });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout, api, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}

// import { createContext, useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import jwtDecode from "jwt-decode";

// const AuthCtx = createContext(null);

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
// });

// export function useAuth() {
//   return useContext(AuthCtx);
// }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');

//     if (token && userData) {
//       try {
//         const decoded = jwtDecode(token);
//         setUser(JSON.parse(userData));
//         api.defaults.headers.common['Authorization'] = Bearer ${token};
//       } catch {
//         logout();
//       }
//     }
//     setLoading(false);
//   }, []);

//   async function login(email, password) {
//     const { data } = await api.post('/api/auth/login', { email, password });
//     localStorage.setItem('token', data.token);
//     localStorage.setItem('user', JSON.stringify(data.user));
//     api.defaults.headers.common['Authorization'] = Bearer ${data.token};
//     setUser(data.user);
//   }

//   function logout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//     window.location.href = '/login';
//   }

//   return (
//     <AuthCtx.Provider value={{ user, login, logout, api, loading }}>
//       {children}
//     </AuthCtx.Provider>
//   );
// }