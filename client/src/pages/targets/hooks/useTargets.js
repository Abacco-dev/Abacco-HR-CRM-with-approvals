// src/targets/hooks/useTargets.js
import { useState, useEffect } from "react";
import { useAuth } from '../../../contexts/AuthContext.jsx';
import { dummyTargets, dummyEmployees } from "../data/dummyData.js";

/**
 * useTargets - simple hook that provides targets, employees, reminders and helper actions.
 * Replace the dummy data and functions with real API calls when you connect backend.
 */
export function useTargets() {
  const auth = useAuth?.(); // safe call if you have an AuthContext
  const api = auth?.api;
  const currentUser = auth?.currentUser || auth?.user || null;

  const [targets, setTargets] = useState(dummyTargets);
  const [employees, setEmployees] = useState(dummyEmployees);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);

  // show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  // fetch targets/employees - currently reads dummy data. Replace with API calls later.
  const fetchAll = async () => {
    try {
      setLoading(true);
      if (api) {
        // Example: const res = await api.get('/api/targets'); setTargets(res.data)
        // For now keep dummy data
      }
      setTargets(dummyTargets);
      setEmployees(dummyEmployees);
    } catch (err) {
      console.error("fetchAll error:", err);
      showNotification("Failed to fetch target data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    // compute pending reminders from available targets
    const today = new Date().toISOString().split("T")[0];
    const pending = targets.flatMap(t => (t.reminders || []).filter(r => !r.sent && r.date <= today));
    setReminders(pending);
  }, [targets]);

  // create target (dummy, push locally)
  const createTarget = async (targetPayload) => {
    const newTarget = { id: Date.now(), ...targetPayload };
    setTargets(prev => [newTarget, ...prev]);
    showNotification("Target created (local)", "success");
    return newTarget;
  };

  // update progress (local)
  const updateTargetProgress = async (id, progressDelta) => {
    setTargets(prev => prev.map(t => t.id === id ? { ...t, progress: Math.min(100, t.progress + progressDelta), achievedValue: t.achievedValue + (t.targetValue * progressDelta / 100) } : t));
    showNotification("Target progress updated (local)", "success");
  };

  // add employee (requests approval in your original app - here simply add to local)
  const addEmployee = async (employeePayload) => {
    const newEmp = { id: `e${Date.now()}`, ...employeePayload };
    setEmployees(prev => [newEmp, ...prev]);
    showNotification("Employee added (local)", "success");
    return newEmp;
  };

  return {
    api,
    currentUser,
    loading,
    targets,
    setTargets,
    employees,
    setEmployees,
    reminders,
    notification,
    showNotification,
    fetchAll,
    createTarget,
    updateTargetProgress,
    addEmployee
  };
}
