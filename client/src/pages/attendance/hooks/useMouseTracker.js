// src/pages/attendes/hooks/useMouseTracker.js
/**
 * useMouseTracker
 *
 * Tracks:
 *  - mouse movement count (movementCount)
 *  - right-click count (rightClickCount)
 *  - activeSeconds (seconds during which mouse moved at least once per interval)
 *
 * Behavior & constraints:
 *  - Only counts events that occur during company working hours (17:30 -> 03:30) and NOT during breaks.
 *  - Uses window events: mousemove, contextmenu, visibilitychange, focus, blur.
 *  - Sends aggregated payload to backend POST /api/attendance/activity periodically (default: every 60s).
 *
 * Limitations:
 *  - A browser cannot track OS-level mouse movement when the browser is closed or the user is outside the browser.
 *  - When tab is not visible, mousemove events inside that tab won't fire; we use visibility/focus heuristics to keep data consistent.
 *
 * Usage:
 *  const { movementCount, rightClickCount, activeSeconds } = useMouseTracker(employeeId, { sendIntervalMs: 60000 })
 *
 */

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { isWorkingTimestamp, secondsToMinutesRounded } from "../utils/workTimeUtils";

export default function useMouseTracker(employeeId, options = {}) {
  const sendIntervalMs = options.sendIntervalMs || 60000; // default send every minute
  const activeBucketSecondsWindow = options.activeBucketSecondsWindow || 5; // consider activity per 5s window

  const [movementCount, setMovementCount] = useState(0);
  const [rightClickCount, setRightClickCount] = useState(0);
  const [activeSeconds, setActiveSeconds] = useState(0);

  // internal counters (refs to avoid rebind)
  const moveRef = useRef(0);
  const clickRef = useRef(0);
  const lastMoveTimestampRef = useRef(0);
  const lastActiveTickRef = useRef(0);
  const activeSecondsRef = useRef(0);
  const visibleRef = useRef(document.visibilityState === "visible");

  // Update react state periodically from refs
  useEffect(() => {
    const updater = setInterval(() => {
      setMovementCount(moveRef.current);
      setRightClickCount(clickRef.current);
      setActiveSeconds(activeSecondsRef.current);
    }, 1000);
    return () => clearInterval(updater);
  }, []);

  useEffect(() => {
    // helper that only counts an event if timestamp is within work hours & not during break
    function shouldCountEvent(ts = new Date()) {
      try {
        return isWorkingTimestamp(new Date(ts));
      } catch (e) {
        return false;
      }
    }

    function handleMouseMove(e) {
      const now = new Date();
      if (!shouldCountEvent(now)) return;

      // Murmur: only count movement when significant change — but we use raw mousemove for simplicity.
      moveRef.current += 1;
      lastMoveTimestampRef.current = Date.now();

      // Manage active seconds: if last tick older than activeBucketSecondsWindow, add that window.
      const lastTick = lastActiveTickRef.current;
      if (!lastTick || Date.now() - lastTick >= activeBucketSecondsWindow * 1000) {
        activeSecondsRef.current += activeBucketSecondsWindow;
        lastActiveTickRef.current = Date.now();
      }
    }

    function handleContextMenu(e) {
      const now = new Date();
      if (!shouldCountEvent(now)) return;
      e.preventDefault(); // keep default prevented so rightClickCount increments reliably
      clickRef.current += 1;
    }

    function handleVisibilityChange() {
      visibleRef.current = document.visibilityState === "visible";
      // If tab becomes visible again, we can optionally send an immediate heartbeat.
    }

    function handleFocus() {
      visibleRef.current = true;
    }
    function handleBlur() {
      visibleRef.current = false;
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    // Periodic sender
    const sender = setInterval(async () => {
      // Compose metrics
      const payload = {
        employeeId,
        date: new Date().toISOString().split("T")[0],
        movementCount: moveRef.current,
        rightClickCount: clickRef.current,
        // active working minutes inside shift (rounded down)
        activeMinutes: secondsToMinutesRounded(activeSecondsRef.current),
        activeSeconds: activeSecondsRef.current,
        ts: new Date().toISOString(),
      };

      try {
        // send but don't block UI; backend route handles persistence
        await axios.post("/api/attendance/activity", payload).catch(() => {
          // swallow network errors; console for debugging
          // (you can add queued retry logic here)
        });
      } catch (err) {
        // silence network/axios top-level errors to avoid UI crashes
        console.error("Failed to send activity:", err.message);
      }
    }, sendIntervalMs);

    // On unload, send final small synchronous beacon using navigator.sendBeacon when available
    function handleBeforeUnload() {
      const finalPayload = {
        employeeId,
        date: new Date().toISOString().split("T")[0],
        movementCount: moveRef.current,
        rightClickCount: clickRef.current,
        activeMinutes: secondsToMinutesRounded(activeSecondsRef.current),
        ts: new Date().toISOString(),
      };
      try {
        const blob = new Blob([JSON.stringify(finalPayload)], { type: "application/json" });
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/attendance/activity", blob);
        } else {
          // fallback synchronous XHR (not recommended but here for safety)
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/api/attendance/activity", false);
          xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          xhr.send(JSON.stringify(finalPayload));
        }
      } catch (e) {
        // ignore
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // cleanup
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(sender);
    };
  }, [employeeId, activeBucketSecondsWindow, sendIntervalMs]);

  return {
    movementCount,
    rightClickCount,
    activeSeconds,
  };
}
