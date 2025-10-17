import { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function EmployeeTargets() {
  const { api, user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    target: "",
    todayAchieved: "",
    weeklyAchieved: "",
    totalLeads: "",
    leadEmails: ""
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/employees');
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      showNotification('Failed to load employees', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [api]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    if (!newEmployee.name || !newEmployee.target) {
      showNotification('Name and Target are required', 'error');
      return;
    }

    if (!user || !user.id) {
      showNotification('User not authenticated. Please login again.', 'error');
      return;
    }

    try {
      setLoading(true);

      await api.post('/api/approvals', {
        actionType: 'CREATE',
        entity: 'Employee',
        requestedBy: user.id,
        data: {
          name: newEmployee.name,
          target: Number(newEmployee.target),
          todayAchieved: Number(newEmployee.todayAchieved) || 0,
          weeklyAchieved: Number(newEmployee.weeklyAchieved) || 0,
          totalLeads: Number(newEmployee.totalLeads) || 0,
          leadEmails: newEmployee.leadEmails || "admin@company.com"
        }
      });

      setNewEmployee({
        name: "",
        target: "",
        todayAchieved: "",
        weeklyAchieved: "",
        totalLeads: "",
        leadEmails: ""
      });

      showNotification('Employee creation request sent for approval!', 'success');
    } catch (error) {
      console.error('Failed to create approval request:', error);
      showNotification('Failed to send approval request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Targets</h1>
            <p className="text-gray-600">Manage and track employee performance targets</p>
          </div>
          <button
            onClick={fetchEmployees}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`mb-6 p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle className="text-green-600" size={16} />
              ) : (
                <AlertTriangle className="text-red-600" size={16} />
              )}
              <span className={notification.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {notification.message}
              </span>
            </div>
          </div>
        )}

        {/* Add Employee Form */}
        {/* <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow mb-8">
          <div className="space-y-4">
            <input type="text" name="name" value={newEmployee.name} onChange={handleChange} placeholder="Employee Name" className="w-full border rounded p-2" required />
            <input type="number" name="target" value={newEmployee.target} onChange={handleChange} placeholder="Target" className="w-full border rounded p-2" required />
            <input type="number" name="todayAchieved" value={newEmployee.todayAchieved} onChange={handleChange} placeholder="Today Achieved" className="w-full border rounded p-2" />
          </div>

          <div className="space-y-4">
            <input type="number" name="weeklyAchieved" value={newEmployee.weeklyAchieved} onChange={handleChange} placeholder="Weekly Achieved" className="w-full border rounded p-2" />
            <input type="number" name="totalLeads" value={newEmployee.totalLeads} onChange={handleChange} placeholder="Total Leads" className="w-full border rounded p-2" required />
            <input type="text" name="leadEmails" value={newEmployee.leadEmails} onChange={handleChange} placeholder="Admin Emails (comma separated)" className="w-full border rounded p-2" />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                'Request Employee Addition'
              )}
            </button>
          </div>
        </form> */}

        {/* Employee Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow mb-8">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2 border">Sl No</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Target</th>
                <th className="p-2 border">Today</th>
                <th className="p-2 border">Weekly</th>
                <th className="p-2 border">Total Leads</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{emp.name}</td>
                  <td className="p-2 border">{emp.target}</td>
                  <td className="p-2 border">{emp.todayAchieved}</td>
                  <td className="p-2 border">{emp.weeklyAchieved}</td>
                  <td className="p-2 border">{emp.totalLeads}</td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td className="p-4 text-sm text-gray-500 text-center" colSpan="6">
                    No employees found. Submit a request to add employees.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Employee Performance</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={employees}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="target" fill="#3B82F6" name="Target" />
              <Bar dataKey="todayAchieved" fill="#10B981" name="Today" />
              <Bar dataKey="weeklyAchieved" fill="#F59E0B" name="Weekly" />
              <Bar dataKey="totalLeads" fill="#8B5CF6" name="Total Leads" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
