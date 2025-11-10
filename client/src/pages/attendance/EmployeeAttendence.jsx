import { useState, useEffect, useRef } from 'react';
import { Clock, Calendar, User, Timer, AlertCircle, CheckCircle, XCircle, Plus, Eye, Download } from 'lucide-react';

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
  const [attendanceList, setAttendanceList] = useState([
    {
      id: 1,
      date: "2024-09-16",
      status: "Present",
      clockIn: "09:15 AM",
      clockOut: "06:30 PM",
      workHours: 8.25,
      overtime: 0.5,
      location: "Office - Biometric",
      breaks: [
        { start: "01:00 PM", end: "02:00 PM", duration: 60 }
      ],
      extraBreak: 0.25,
      mouseClicks: 1523,
      keyPresses: 3421
    },
    {
      id: 2,
      date: "2024-09-15",
      status: "Present",
      clockIn: "08:45 AM",
      clockOut: "05:45 PM",
      workHours: 8.0,
      overtime: 0,
      location: "Office - Mobile App",
      breaks: [
        { start: "01:15 PM", end: "02:00 PM", duration: 45 }
      ],
      extraBreak: 0.1,
      mouseClicks: 1280,
      keyPresses: 2985
    },
    {
      id: 3,
      date: "2024-09-14",
      status: "Late",
      clockIn: "10:30 AM",
      clockOut: "06:00 PM",
      workHours: 6.5,
      overtime: 0,
      location: "Office - Biometric",
      breaks: [
        { start: "01:30 PM", end: "02:30 PM", duration: 60 }
      ],
      extraBreak: 0.5,
      mouseClicks: 965,
      keyPresses: 2100
    },
    {
      id: 4,
      date: "2024-09-13",
      status: "Absent",
      clockIn: null,
      clockOut: null,
      workHours: 0,
      overtime: 0,
      location: null,
      breaks: [],
      reason: "Sick Leave",
      extraBreak: 0,
      mouseClicks: 0,
      keyPresses: 0
    }
  ]);

  // Leave/Ovetime/Shift states (unchanged)
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, type: "Sick Leave", startDate: "2024-09-20", endDate: "2024-09-21", days: 2, reason: "Fever and cold", status: "Pending", appliedOn: "2024-09-17", approver: "Priya Sharma" },
    { id: 2, type: "Casual Leave", startDate: "2024-09-25", endDate: "2024-09-25", days: 1, reason: "Personal work", status: "Approved", appliedOn: "2024-09-15", approver: "Priya Sharma" },
    { id: 3, type: "Annual Leave", startDate: "2024-10-10", endDate: "2024-10-12", days: 3, reason: "Family vacation", status: "Rejected", appliedOn: "2024-09-10", approver: "Priya Sharma", comments: "Peak project period" }
  ]);

  const [shifts, setShifts] = useState([
    { id: 1, name: "Morning Shift", startTime: "09:00", endTime: "18:00", breakDuration: 60, days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { id: 2, name: "Night Shift", startTime: "22:00", endTime: "07:00", breakDuration: 60, days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] }
  ]);

  const [overtimeRequests, setOvertimeRequests] = useState([
    { id: 1, date: "2024-09-16", startTime: "18:00", endTime: "20:00", duration: 2, reason: "Project deadline", status: "Approved", approver: "Priya Sharma", appliedOn: "2024-09-16" },
    { id: 2, date: "2024-09-18", startTime: "18:00", endTime: "19:30", duration: 1.5, reason: "Client meeting", status: "Pending", approver: "Priya Sharma", appliedOn: "2024-09-17" }
  ]);

  const [leaveBalance] = useState({
    sick: { used: 3, total: 12, remaining: 9 },
    casual: { used: 5, total: 10, remaining: 5 },
    annual: { used: 8, total: 20, remaining: 12 }
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

    setTimeout(() => {
      const now = new Date();

      // ✅ Format time as "hh:mm AM/PM"
      const currentTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // ✅ Store ISO date for the record
      const isoDate = now.toISOString().split('T')[0];

      // Check if today is an off day
      if (loginStart === 'OFF') {
        alert('Today is an off day — no clock-in required.');
        setLoading(false);
        return;
      }

      // Parse shift start time for late check
      const [shiftHour, shiftMinute] = loginStart.split(':').map(Number);
      const shiftStartTime = new Date(now);
      shiftStartTime.setHours(shiftHour, shiftMinute, 0, 0);

      let status = now > shiftStartTime ? "Late" : "Present";

      // 🕒 CLOCK IN
      if (action === 'clock-in') {
        setTodayStatus(prev => ({
          ...prev,
          clockedIn: true,
          clockInTime: currentTime, // ✅ "08:15 AM"
        }));

        // reset activity counters
        setActivity({
          mouseLeft: 0,
          mouseRight: 0,
          keyPress: 0,
          activeTime: 0,
          idleTime: 0,
          idle: false,
          lastActive: new Date()
        });

        setLoading(false);
        return;
      }

      // 🕕 CLOCK OUT
      if (action === 'clock-out') {
        const totalActiveSeconds = activity.activeTime;
        const totalIdleSeconds = activity.idleTime;
        const totalHours = ((totalActiveSeconds + totalIdleSeconds) / 3600).toFixed(2);
        const extraBreakHours = Math.max((totalIdleSeconds / 3600) - allowedBreak, 0).toFixed(2);

        // ✅ Build record with readable times
        const newRecord = {
          id: attendanceList.length + 1,
          date: isoDate,
          status,
          clockIn: todayStatus.clockInTime,   // e.g. "08:15 AM"
          clockOut: currentTime,              // e.g. "06:45 PM"
          workHours: Math.max((totalHours - allowedBreak), 0).toFixed(2),
          overtime: 0,
          location: "Office - Mobile App",
          breaks: [],
          extraBreak: parseFloat(extraBreakHours),
          mouseClicks: activity.mouseLeft + activity.mouseRight,
          keyPresses: activity.keyPress
        };

        // Update status + list
        setTodayStatus(prev => ({
          ...prev,
          clockedOut: true,
          clockOutTime: currentTime,
          totalHours: newRecord.workHours + 'h'
        }));

        setAttendanceList(prev => [newRecord, ...prev]);
      }

      setLoading(false);
    }, 1000);
  };

  // ------------------------------
  // Leave / Overtime submit (unchanged)
  // ------------------------------
  const handleLeaveSubmit = () => {
    if (!newLeaveRequest.type || !newLeaveRequest.startDate || !newLeaveRequest.endDate || !newLeaveRequest.reason) {
      alert('Please fill all fields');
      return;
    }
    const startDate = new Date(newLeaveRequest.startDate);
    const endDate = new Date(newLeaveRequest.endDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    const leave = {
      id: leaveRequests.length + 1,
      type: newLeaveRequest.type,
      startDate: newLeaveRequest.startDate,
      endDate: newLeaveRequest.endDate,
      days,
      reason: newLeaveRequest.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
      approver: 'Priya Sharma'
    };

    setLeaveRequests(prev => [leave, ...prev]);
    setNewLeaveRequest({ type: '', startDate: '', endDate: '', reason: '' });
    setShowLeaveModal(false);
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
    switch (status.toLowerCase()) {
      case 'present': return 'text-green-600 bg-green-50';
      case 'absent': return 'text-red-600 bg-red-50';
      case 'late': return 'text-yellow-600 bg-yellow-50';
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
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
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-3 px-4 font-medium text-gray-700">Date</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Clock In</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Clock Out</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Work Hours</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Extra Break (hrs)</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Mouse</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Keys</th>
                        {/* <th className="py-3 px-4 font-medium text-gray-700">Location</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceList.map((record) => (
                        <tr key={record.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{new Date(record.date).toLocaleDateString('en-IN')}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{record.clockIn || '-'}</td>
                          <td className="py-3 px-4">{record.clockOut || '-'}</td>

                          <td className="py-3 px-4">{record.workHours}h</td>
                          <td className="py-3 px-4 text-red-600 font-medium">{record.extraBreak ? `${record.extraBreak}h` : '-'}</td>
                          <td className="py-3 px-4 text-gray-600">{record.mouseClicks ?? '-'}</td>
                          <td className="py-3 px-4 text-gray-600">{record.keyPresses ?? '-'}</td>
                          <td className="py-3 px-4 text-gray-600 text-sm">{record.location || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                      <tr className="border-b text-left">
                        <th className="py-3 px-4 font-medium text-gray-700">Type</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Dates</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Days</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Reason</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Applied On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map((leave) => (
                        <tr key={leave.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{leave.type}</td>
                          <td className="py-3 px-4">
                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">{leave.days}</td>
                          <td className="py-3 px-4 text-gray-600">{leave.reason}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                              {leave.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{new Date(leave.appliedOn).toLocaleDateString()}</td>
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
    </div>
  );
}
