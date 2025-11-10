import { useState, useEffect, useRef } from 'react';
import { Clock, Calendar, User, Timer, AlertCircle, CheckCircle, XCircle, Plus, Eye, Download } from 'lucide-react';
import LeaveModal from "./components/LeaveModal";
import OvertimeModal from "./components/OvertimeModal";


export default function AttendanceManagement() {
  // -------------------------
  // Original user info + data
  // -------------------------
  const [currentUser] = useState({
    id: 1,
    name: "Rajesh Kumar",
    employeeId: "EMP001",
    department: "IT",
    shift: "09:00 - 18:00"
  });

  // Attendance Records (kept original sample entries)
  const [attendanceList, setAttendanceList] = useState([]);


  // Leave/Ovetime/Shift states (unchanged)
  const [leaveRequests, setLeaveRequests] = useState([]);


  const [shifts, setShifts] = useState([
    { id: 1, name: "Morning Shift", startTime: "09:00", endTime: "18:00", breakDuration: 60, days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: 2, name: "Night Shift", startTime: "22:00", endTime: "07:00", breakDuration: 60, days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] }
  ]);

  const [overtimeRequests, setOvertimeRequests] = useState([
    { id: 1, date: "2024-09-16", startTime: "18:00", endTime: "20:00", duration: 2, reason: "Project deadline", status: "Approved", approver: "Priya Sharma", appliedOn: "2024-09-16" },
    { id: 2, date: "2024-09-18", startTime: "18:00", endTime: "19:30", duration: 1.5, reason: "Client meeting", status: "Pending", approver: "Priya Sharma", appliedOn: "2024-09-17" }
  ]);


  const [leaveBalance, setLeaveBalance] = useState({
    sick: { used: 0, total: 12 },
    casual: { used: 0, total: 10 },
    annual: { used: 0, total: 20 },
  });



  // UI states
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('attendance');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);

  // Today's status (initialize to NOT clocked in by default; you can set true as needed)
  const [todayStatus, setTodayStatus] = useState({
    clockedIn: false,
    clockInTime: '',
    clockedOut: false,
    clockOutTime: '',
    totalHours: '',
    currentTime: new Date().toLocaleTimeString()
  });

  // Leave / Overtime form states (unchanged)
  const [newLeaveRequest, setNewLeaveRequest] = useState({ type: '', startDate: '', endDate: '', reason: '' });
  const [newOvertimeRequest, setNewOvertimeRequest] = useState({ date: '', startTime: '', endTime: '', reason: '' });

  // ------------------------------
  // NEW: activity tracking states
  // ------------------------------
  const [activity, setActivity] = useState({
    mouseLeft: 0,
    mouseRight: 0,
    keyPress: 0,
    activeTime: 0, // seconds
    idleTime: 0,   // seconds
    idle: false,
    lastActive: new Date()
  });

  // Refs for timers
  const idleTimeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // ------------------------------
  // Update current time every sec
  // ------------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      setTodayStatus(prev => ({ ...prev, currentTime: new Date().toLocaleTimeString() }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Fetch attendance records (including today's) from DB
// ✅ Fetch all attendance records (including today's) from backend
useEffect(() => {
  async function fetchAttendance() {
    try {
      const res = await fetch("http://localhost:4000/api/attendance", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (data.success && Array.isArray(data.records)) {
        setAttendanceList(data.records);

        // Find today’s record (optional, to show in "Today's Status")
        const today = new Date().toISOString().split("T")[0];
        const todayRec = data.records.find(
          (r) => new Date(r.date).toISOString().split("T")[0] === today
        );

        if (todayRec) {
          setTodayStatus({
            clockedIn: !!todayRec.clockIn,
            clockedOut: !!todayRec.clockOut,
            clockInTime: todayRec.clockIn
              ? new Date(todayRec.clockIn).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "",
            clockOutTime: todayRec.clockOut
              ? new Date(todayRec.clockOut).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "",
            totalHours:
              todayRec.clockIn && todayRec.clockOut
                ? (
                    (new Date(todayRec.clockOut) - new Date(todayRec.clockIn)) /
                    (1000 * 60 * 60)
                  ).toFixed(2) + "h"
                : "",
            currentTime: new Date().toLocaleTimeString(),
          });
        }
      } else {
        console.warn("⚠️ Unexpected response format:", data);
        setAttendanceList([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch attendance:", error);
      setAttendanceList([]);
    }
  }

  fetchAttendance();
}, []);


  // ✅ Fetch Leave Requests (use correct backend route by role)
  useEffect(() => {
    async function fetchLeaves() {
      try {
        // Read logged-in user from localStorage (must be stored at login)
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        // Decide endpoint based on role
        let endpoint = "http://localhost:4000/api/leaves/employee"; // default
        if (user && (user.role === "ADMIN" || user.role === "MANAGER")) {
          endpoint = "http://localhost:4000/api/leaves/admin";
        }

        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        if (data.success && Array.isArray(data.leaves)) {
          setLeaveRequests(data.leaves);
        } else if (Array.isArray(data)) {
          setLeaveRequests(data);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("❌ Failed to fetch leaves:", error);
      }
    }

    fetchLeaves();
  }, []);






  useEffect(() => {
    async function fetchLeaveBalance() {
      try {
        const res = await fetch("http://localhost:4000/api/leaves/balance", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();

        const updated = {
          sick: {
            ...data.sick,
            remaining: data.sick.total - data.sick.used,
          },
          casual: {
            ...data.casual,
            remaining: data.casual.total - data.casual.used,
          },
          annual: {
            ...data.annual,
            remaining: data.annual.total - data.annual.used,
          },
        };

        setLeaveBalance(updated);
      } catch (err) {
        console.error("Error fetching leave balance:", err);
      }
    }

    // Load once
    fetchLeaveBalance();

    // 🔁 Re-fetch every 10 seconds (sync with fetchLeaves)
    const interval = setInterval(fetchLeaveBalance, 10000);

    return () => clearInterval(interval);
  }, []);




  // --------------------------------
  // Helper: get today's company rules
  // --------------------------------
  const getTodayLoginTiming = () => {
    const today = new Date();
    const day = today.getDay();
    // Mon-Fri: 17:30 - 03:30 -> allowedBreak 1.15 hrs
    if (day >= 1 && day <= 5) return { loginStart: '17:30', loginEnd: '03:30', allowedBreak: 1.15 };
    // Sat: 14:00 - 22:00 -> allowedBreak 0.5 hrs
    if (day === 6) return { loginStart: '14:00', loginEnd: '22:00', allowedBreak: 0.5 };
    return { loginStart: 'OFF', loginEnd: 'OFF', allowedBreak: 0 };
  };
  const { loginStart, loginEnd, allowedBreak } = getTodayLoginTiming();

  // ------------------------------
  // Activity tracking (useState only)
  // Start tracking AFTER clock-in, stop on clock-out
  // ------------------------------
  useEffect(() => {
    // Do not attach listeners until user has clocked in and not yet clocked out
    if (!todayStatus.clockedIn || todayStatus.clockedOut) return;

    // reset idle timer function
    const resetIdleTimer = () => {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        setActivity(prev => ({ ...prev, idle: true }));
      }, 5 * 60 * 1000); // 5 minutes -> idle
    };

    // handle user events
    const handleMouseMove = () => {
      setActivity(prev => ({ ...prev, idle: false, lastActive: new Date() }));
      resetIdleTimer();
    };
    const handleLeftClick = () => {
      setActivity(prev => ({ ...prev, mouseLeft: prev.mouseLeft + 1, idle: false, lastActive: new Date() }));
      resetIdleTimer();
    };
    const handleRightClick = (e) => {
      e.preventDefault();
      setActivity(prev => ({ ...prev, mouseRight: prev.mouseRight + 1, idle: false, lastActive: new Date() }));
      resetIdleTimer();
    };
    const handleKeyDown = () => {
      setActivity(prev => ({ ...prev, keyPress: prev.keyPress + 1, idle: false, lastActive: new Date() }));
      resetIdleTimer();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleLeftClick);
    window.addEventListener('contextmenu', handleRightClick);
    window.addEventListener('keydown', handleKeyDown);

    // interval to increment active/idle durations (per second)
    intervalRef.current = setInterval(() => {
      setActivity(prev => ({
        ...prev,
        activeTime: prev.idle ? prev.activeTime : prev.activeTime + 1,
        idleTime: prev.idle ? prev.idleTime + 1 : prev.idleTime
      }));
    }, 1000);

    // initialize idle timer
    resetIdleTimer();

    // cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleLeftClick);
      window.removeEventListener('contextmenu', handleRightClick);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(idleTimeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, [todayStatus.clockedIn, todayStatus.clockedOut]);

  // ------------------------------
  // Helper: convert "05:45 PM" to "17:45:00"
  // ------------------------------
  function convertTo24Hour(time12h) {
    if (!time12h) return "00:00:00";
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${minutes}:00`;
  }

  // ------------------------------
  // CLOCK IN / CLOCK OUT logic
  // Augmented to compute extraBreak and attach mouse/keyboard stats to attendance record
  const handleClockAction = async (action) => {
    setLoading(true);
    try {
      const endpoint =
        action === "clock-in"
          ? "http://localhost:4000/api/attendance/clock-in"
          : "http://localhost:4000/api/attendance/clock-out";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error performing action");

      // Immediately refetch updated record
      const todayRes = await fetch("http://localhost:4000/api/attendance/today", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const todayData = await todayRes.json();

      if (todayData?.record) {
        setTodayStatus({
          clockedIn: !!todayData.record.clockIn,
          clockedOut: !!todayData.record.clockOut,
          clockInTime: todayData.record.clockIn
            ? new Date(todayData.record.clockIn).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            : "",
          clockOutTime: todayData.record.clockOut
            ? new Date(todayData.record.clockOut).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            : "",
          totalHours:
            todayData.record.clockIn && todayData.record.clockOut
              ? (
                (new Date(todayData.record.clockOut) -
                  new Date(todayData.record.clockIn)) /
                (1000 * 60 * 60)
              ).toFixed(2) + "h"
              : "",
          currentTime: new Date().toLocaleTimeString(),
        });

        setAttendanceList([todayData.record]);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };



  // ------------------------------
  // Leave / Overtime submit (unchanged)
  // ------------------------------
  const handleLeaveSubmit = async () => {
    try {
      const { type, startDate, endDate, reason } = newLeaveRequest;

      // ✅ Validate fields
      if (!type || !startDate || !endDate || !reason) {
        alert("Please fill all required fields before submitting.");
        return;
      }

      setLoading(true);

      // ✅ Submit to backend
      const res = await fetch("http://localhost:4000/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ type, startDate, endDate, reason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to apply leave");

      // ✅ Add to table
      setLeaveRequests((prev) => [data.leave, ...prev]);

      // ✅ Re-fetch updated balances
      const balanceRes = await fetch("http://localhost:4000/api/leaves/balance", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const balanceData = await balanceRes.json();

      // ✅ Recalculate
      const updatedBalance = {
        sick: {
          ...balanceData.sick,
          remaining: balanceData.sick.total - balanceData.sick.used,
        },
        casual: {
          ...balanceData.casual,
          remaining: balanceData.casual.total - balanceData.casual.used,
        },
        annual: {
          ...balanceData.annual,
          remaining: balanceData.annual.total - balanceData.annual.used,
        },
      };

      setLeaveBalance(updatedBalance);

      // ✅ Close modal and clear fields
      setNewLeaveRequest({ type: "", startDate: "", endDate: "", reason: "" });
      setShowLeaveModal(false);

      console.log("✅ Leave applied successfully:", data.leave);
    } catch (error) {
      console.error("❌ Error submitting leave:", error);
      alert(error.message || "Something went wrong while applying leave.");
    } finally {
      setLoading(false);
    }
  };




  const handleOvertimeSubmit = () => {
    if (!newOvertimeRequest.date || !newOvertimeRequest.startTime || !newOvertimeRequest.endTime || !newOvertimeRequest.reason) {
      alert('Please fill all fields');
      return;
    }
    const start = new Date(`2000-01-01T${newOvertimeRequest.startTime}:00`);
    const end = new Date(`2000-01-01T${newOvertimeRequest.endTime}:00`);
    const duration = (end - start) / (1000 * 60 * 60);

    const overtime = {
      id: overtimeRequests.length + 1,
      date: newOvertimeRequest.date,
      startTime: newOvertimeRequest.startTime,
      endTime: newOvertimeRequest.endTime,
      duration,
      reason: newOvertimeRequest.reason,
      status: 'Pending',
      approver: 'Priya Sharma',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    setOvertimeRequests(prev => [overtime, ...prev]);
    setNewOvertimeRequest({ date: '', startTime: '', endTime: '', reason: '' });
    setShowOvertimeModal(false);
  };

  // ------------------------------
  // Utility helpers (unchanged visuals)
  // ------------------------------
  const getStatusColor = (status) => {
    if (!status || typeof status !== "string") return "text-gray-600 bg-gray-50"; // fallback

    switch (status.toLowerCase()) {
      case "present":
        return "text-green-600 bg-green-50";
      case "absent":
        return "text-red-600 bg-red-50";
      case "late":
        return "text-yellow-600 bg-yellow-50";
      case "approved":
        return "text-green-600 bg-green-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };


  // ✅ Get total working hours for the current day only
  const getTotalHours = () => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday, 1 = Monday, ...

    // Office timing logic (matches your getTodayLoginTiming)
    if (day >= 1 && day <= 5) return "10.00";   // Mon–Fri: 10 hours shift
    if (day === 6) return "8.00";               // Sat: 8 hours shift
    return "OFF";                               // Sun: Off day
  };


  const getTotalOvertime = () => attendanceList.reduce((sum, r) => sum + (r.overtime || 0), 0);

  // 🔹 Export attendanceList to CSV
  const handleExportCSV = () => {
    if (!attendanceList || attendanceList.length === 0) {
      alert("No attendance data to export.");
      return;
    }

    // Define CSV headers
    const headers = [
      "Date",
      "Status",
      "Clock In",
      "Clock Out",
      "Work Hours",
      "Extra Break (hrs)",
      "Mouse Clicks",
      "Key Presses",
    ];

    // Map data rows
    const rows = attendanceList.map((record) => [
      new Date(record.date).toLocaleDateString("en-GB"),
      record.status || "-",
      record.clockIn
        ? new Date(record.clockIn).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        : "-",
      record.clockOut
        ? new Date(record.clockOut).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        : "-",
      record.workHours || "-",
      record.extraBreak || "-",
      record.mouseClicks ?? "-",
      record.keyPresses ?? "-",
    ]);

    // Combine header + rows
    const csvContent =
      [headers, ...rows]
        .map((row) =>
          row
            .map((value) =>
              typeof value === "string" && value.includes(",")
                ? `"${value}"` // wrap values with commas
                : value
            )
            .join(",")
        )
        .join("\n");

    // Create CSV Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Attendance_Records_${new Date().toLocaleDateString("en-GB")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  // ------------------------------
  // Render (keeps your original layout, with new columns added)
  // ------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
              <div className="mt-2 text-gray-600">
                <p>Welcome back, {currentUser.name} ({currentUser.employeeId})</p>
                <p>Department: {currentUser.department} | Shift: {currentUser.shift}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Current Time</div>
              <div className="text-2xl font-bold text-blue-600">{todayStatus.currentTime}</div>
              <div className="text-sm text-gray-600">{new Date().toLocaleDateString('en-GB')}</div>
            </div>
          </div>
        </div>

        {/* Today's Status Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Today's Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Clock In</span>
              </div>
              <div className="text-xl font-bold text-blue-600 mt-2">
                {todayStatus.clockedIn ? todayStatus.clockInTime : 'Not clocked in'}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="font-medium">Clock Out</span>
              </div>
              <div className="text-xl font-bold text-green-600 mt-2">
                {todayStatus.clockedOut ? todayStatus.clockOutTime : 'Not clocked out'}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Work Hours</span>
              </div>
              <div className="text-xl font-bold text-purple-600 mt-2">
                {todayStatus.clockedOut ? todayStatus.totalHours : todayStatus.clockedIn ? 'In progress' : '0h'}
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">Status</span>
              </div>
              <div className="text-xl font-bold text-yellow-600 mt-2">
                {todayStatus.clockedOut ? 'Complete' : todayStatus.clockedIn ? 'Working' : 'Not started'}
              </div>
            </div>
          </div>

          {/* Clock In/Out Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => handleClockAction('clock-in')}
              disabled={loading || todayStatus.clockedIn}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Clock className="w-4 h-4" />
              {loading ? 'Processing...' : 'Clock In'}
            </button>
            <button
              onClick={() => handleClockAction('clock-out')}
              disabled={loading || !todayStatus.clockedIn || todayStatus.clockedOut}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Clock className="w-4 h-4" />
              {loading ? 'Processing...' : 'Clock Out'}
            </button>

            <div className="bg-gray-100 px-4 py-3 rounded-lg flex items-center gap-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">Biometric: Connected</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>

          {/* Activity summary */}
          <div className="mt-4 text-sm text-gray-700">
            🖱️ Left Clicks: <span className="text-blue-600 font-semibold">{activity.mouseLeft}</span> |{" "}
            🖱️ Right Clicks: <span className="text-blue-600 font-semibold">{activity.mouseRight}</span> |{" "}
            ⌨️ Key Presses: <span className="text-purple-600 font-semibold">{activity.keyPress}</span> |{" "}
            ⚙️ Active: <span className="text-green-600 font-semibold">{(activity.activeTime / 60).toFixed(1)} min</span> |{" "}
            ⏳ Idle: <span className="text-red-600 font-semibold">{(activity.idleTime / 60).toFixed(1)} min</span> |{" "}
            Allowed Break: <span className="font-medium">{allowedBreak}h</span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Timer className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{getTotalHours()}h</div>
                <div className="text-gray-600">Total Hours</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{attendanceList.filter(a => a.status === 'Present').length}</div>
                <div className="text-gray-600">Days Present</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{attendanceList.filter(a => a.status === 'Absent').length}</div>
                <div className="text-gray-600">Days Absent</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{getTotalOvertime()}h</div>
                <div className="text-gray-600">Overtime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Content (kept same) */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'attendance', label: 'Attendance Records', icon: Clock },
                { id: 'leaves', label: 'Leave Management', icon: Calendar },
                { id: 'overtime', label: 'Overtime', icon: Timer },
                { id: 'shifts', label: 'Shift Schedule', icon: User }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${currentTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Attendance tab - modified to show extraBreak, mouse & key counts */}
            {currentTab === 'attendance' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Attendance Records</h3>
                  <button
                    onClick={handleExportCSV}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>

                </div>
                <div className="overflow-x-auto">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b bg-gray-50 text-center">
                          <th className="py-3 px-4 font-semibold text-gray-700">Date</th>
                          <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="py-3 px-4 font-semibold text-gray-700">Clock In</th>
                          <th className="py-3 px-4 font-semibold text-gray-700">Clock Out</th>
                          <th className="py-3 px-4 font-semibold text-gray-700">Work Hours</th>
                          <th className="py-3 px-4 font-semibold text-gray-700">Extra Break (hrs)</th>
                          <th className="py-3 px-4 font-semibold text-gray-700">Mouse</th>
                          <th className="py-3 px-4 font-semibold text-gray-700">Keys</th>
                        </tr>
                      </thead>

                      <tbody>
                        {attendanceList.length > 0 ? (
                          attendanceList.map((record) => (
                            <tr
                              key={record.id}
                              className="border-b hover:bg-gray-50 text-center text-gray-700 transition-colors"
                            >
                              <td className="py-3 px-4 whitespace-nowrap">
                                {new Date(record.date).toLocaleDateString("en-GB")}
                              </td>

                              <td className="py-3 px-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${record.status.toLowerCase() === "present"
                                    ? "bg-green-50 text-green-600"
                                    : record.status.toLowerCase() === "absent"
                                      ? "bg-red-50 text-red-600"
                                      : record.status.toLowerCase() === "late"
                                        ? "bg-yellow-50 text-yellow-600"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                  {record.status}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                {record.clockIn
                                  ? new Date(record.clockIn).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })
                                  : "-"}
                              </td>

                              <td className="py-3 px-4">
                                {record.clockOut
                                  ? new Date(record.clockOut).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })
                                  : "-"}
                              </td>

                              <td className="py-3 px-4 font-medium">
                                {record.workHours ? `${record.workHours}h` : "-"}
                              </td>

                              <td className="py-3 px-4 text-red-600 font-medium">
                                {record.extraBreak ? `${record.extraBreak}h` : "-"}
                              </td>

                              <td className="py-3 px-4">{record.mouseClicks ?? "-"}</td>
                              <td className="py-3 px-4">{record.keyPresses ?? "-"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="8"
                              className="py-6 text-gray-500 text-center italic"
                            >
                              No attendance records available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            )}

            {/* Rest of tabs (leaves, overtime, shifts) are kept exactly as original above - omitted here for brevity */}
            {/* In your full app the code for those tabs remains unchanged (you already have them earlier). */}
            {/* Leave Management Tab */}
            {currentTab === 'leaves' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Leave Management</h3>
                  <button
                    onClick={() => setShowLeaveModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Apply Leave
                  </button>
                </div>

                {/* Leave Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {Object.entries(leaveBalance).map(([type, balance]) => (
                    <div key={type} className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 capitalize mb-2">{type.replace('_', ' ')} Leave</div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-lg font-bold">{balance.remaining}/{balance.total}</div>
                          <div className="text-xs text-gray-500">Available</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-red-600">{balance.used} used</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Leave Requests Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-center ">
                        <th className="py-3 px-4 font-medium text-gray-700">Type</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Dates</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Days</th>  {/* ✅ already there */}
                        <th className="py-3 px-4 font-medium text-gray-700">Reason</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Applied On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map((leave) => (
                        <tr key={leave.id} className="border-b text-center hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{leave.type}</td>
                          <td className="py-3 px-4">
                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">{leave.noOfDays}</td> {/* ✅ show from backend */}
                          <td className="py-3 px-4 text-gray-600">{leave.reason}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                              {leave.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {leave.createdAt ? new Date(leave.createdAt).toLocaleDateString("en-GB") : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Overtime Tab */}
            {currentTab === 'overtime' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Overtime Requests</h3>
                  <button
                    onClick={() => setShowOvertimeModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Request Overtime
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-3 px-4 font-medium text-gray-700">Date</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Time</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Duration</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Reason</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Applied On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overtimeRequests.map((overtime) => (
                        <tr key={overtime.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{new Date(overtime.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4">{overtime.startTime} - {overtime.endTime}</td>
                          <td className="py-3 px-4 font-medium text-purple-600">{overtime.duration}h</td>
                          <td className="py-3 px-4 text-gray-600">{overtime.reason}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(overtime.status)}`}>
                              {overtime.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{new Date(overtime.appliedOn).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Shift Schedule Tab */}
            {currentTab === 'shifts' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Shift Schedules</h3>
                <div className="grid gap-4">
                  {shifts.map((shift) => (
                    <div key={shift.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{shift.name}</h4>
                          <p className="text-gray-600">{shift.startTime} - {shift.endTime}</p>
                          <p className="text-sm text-gray-500">Break: {shift.breakDuration} minutes</p>
                          <div className="flex gap-2 mt-2">
                            {shift.days.map((day) => (
                              <span key={day} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {day.slice(0, 3)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leave Modal */}
      {showLeaveModal && (
        <LeaveModal
          setShowLeaveModal={setShowLeaveModal}
          newLeaveRequest={newLeaveRequest}
          setNewLeaveRequest={setNewLeaveRequest}
          handleLeaveSubmit={handleLeaveSubmit}
        />
      )}

      {/* Overtime Modal */}
      {showOvertimeModal && (
        <OvertimeModal
          setShowOvertimeModal={setShowOvertimeModal}
          newOvertimeRequest={newOvertimeRequest}
          setNewOvertimeRequest={setNewOvertimeRequest}
          handleOvertimeSubmit={handleOvertimeSubmit}
        />
      )}

    </div>
  );
}
