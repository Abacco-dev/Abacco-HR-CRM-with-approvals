import { useEffect, useState } from 'react'
import { Target, Calendar, TrendingUp, Users, Bell, Plus, Filter, Download, AlertTriangle, CheckCircle, Clock, BarChart3, PieChart, Eye, Edit, Trash2, RefreshCw, Mail } from 'lucide-react'
import { LineChart, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, AreaChart, Area, Legend } from 'recharts'
import { useAuth } from '../../contexts/AuthContext.jsx'
import EmployeeTargets from './employeeTrarget.jsx'

// Dummy data for targets
const dummyTargets = [
    {
        id: 1,
        title: "Monthly Sales Revenue",
        description: "Achieve $50K in monthly sales revenue",
        type: "monthly",
        period: "2024-09",
        targetValue: 50000,
        achievedValue: 38500,
        progress: 77,
        status: "in_progress",
        assignedTo: "Sales Team",
        assignedBy: "John Manager",
        createdDate: "2024-09-01",
        deadline: "2024-09-30",
        category: "Revenue",
        priority: "high",
        reminders: [
            { date: "2024-09-15", sent: true, type: "halfway" },
            { date: "2024-09-25", sent: false, type: "warning" }
        ]
    },
    {
        id: 2,
        title: "Customer Acquisition",
        description: "Acquire 100 new customers this quarter",
        type: "quarterly",
        period: "2024-Q3",
        targetValue: 100,
        achievedValue: 85,
        progress: 85,
        status: "in_progress",
        assignedTo: "Marketing Team",
        assignedBy: "Sarah Director",
        createdDate: "2024-07-01",
        deadline: "2024-09-30",
        category: "Growth",
        priority: "high",
        reminders: [
            { date: "2024-08-15", sent: true, type: "halfway" },
            { date: "2024-09-15", sent: true, type: "warning" }
        ]
    },
    {
        id: 3,
        title: "Employee Training Completion",
        description: "Complete annual training for all employees",
        type: "annual",
        period: "2024",
        targetValue: 150,
        achievedValue: 150,
        progress: 100,
        status: "completed",
        assignedTo: "HR Team",
        assignedBy: "Mike HR",
        createdDate: "2024-01-01",
        deadline: "2024-12-31",
        category: "Development",
        priority: "medium",
        reminders: []
    },
    {
        id: 4,
        title: "Product Development Milestones",
        description: "Complete 5 major product features",
        type: "quarterly",
        period: "2024-Q3",
        targetValue: 5,
        achievedValue: 3,
        progress: 60,
        status: "at_risk",
        assignedTo: "Dev Team",
        assignedBy: "Tech Lead",
        createdDate: "2024-07-01",
        deadline: "2024-09-30",
        category: "Product",
        priority: "high",
        reminders: [
            { date: "2024-09-20", sent: false, type: "urgent" }
        ]
    }
]

// Progress data for charts
const progressData = [
    { month: 'Jan', revenue: 45000, target: 50000, customers: 78 },
    { month: 'Feb', revenue: 48000, target: 50000, customers: 82 },
    { month: 'Mar', revenue: 52000, target: 50000, customers: 89 },
    { month: 'Apr', revenue: 49000, target: 50000, customers: 95 },
    { month: 'May', revenue: 51000, target: 50000, customers: 88 },
    { month: 'Jun', revenue: 47000, target: 50000, customers: 92 },
    { month: 'Jul', revenue: 53000, target: 50000, customers: 96 },
    { month: 'Aug', revenue: 48500, target: 50000, customers: 91 },
    { month: 'Sep', revenue: 38500, target: 50000, customers: 85 }
]

const categoryData = [
    { name: 'Revenue', value: 35, color: '#3B82F6' },
    { name: 'Growth', value: 25, color: '#10B981' },
    { name: 'Development', value: 20, color: '#8B5CF6' },
    { name: 'Product', value: 20, color: '#F59E0B' }
]

const statusData = [
    { name: 'Completed', count: 12, color: '#10B981' },
    { name: 'In Progress', count: 18, color: '#3B82F6' },
    { name: 'At Risk', count: 5, color: '#EF4444' },
    { name: 'Overdue', count: 2, color: '#DC2626' }
]

export default function Targets() {
    const { api, currentUser } = useAuth()
    const [targets, setTargets] = useState(dummyTargets)
    const [activeTab, setActiveTab] = useState('overview')
    const [filterPeriod, setFilterPeriod] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedTarget, setSelectedTarget] = useState(null)
    const [reminders, setReminders] = useState([])
    const [employees, setEmployees] = useState([])
    const [newEmployee, setNewEmployee] = useState({
        name: "",
        target: "",
        todayAchieved: "",
        weeklyAchieved: "",
        totalLeads: "",
        leadEmails: "" // New field for email addresses
    })
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState({ show: false, message: '', type: '' })
    const [emailsSent, setEmailsSent] = useState(false)

    // Fetch employees from backend
    const fetchEmployees = async () => {
        try {
            setLoading(true)
            const { data } = await api.get('/api/employees')
            setEmployees(data)
        } catch (error) {
            console.error('Failed to fetch employees:', error)
            showNotification('Failed to load employees', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEmployees()
    }, [api])

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type })
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000)
    }

    // Send email notification to admin for each lead
    const sendLeadEmails = async (employeeData) => {
        try {
            const totalLeads = parseInt(employeeData.totalLeads) || 0;
            const emailList = employeeData.leadEmails.split(',').map(email => email.trim()).filter(email => email);
            
            // If no emails provided, use admin email
            const adminEmail = emailList.length > 0 ? emailList : ["admin@company.com"];
            
            // Send one email per lead
            for (let i = 0; i < totalLeads; i++) {
                await api.post('/api/send-email', {
                    to: adminEmail,
                    subject: `New Lead Notification - ${employeeData.name}`,
                    body: `Lead #${i+1}: ${employeeData.name} has achieved a new lead. Total leads: ${totalLeads}`
                });
            }
            
            setEmailsSent(true);
            showNotification(`Sent ${totalLeads} lead notification emails to admin`, 'success');
        } catch (error) {
            console.error('Failed to send lead emails:', error);
            showNotification('Failed to send lead notification emails', 'error');
        }
    }

    // Add employee to list (creates approval request)
    const handleAddEmployee = async (e) => {
        e.preventDefault();
        if (!newEmployee.name || !newEmployee.target) {
            showNotification('Name and Target are required', 'error')
            return;
        }

        try {
            setLoading(true)
            
            // Send lead notification emails first
            await sendLeadEmails(newEmployee);
            
            // Create approval request instead of directly adding employee
            await api.post('/api/approvals', {
                actionType: 'CREATE',
                entity: 'Employee',
                requestedBy: currentUser.id,
                data: {
                    name: newEmployee.name,
                    target: Number(newEmployee.target),
                    todayAchieved: Number(newEmployee.todayAchieved) || 0,
                    weeklyAchieved: Number(newEmployee.weeklyAchieved) || 0,
                    totalLeads: Number(newEmployee.totalLeads) || 0,
                    leadEmails: newEmployee.leadEmails || "admin@company.com"
                }
            });
            
            // Reset form
            setNewEmployee({ 
                name: "", 
                target: "", 
                todayAchieved: "", 
                weeklyAchieved: "", 
                totalLeads: "",
                leadEmails: ""
            });
            
            // Show success message
            showNotification('Employee creation request sent for approval!', 'success')
        } catch (error) {
            console.error('Failed to create approval request:', error)
            showNotification('Failed to send approval request', 'error')
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        // Simulate checking for reminders
        const checkReminders = () => {
            const today = new Date().toISOString().split('T')[0]
            const pendingReminders = targets.flatMap(target =>
                target.reminders.filter(reminder => !reminder.sent && reminder.date <= today)
            )
            setReminders(pendingReminders)
        }
        checkReminders()
    }, [targets])

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800'
            case 'in_progress': return 'bg-blue-100 text-blue-800'
            case 'at_risk': return 'bg-yellow-100 text-yellow-800'
            case 'overdue': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-600'
            case 'medium': return 'text-yellow-600'
            case 'low': return 'text-green-600'
            default: return 'text-gray-600'
        }
    }

    const filteredTargets = targets.filter(target => {
        if (filterPeriod !== 'all' && !target.period.includes(filterPeriod)) return false
        if (filterStatus !== 'all' && target.status !== filterStatus) return false
        return true
    })

    const TabButton = ({ id, label, icon: Icon, count, isActive, onClick }) => (
        <button
            onClick={() => onClick(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
        >
            <Icon size={18} />
            {label}
            {count && <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">{count}</span>}
        </button>
    )

    const StatCard = ({ title, value, change, trend, icon: Icon, color }) => (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon size={20} className="text-white" />
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' :
                    trend === 'down' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                    }`}>
                    {change}
                </span>
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-600">{title}</p>
            </div>
        </div>
    )

    const TargetCard = ({ target }) => (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{target.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(target.status)}`}>
                            {target.status.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{target.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {target.deadline}
                        </span>
                        <span className="flex items-center gap-1">
                            <Users size={12} />
                            {target.assignedTo}
                        </span>
                        <span className={`flex items-center gap-1 ${getPriorityColor(target.priority)}`}>
                            <AlertTriangle size={12} />
                            {target.priority} priority
                        </span>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                        {target.achievedValue.toLocaleString()} / {target.targetValue.toLocaleString()}
                        <span className="text-gray-500 ml-1">({target.progress}%)</span>
                    </span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all ${target.progress >= 100 ? 'bg-green-500' :
                            target.progress >= 75 ? 'bg-blue-500' :
                                target.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${Math.min(target.progress, 100)}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setSelectedTarget(target)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
                >
                    <Eye size={14} />
                    View Details
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Edit size={14} />
                    Edit
                </button>
                {target.reminders.some(r => !r.sent) && (
                    <div className="flex items-center gap-1 text-orange-600 text-xs">
                        <Bell size={12} />
                        Reminder Due
                    </div>
                )}
            </div>
        </div>
    )

    const renderOverview = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Targets"
                    value="37"
                    change="+5 this month"
                    trend="up"
                    icon={Target}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Completed"
                    value="12"
                    change="32% completion rate"
                    trend="up"
                    icon={CheckCircle}
                    color="bg-green-500"
                />
                <StatCard
                    title="In Progress"
                    value="18"
                    change="Average 68% progress"
                    trend="stable"
                    icon={Clock}
                    color="bg-yellow-500"
                />
                <StatCard
                    title="At Risk"
                    value="7"
                    change="Need attention"
                    trend="down"
                    icon={AlertTriangle}
                    color="bg-red-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Target vs Achievement Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={progressData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => [value.toLocaleString(), '']} />
                            <Area type="monotone" dataKey="target" stackId="1" stroke="#E5E7EB" fill="#F3F4F6" name="Target" />
                            <Area type="monotone" dataKey="revenue" stackId="2" stroke="#3B82F6" fill="#DBEAFE" name="Achievement" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Targets by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}%`}
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Progress Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [value.toLocaleString(), '']} />
                        <Bar dataKey="target" fill="#E5E7EB" name="Target" />
                        <Bar dataKey="revenue" fill="#3B82F6" name="Achievement" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )

    const renderTargets = () => (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-3">
                    <select
                        value={filterPeriod}
                        onChange={(e) => setFilterPeriod(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="all">All Periods</option>
                        <option value="2024-09">September 2024</option>
                        <option value="Q3">Q3 2024</option>
                        <option value="2024">2024</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="at_risk">At Risk</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={16} />
                    Create Target
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTargets.map(target => (
                    <TargetCard key={target.id} target={target} />
                ))}
            </div>
        </div>
    )

    const renderReminders = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Automated Reminders</h2>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Bell size={16} />
                        Configure Alerts
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="text-red-600" size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Overdue Targets</h3>
                            <p className="text-sm text-gray-600">2 targets need immediate attention</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="p-3 bg-red-50 rounded-lg">
                            <p className="font-medium text-red-900 text-sm">Monthly Sales Revenue</p>
                            <p className="text-red-700 text-xs">Due: 2024-09-30</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="text-yellow-600" size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Upcoming Deadlines</h3>
                            <p className="text-sm text-gray-600">5 targets due this week</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="p-3 bg-yellow-50 rounded-lg">
                            <p className="font-medium text-yellow-900 text-sm">Customer Acquisition</p>
                            <p className="text-yellow-700 text-xs">Due: 2024-09-30</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="text-green-600" size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Recent Completions</h3>
                            <p className="text-sm text-gray-600">3 targets completed this week</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <p className="font-medium text-green-900 text-sm">Employee Training</p>
                            <p className="text-green-700 text-xs">Completed: 2024-09-25</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reminder Settings</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">50% Progress Reminder</p>
                            <p className="text-sm text-gray-600">Send reminder when target reaches 50% completion</p>
                        </div>
                        <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">7-Day Deadline Warning</p>
                            <p className="text-sm text-gray-600">Alert 7 days before target deadline</p>
                        </div>
                        <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Overdue Notifications</p>
                            <p className="text-sm text-gray-600">Daily reminders for overdue targets</p>
                        </div>
                        <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                    </div>
                </div>
            </div>
        </div>
    )

    const renderAnalytics = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Target Analytics</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download size={16} />
                    Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Rate by Team</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                            { team: 'Sales', achievement: 85, target: 100 },
                            { team: 'Marketing', achievement: 92, target: 100 },
                            { team: 'Development', achievement: 78, target: 100 },
                            { team: 'HR', achievement: 100, target: 100 },
                            { team: 'Operations', achievement: 65, target: 100 }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="team" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="achievement" fill="#3B82F6" />
                            <Bar dataKey="target" fill="#E5E7EB" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="count"
                                label={({ name, count }) => `${name}: ${count}`}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )

    const renderEmployee = () => (
        <div>
          <EmployeeTargets/>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Target Management</h1>
                    <p className="text-gray-600">Set, track, and analyze targets for teams and individuals</p>
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

                {reminders.length > 0 && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Bell className="text-yellow-600" size={16} />
                            <span className="font-medium text-yellow-800">Pending Reminders ({reminders.length})</span>
                        </div>
                        <p className="text-sm text-yellow-700">You have targets requiring attention or approaching deadlines.</p>
                    </div>
                )}

                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        <TabButton id="overview" label="Overview" icon={BarChart3} isActive={activeTab === 'overview'} onClick={setActiveTab} />
                        <TabButton id="employees-targets" label="Employee Targets" icon={TrendingUp} isActive={activeTab === 'employees-targets'} onClick={setActiveTab} />
                        <TabButton id="targets" label="All Targets" icon={Target} count={targets.length} isActive={activeTab === 'targets'} onClick={setActiveTab} />
                        <TabButton id="reminders" label="Reminders" icon={Bell} count={reminders.length} isActive={activeTab === 'reminders'} onClick={setActiveTab} />
                        <TabButton id="analytics" label="Analytics" icon={TrendingUp} isActive={activeTab === 'analytics'} onClick={setActiveTab} />
                    </div>
                </div>

                <div className="transition-all duration-200">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'targets' && renderTargets()}
                    {activeTab === 'reminders' && renderReminders()}
                    {activeTab === 'analytics' && renderAnalytics()}
                    {activeTab === 'employees-targets' && renderEmployee()}
                </div>

                {/* Target Detail Modal */}
                {selectedTarget && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Target Details</h2>
                                    <button
                                        onClick={() => setSelectedTarget(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">{selectedTarget.title}</h3>
                                        <p className="text-gray-700 mb-4">{selectedTarget.description}</p>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-600">Period:</span>
                                                <p className="text-gray-900">{selectedTarget.period}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Deadline:</span>
                                                <p className="text-gray-900">{selectedTarget.deadline}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Assigned To:</span>
                                                <p className="text-gray-900">{selectedTarget.assignedTo}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-600">Priority:</span>
                                                <p className={`font-medium ${getPriorityColor(selectedTarget.priority)}`}>
                                                    {selectedTarget.priority}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Progress</h4>
                                        <div className="bg-gray-200 rounded-full h-4 mb-2">
                                            <div
                                                className="bg-blue-500 h-4 rounded-full"
                                                style={{ width: `${selectedTarget.progress}%` }}
                                            />
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {selectedTarget.achievedValue.toLocaleString()} / {selectedTarget.targetValue.toLocaleString()}
                                            ({selectedTarget.progress}% complete)
                                        </p>
                                    </div>

                                    {selectedTarget.reminders.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Reminders</h4>
                                            <div className="space-y-2">
                                                {selectedTarget.reminders.map((reminder, idx) => (
                                                    <div key={idx} className={`p-3 rounded-lg ${reminder.sent ? 'bg-gray-50' : 'bg-yellow-50'}`}>
                                                        <div className="flex items-center gap-2">
                                                            <Bell size={14} className={reminder.sent ? 'text-gray-500' : 'text-yellow-600'} />
                                                            <span className="text-sm font-medium">
                                                                {reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)} Reminder
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs ${reminder.sent ? 'bg-gray-200 text-gray-700' : 'bg-yellow-200 text-yellow-800'
                                                                }`}>
                                                                {reminder.sent ? 'Sent' : 'Pending'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">Due: {reminder.date}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                                    <button
                                        onClick={() => setSelectedTarget(null)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Update Progress
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Target Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-lg w-full">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Create New Target</h2>
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter target title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
                                            placeholder="Describe the target"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                <option value="monthly">Monthly</option>
                                                <option value="quarterly">Quarterly</option>
                                                <option value="annual">Annual</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                <option value="high">High</option>
                                                <option value="medium">Medium</option>
                                                <option value="low">Low</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Target Value</label>
                                            <input
                                                type="number"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                                            <input
                                                type="date"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="">Select team or individual</option>
                                            <option value="sales">Sales Team</option>
                                            <option value="marketing">Marketing Team</option>
                                            <option value="development">Development Team</option>
                                            <option value="hr">HR Team</option>
                                            <option value="individual">Individual Employee</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option value="revenue">Revenue</option>
                                            <option value="growth">Growth</option>
                                            <option value="development">Development</option>
                                            <option value="product">Product</option>
                                            <option value="operational">Operational</option>
                                        </select>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h3 className="font-medium text-gray-900 mb-3">Reminder Settings</h3>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                                                <span className="text-sm text-gray-700">50% progress reminder</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                                                <span className="text-sm text-gray-700">7-day deadline warning</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                                                <span className="text-sm text-gray-700">Daily overdue notifications</span>
                                            </label>
                                        </div>
                                    </div>
                                </form>

                                <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Add new target logic here
                                            setShowCreateModal(false)
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Create Target
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
 