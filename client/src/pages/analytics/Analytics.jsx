import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts'
import { TrendingUp, TrendingDown, Users, Target, Calendar, Download, Filter, RefreshCw } from 'lucide-react'

// Dummy data - replace with actual API calls
const dummyDashboardData = {
  targets: {
    totalTarget: 1000000,
    totalAchieved: 750000,
    progressPct: 75
  },
  users: 248,
  overview: {
    totalEmployees: 248,
    activeEmployees: 235,
    newHires: 12,
    turnoverRate: 5.2,
    avgPerformanceScore: 4.2,
    attendanceRate: 94.5
  }
}

const performanceData = [
  { month: 'Jan', avgScore: 4.1, target: 4.0 },
  { month: 'Feb', avgScore: 4.0, target: 4.0 },
  { month: 'Mar', avgScore: 4.3, target: 4.0 },
  { month: 'Apr', avgScore: 4.2, target: 4.0 },
  { month: 'May', avgScore: 4.4, target: 4.0 },
  { month: 'Jun', avgScore: 4.2, target: 4.0 }
]

const attendanceData = [
  { month: 'Jan', rate: 95.2 },
  { month: 'Feb', rate: 93.8 },
  { month: 'Mar', rate: 94.5 },
  { month: 'Apr', rate: 96.1 },
  { month: 'May', rate: 94.8 },
  { month: 'Jun', rate: 94.5 }
]

const turnoverData = [
  { department: 'Engineering', rate: 3.2, count: 4 },
  { department: 'Sales', rate: 8.1, count: 6 },
  { department: 'Marketing', rate: 6.5, count: 3 },
  { department: 'HR', rate: 2.1, count: 1 },
  { department: 'Finance', rate: 4.3, count: 2 },
  { department: 'Operations', rate: 7.2, count: 5 }
]

const departmentData = [
  { name: 'Engineering', value: 85, color: '#3B82F6' },
  { name: 'Sales', value: 62, color: '#10B981' },
  { name: 'Marketing', value: 45, color: '#F59E0B' },
  { name: 'HR', value: 28, color: '#EF4444' },
  { name: 'Finance', value: 18, color: '#8B5CF6' },
  { name: 'Operations', value: 35, color: '#06B6D4' }
]

const workforceProjection = [
  { month: 'Jul', current: 248, projected: 252, hiring: 6, attrition: 2 },
  { month: 'Aug', current: 252, projected: 258, hiring: 8, attrition: 2 },
  { month: 'Sep', current: 258, projected: 265, hiring: 9, attrition: 2 },
  { month: 'Oct', current: 265, projected: 270, hiring: 7, attrition: 2 },
  { month: 'Nov', current: 270, projected: 275, hiring: 8, attrition: 3 },
  { month: 'Dec', current: 275, projected: 280, hiring: 8, attrition: 3 }
]

const topPerformers = [
  { name: 'Sarah Chen', department: 'Engineering', score: 4.9, improvement: '+0.2' },
  { name: 'Mike Johnson', department: 'Sales', score: 4.8, improvement: '+0.1' },
  { name: 'Lisa Wang', department: 'Marketing', score: 4.7, improvement: '+0.3' },
  { name: 'David Smith', department: 'Engineering', score: 4.6, improvement: '+0.1' },
  { name: 'Emma Brown', department: 'HR', score: 4.6, improvement: '+0.0' }
]

// Mock auth context - replace with actual
const mockApi = {
  get: (url) => Promise.resolve({ data: dummyDashboardData })
}

export default function Analytics() {
  const [data, setData] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('6months')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  // Simulate API call - replace with actual implementation
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        // Replace with actual API call:
        // const response = await api.get('/api/analytics/dashboard')
        const response = await mockApi.get('/api/analytics/dashboard')
        setData(response.data)
      } catch (error) {
        console.error('Failed to fetch analytics data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [dateRange, selectedDepartment])

  const exportData = async (type) => {
    try {
      // Replace with actual API call:
      // const response = await api.get(`/api/analytics/export?type=${type}&format=csv`)
      alert(`Exporting ${type} data... (Replace with actual API call)`)
    } catch (error) {
      alert('Export failed')
    }
  }

  const refreshData = async () => {
    setLoading(true)
    // Simulate refresh delay
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load analytics data</p>
        <button 
          onClick={refreshData}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reporting</h1>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            <option value="engineering">Engineering</option>
            <option value="sales">Sales</option>
            <option value="marketing">Marketing</option>
            <option value="hr">HR</option>
          </select>
          <button
            onClick={refreshData}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'performance', name: 'Performance' },
            { id: 'attendance', name: 'Attendance' },
            { id: 'turnover', name: 'Turnover' },
            { id: 'workforce', name: 'Workforce Planning' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-3xl font-bold text-gray-900">{data.overview.totalEmployees}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">+{data.overview.newHires} new hires</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Performance Score</p>
                  <p className="text-3xl font-bold text-gray-900">{data.overview.avgPerformanceScore}/5</p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(data.overview.avgPerformanceScore / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{data.overview.attendanceRate}%</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${data.overview.attendanceRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Turnover Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{data.overview.turnoverRate}%</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-red-600">Industry avg: 6.8%</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Distribution */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Department Distribution</h3>
                <button 
                  onClick={() => exportData('departments')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Performers */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Top Performers</h3>
                <button 
                  onClick={() => exportData('performance')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {topPerformers.map((performer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{performer.name}</p>
                      <p className="text-sm text-gray-600">{performer.department}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{performer.score}/5</p>
                      <p className={`text-sm ${performer.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {performer.improvement}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Performance Trends</h3>
              <button 
                onClick={() => exportData('performance-trends')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[3.5, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="avgScore" stroke="#3B82F6" strokeWidth={3} name="Average Score" />
                <Line type="monotone" dataKey="target" stroke="#EF4444" strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Performance by Department */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Performance by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={turnoverData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rate" fill="#10B981" name="Avg Performance Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Attendance Rate Trends</h3>
              <button 
                onClick={() => exportData('attendance')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[90, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="rate" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold mb-2">Current Month</h4>
              <p className="text-3xl font-bold text-green-600">94.5%</p>
              <p className="text-sm text-gray-600">235 of 248 employees</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold mb-2">Best Department</h4>
              <p className="text-3xl font-bold text-blue-600">Engineering</p>
              <p className="text-sm text-gray-600">97.2% attendance</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold mb-2">Improvement Needed</h4>
              <p className="text-3xl font-bold text-orange-600">Sales</p>
              <p className="text-sm text-gray-600">91.3% attendance</p>
            </div>
          </div>
        </div>
      )}

      {/* Turnover Tab */}
      {activeTab === 'turnover' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Turnover by Department</h3>
              <button 
                onClick={() => exportData('turnover')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={turnoverData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rate" fill="#EF4444" name="Turnover Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Turnover Summary Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turnover Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employees Left
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {turnoverData.map((dept, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dept.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dept.rate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dept.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        dept.rate > 7 ? 'bg-red-100 text-red-800' :
                        dept.rate > 4 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {dept.rate > 7 ? 'High' : dept.rate > 4 ? 'Medium' : 'Low'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Workforce Planning Tab */}
      {activeTab === 'workforce' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Workforce Projection (Next 6 Months)</h3>
              <button 
                onClick={() => exportData('workforce-projection')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={workforceProjection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="current" stroke="#3B82F6" strokeWidth={3} name="Current" />
                <Line type="monotone" dataKey="projected" stroke="#10B981" strokeWidth={3} strokeDasharray="5 5" name="Projected" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Hiring vs Attrition */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Monthly Hiring vs Attrition Forecast</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workforceProjection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hiring" fill="#10B981" name="Expected Hires" />
                <Bar dataKey="attrition" fill="#EF4444" name="Expected Attrition" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Workforce Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold mb-2">Net Growth</h4>
              <p className="text-3xl font-bold text-green-600">+32</p>
              <p className="text-sm text-gray-600">Expected in 6 months</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold mb-2">Total Hires Needed</h4>
              <p className="text-3xl font-bold text-blue-600">46</p>
              <p className="text-sm text-gray-600">To reach projections</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold mb-2">Budget Impact</h4>
              <p className="text-3xl font-bold text-purple-600">$2.1M</p>
              <p className="text-sm text-gray-600">Additional annual cost</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}