import { useState, useEffect } from 'react';
import { Clock, Calendar, User, Timer, AlertCircle, CheckCircle, XCircle, Plus, Eye, Download } from 'lucide-react';

export default function AttendanceManagement() {
  const [currentUser] = useState({
    id: 1,
    name: "Rajesh Kumar",
    employeeId: "EMP001",
    department: "IT",
    shift: "09:00 - 18:00"
  });

  // Attendance Records
  const [attendanceList, setAttendanceList] = useState([
    {
      id: 1,
      date: "2024-09-16",
      status: "Present",
      clockIn: "2024-09-16T09:15:00",
      clockOut: "2024-09-16T18:30:00",
      workHours: 8.25,
      overtime: 0.5,
      location: "Office - Biometric",
      breaks: [
        { start: "2024-09-16T13:00:00", end: "2024-09-16T14:00:00", duration: 60 }
      ]
    },
    {
      id: 2,
      date: "2024-09-15",
      status: "Present",
      clockIn: "2024-09-15T08:45:00",
      clockOut: "2024-09-15T17:45:00",
      workHours: 8.0,
      overtime: 0,
      location: "Office - Mobile App",
      breaks: [
        { start: "2024-09-15T13:15:00", end: "2024-09-15T14:00:00", duration: 45 }
      ]
    },
    {
      id: 3,
      date: "2024-09-14",
      status: "Late",
      clockIn: "2024-09-14T10:30:00",
      clockOut: "2024-09-14T18:00:00",
      workHours: 6.5,
      overtime: 0,
      location: "Office - Biometric",
      breaks: [
        { start: "2024-09-14T13:30:00", end: "2024-09-14T14:30:00", duration: 60 }
      ]
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
      reason: "Sick Leave"
    }
  ]);

  // Leave Management
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      type: "Sick Leave",
      startDate: "2024-09-20",
      endDate: "2024-09-21",
      days: 2,
      reason: "Fever and cold",
      status: "Pending",
      appliedOn: "2024-09-17",
      approver: "Priya Sharma"
    },
    {
      id: 2,
      type: "Casual Leave",
      startDate: "2024-09-25",
      endDate: "2024-09-25",
      days: 1,
      reason: "Personal work",
      status: "Approved",
      appliedOn: "2024-09-15",
      approver: "Priya Sharma"
    },
    {
      id: 3,
      type: "Annual Leave",
      startDate: "2024-10-10",
      endDate: "2024-10-12",
      days: 3,
      reason: "Family vacation",
      status: "Rejected",
      appliedOn: "2024-09-10",
      approver: "Priya Sharma",
      comments: "Peak project period"
    }
  ]);

  // Shift Scheduling
  const [shifts, setShifts] = useState([
    {
      id: 1,
      name: "Morning Shift",
      startTime: "09:00",
      endTime: "18:00",
      breakDuration: 60,
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },
    {
      id: 2,
      name: "Night Shift",
      startTime: "22:00",
      endTime: "07:00",
      breakDuration: 60,
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    }
  ]);

  // Overtime Requests
  const [overtimeRequests, setOvertimeRequests] = useState([
    {
      id: 1,
      date: "2024-09-16",
      startTime: "18:00",
      endTime: "20:00",
      duration: 2,
      reason: "Project deadline",
      status: "Approved",
      approver: "Priya Sharma",
      appliedOn: "2024-09-16"
    },
    {
      id: 2,
      date: "2024-09-18",
      startTime: "18:00",
      endTime: "19:30",
      duration: 1.5,
      reason: "Client meeting",
      status: "Pending",
      approver: "Priya Sharma",
      appliedOn: "2024-09-17"
    }
  ]);

  // Leave Balance
  const [leaveBalance] = useState({
    sick: { used: 3, total: 12, remaining: 9 },
    casual: { used: 5, total: 10, remaining: 5 },
    annual: { used: 8, total: 20, remaining: 12 }
  });

  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('attendance');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);
  const [todayStatus, setTodayStatus] = useState({
    clockedIn: true,
    clockInTime: "09:15",
    clockedOut: false,
    currentTime: new Date().toLocaleTimeString()
  });

  const [newLeaveRequest, setNewLeaveRequest] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [newOvertimeRequest, setNewOvertimeRequest] = useState({
    date: '',
    startTime: '',
    endTime: '',
    reason: ''
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTodayStatus(prev => ({
        ...prev,
        currentTime: new Date().toLocaleTimeString()
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockAction = async (action) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString().slice(0, 5);
      
      if (action === 'clock-in') {
        setTodayStatus(prev => ({
          ...prev,
          clockedIn: true,
          clockInTime: currentTime
        }));
      } else if (action === 'clock-out') {
        setTodayStatus(prev => ({
          ...prev,
          clockedOut: true,
          clockOutTime: currentTime
        }));
        
        // Add today's attendance record
        const newRecord = {
          id: attendanceList.length + 1,
          date: now.toISOString().split('T')[0],
          status: "Present",
          clockIn: `${now.toISOString().split('T')[0]}T${todayStatus.clockInTime}:00`,
          clockOut: `${now.toISOString().split('T')[0]}T${currentTime}:00`,
          workHours: 8.0,
          overtime: 0,
          location: "Office - Mobile App",
          breaks: []
        };
        
        setAttendanceList(prev => [newRecord, ...prev]);
      }
      
      setLoading(false);
    }, 1000);
  };

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
      days: days,
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
      duration: duration,
      reason: newOvertimeRequest.reason,
      status: 'Pending',
      approver: 'Priya Sharma',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    setOvertimeRequests(prev => [overtime, ...prev]);
    setNewOvertimeRequest({ date: '', startTime: '', endTime: '', reason: '' });
    setShowOvertimeModal(false);
  };

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

  const getTotalHours = () => {
    return attendanceList.reduce((total, record) => total + (record.workHours || 0), 0);
  };

  const getTotalOvertime = () => {
    return attendanceList.reduce((total, record) => total + (record.overtime || 0), 0);
  };

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
                {todayStatus.clockedOut ? '8.0h' : todayStatus.clockedIn ? 'In progress' : '0h'}
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

        {/* Tab Navigation */}
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
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      currentTab === tab.id
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
            {/* Attendance Records Tab */}
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
                        <th className="py-3 px-4 font-medium text-gray-700">Overtime</th>
                        <th className="py-3 px-4 font-medium text-gray-700">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceList.map((record) => (
                        <tr key={record.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {record.clockIn ? new Date(record.clockIn).toLocaleTimeString().slice(0, 5) : '-'}
                          </td>
                          <td className="py-3 px-4">
                            {record.clockOut ? new Date(record.clockOut).toLocaleTimeString().slice(0, 5) : '-'}
                          </td>
                          <td className="py-3 px-4">{record.workHours}h</td>
                          <td className="py-3 px-4 text-purple-600 font-medium">
                            {record.overtime > 0 ? `${record.overtime}h` : '-'}
                          </td>
                          <td className="py-3 px-4 text-gray-600 text-sm">{record.location || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

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

        {/* Leave Application Modal */}
        {showLeaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                  <select
                    value={newLeaveRequest.type}
                    onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select leave type</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newLeaveRequest.startDate}
                    onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newLeaveRequest.endDate}
                    onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    value={newLeaveRequest.reason}
                    onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter reason for leave"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleLeaveSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex-1 transition-colors"
                >
                  Submit Application
                </button>
                <button
                  onClick={() => {
                    setShowLeaveModal(false);
                    setNewLeaveRequest({ type: '', startDate: '', endDate: '', reason: '' });
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg flex-1 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Overtime Request Modal */}
        {showOvertimeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Request Overtime</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newOvertimeRequest.date}
                    onChange={(e) => setNewOvertimeRequest(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newOvertimeRequest.startTime}
                    onChange={(e) => setNewOvertimeRequest(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newOvertimeRequest.endTime}
                    onChange={(e) => setNewOvertimeRequest(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    value={newOvertimeRequest.reason}
                    onChange={(e) => setNewOvertimeRequest(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter reason for overtime"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleOvertimeSubmit}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex-1 transition-colors"
                >
                  Submit Request
                </button>
                <button
                  onClick={() => {
                    setShowOvertimeModal(false);
                    setNewOvertimeRequest({ date: '', startTime: '', endTime: '', reason: '' });
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg flex-1 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Biometric Integration Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">System Integration Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium">Biometric System</div>
                <div className="text-sm text-green-700">Connected - Last sync: 2 min ago</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <div className="font-medium">Mobile App</div>
                <div className="text-sm text-blue-700">Active - GPS tracking enabled</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div>
                <div className="font-medium">RFID Cards</div>
                <div className="text-sm text-purple-700">Operational - Card ID: RFD001</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Recent Integration Logs</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• 09:15 AM - Clock-in recorded via Biometric (Fingerprint)</div>
              <div>• 08:45 AM - Mobile app location verified (Office premises)</div>
              <div>• 08:30 AM - RFID card detected at main entrance</div>
              <div>• Yesterday 6:30 PM - Clock-out recorded via Mobile App</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}