import { useState } from "react"
import { BarChart3, Target, Star, Users, TrendingUp } from "lucide-react"
import Dashboard from "./Dashboard"
import OverAll from "./OverAll"
// import Reviews from "./Reviews"
// import Feedback360 from "./Feedback360"
import Reports from "./Reports"
import TabButton from "./components/TabButton"

export default function Performance() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Performance Management
          </h1>
          <p className="text-gray-600">
            Track goals, conduct reviews, and analyze performance metrics
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <TabButton id="dashboard" label="Dashboard" icon={BarChart3} isActive={activeTab === "dashboard"} onClick={setActiveTab} />
            <TabButton id="overall" label="Overall" icon={Target} isActive={activeTab === "overall"} onClick={setActiveTab} />
            {/* <TabButton id="reviews" label="Reviews" icon={Star} isActive={activeTab === "reviews"} onClick={setActiveTab} /> */}
            {/* <TabButton id="feedback360" label="360° Feedback" icon={Users} isActive={activeTab === "feedback360"} onClick={setActiveTab} /> */}
            <TabButton id="reports" label="Reports" icon={TrendingUp} isActive={activeTab === "reports"} onClick={setActiveTab} />
          </div>
        </div>

        <div className="transition-all duration-200">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "overall" && <OverAll />}
          {/* {activeTab === "reviews" && <Reviews />} */}
          {/* {activeTab === "feedback360" && <Feedback360 />} */}
          {activeTab === "reports" && <Reports />}
        </div>
      </div>
    </div>
  )
}

// import { useEffect, useState } from 'react'
// import { Calendar, Target, TrendingUp, Users, Star, BarChart3, Clock, Award, ChevronDown, ChevronRight, Plus, Filter, Download, Edit, Eye, MessageCircle } from 'lucide-react'

// // Dummy data
// const dummyGoals = [
//   {
//     id: 1,
//     title: "Increase Sales Revenue",
//     description: "Achieve 25% increase in quarterly sales revenue",
//     type: "quarterly",
//     progress: 78,
//     startDate: "2024-01-01",
//     endDate: "2024-03-31",
//     status: "in_progress",
//     assignedTo: "John Smith",
//     department: "Sales"
//   },
//   {
//     id: 2,
//     title: "Complete React Training",
//     description: "Finish advanced React development course",
//     type: "monthly",
//     progress: 100,
//     startDate: "2024-02-01",
//     endDate: "2024-02-29",
//     status: "completed",
//     assignedTo: "Sarah Johnson",
//     department: "Engineering"
//   },
//   {
//     id: 3,
//     title: "Launch New Product Line",
//     description: "Successfully launch and market new product category",
//     type: "annual",
//     progress: 45,
//     startDate: "2024-01-01",
//     endDate: "2024-12-31",
//     status: "in_progress",
//     assignedTo: "Mike Chen",
//     department: "Product"
//   }
// ]

// const dummyReviews = [
//   {
//     id: 1,
//     period: "2024-Q1",
//     employeeName: "John Smith",
//     employeeId: "EMP001",
//     reviewerName: "Alice Manager",
//     rating: 4.2,
//     status: "completed",
//     reviewDate: "2024-03-15",
//     feedback: "Excellent performance in sales targets. Shows great leadership potential.",
//     goals: ["Increase team productivity", "Complete leadership training"],
//     strengths: ["Communication", "Problem-solving", "Leadership"],
//     improvements: ["Time management", "Technical skills"]
//   },
//   {
//     id: 2,
//     period: "2024-Q1",
//     employeeName: "Sarah Johnson",
//     employeeId: "EMP002",
//     reviewerName: "Bob Director",
//     rating: 4.8,
//     status: "completed",
//     reviewDate: "2024-03-20",
//     feedback: "Outstanding technical contributions and mentoring abilities.",
//     goals: ["Lead new project", "Mentor junior developers"],
//     strengths: ["Technical expertise", "Mentoring", "Innovation"],
//     improvements: ["Public speaking", "Project management"]
//   }
// ]

// const dummy360Feedback = [
//   {
//     id: 1,
//     employeeName: "John Smith",
//     period: "2024-Q1",
//     status: "completed",
//     responses: 8,
//     totalInvited: 10,
//     averageRating: 4.3,
//     categories: {
//       leadership: 4.5,
//       communication: 4.2,
//       teamwork: 4.1,
//       technical: 3.9,
//       innovation: 4.4
//     },
//     feedback: [
//       { from: "Peer", rating: 4, comment: "Great collaborator and always willing to help" },
//       { from: "Direct Report", rating: 5, comment: "Excellent manager, very supportive" },
//       { from: "Manager", rating: 4, comment: "Strong performer with leadership potential" }
//     ]
//   }
// ]

// const dummyKPIs = [
//   { name: "Employee Satisfaction", value: 4.2, target: 4.0, trend: "up", change: "+0.3" },
//   { name: "Goal Completion Rate", value: 87, target: 85, trend: "up", change: "+5%" },
//   { name: "Average Rating", value: 4.1, target: 4.0, trend: "stable", change: "0%" },
//   { name: "Review Completion", value: 94, target: 90, trend: "up", change: "+8%" },
//   { name: "Feedback Response Rate", value: 76, target: 80, trend: "down", change: "-4%" },
//   { name: "Career Development Plans", value: 68, target: 75, trend: "up", change: "+12%" }
// ]

// export default function Performance() {
//   const [activeTab, setActiveTab] = useState('dashboard')
//   const [goals, setGoals] = useState(dummyGoals)
//   const [reviews, setReviews] = useState(dummyReviews)
//   const [feedback360, setFeedback360] = useState(dummy360Feedback)
//   const [selectedPeriod, setSelectedPeriod] = useState('2024-Q1')
//   const [showCreateModal, setShowCreateModal] = useState(false)
//   const [expandedReview, setExpandedReview] = useState(null)

//   const handleCreateGoal = () => {
//     const newGoal = {
//       id: goals.length + 1,
//       title: "New Goal",
//       description: "Goal description",
//       type: "monthly",
//       progress: 0,
//       startDate: new Date().toISOString().split('T')[0],
//       endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//       status: "in_progress",
//       assignedTo: "Current User",
//       department: "General"
//     }
//     setGoals([...goals, newGoal])
//   }

//   const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
//     <button
//       onClick={() => onClick(id)}
//       className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
//         isActive 
//           ? 'bg-blue-100 text-blue-700 border border-blue-200' 
//           : 'text-gray-600 hover:bg-gray-100'
//       }`}
//     >
//       <Icon size={18} />
//       {label}
//     </button>
//   )

//   const KPICard = ({ name, value, target, trend, change }) => (
//     <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//       <div className="flex items-center justify-between mb-2">
//         <h3 className="font-medium text-gray-900">{name}</h3>
//         <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
//           trend === 'up' ? 'bg-green-100 text-green-700' :
//           trend === 'down' ? 'bg-red-100 text-red-700' :
//           'bg-gray-100 text-gray-600'
//         }`}>
//           <TrendingUp size={12} />
//           {change}
//         </div>
//       </div>
//       <div className="flex items-end gap-2">
//         <span className="text-2xl font-bold text-gray-900">{value}</span>
//         <span className="text-sm text-gray-500">/ {target}</span>
//       </div>
//       <div className="mt-3 bg-gray-200 rounded-full h-2">
//         <div 
//           className={`h-2 rounded-full ${value >= target ? 'bg-green-500' : 'bg-blue-500'}`}
//           style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
//         />
//       </div>
//     </div>
//   )

//   const GoalCard = ({ goal }) => (
//     <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//       <div className="flex items-start justify-between mb-3">
//         <div>
//           <h3 className="font-semibold text-gray-900 mb-1">{goal.title}</h3>
//           <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
//           <div className="flex items-center gap-4 text-xs text-gray-500">
//             <span className="flex items-center gap-1">
//               <Calendar size={12} />
//               {goal.startDate} - {goal.endDate}
//             </span>
//             <span className="flex items-center gap-1">
//               <Users size={12} />
//               {goal.assignedTo}
//             </span>
//           </div>
//         </div>
//         <span className={`px-2 py-1 rounded-full text-xs ${
//           goal.status === 'completed' ? 'bg-green-100 text-green-700' :
//           goal.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
//           'bg-yellow-100 text-yellow-700'
//         }`}>
//           {goal.status.replace('_', ' ')}
//         </span>
//       </div>
//       <div className="mb-3">
//         <div className="flex items-center justify-between text-sm mb-1">
//           <span className="text-gray-600">Progress</span>
//           <span className="font-medium text-gray-900">{goal.progress}%</span>
//         </div>
//         <div className="bg-gray-200 rounded-full h-2">
//           <div 
//             className="bg-blue-500 h-2 rounded-full transition-all"
//             style={{ width: `${goal.progress}%` }}
//           />
//         </div>
//       </div>
//       <div className="flex gap-2">
//         <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
//           <Edit size={14} />
//           Edit
//         </button>
//         <button className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
//           <Eye size={14} />
//           View
//         </button>
//       </div>
//     </div>
//   )

//   const renderDashboard = () => (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-semibold text-gray-900">Performance Dashboard</h2>
//         <div className="flex items-center gap-3">
//           <select 
//             value={selectedPeriod} 
//             onChange={(e) => setSelectedPeriod(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
//           >
//             <option value="2024-Q1">Q1 2024</option>
//             <option value="2024-Q2">Q2 2024</option>
//             <option value="2024-Q3">Q3 2024</option>
//             <option value="2024-Q4">Q4 2024</option>
//           </select>
//           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//             <Download size={16} />
//             Export
//           </button>
//         </div>
//       </div>

//      {/* Performance Chart */}
//         {/* <div className="bg-white rounded-lg shadow p-4">
//           <h3 className="text-lg font-semibold mb-4">Employee Performance</h3>
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={employees}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="target" fill="#3B82F6" name="Target" />
//               <Bar dataKey="todayAchieved" fill="#10B981" name="Today" />
//               <Bar dataKey="weeklyAchieved" fill="#F59E0B" name="Weekly" />
//               <Bar dataKey="totalLeads" fill="#8B5CF6" name="Total Leads" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div> 

//       {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {dummyKPIs.map((kpi, index) => (
//           <KPICard key={index} {...kpi} />
//         ))}
//       </div> */}

//       {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h3>
//           <div className="space-y-3">
//             {reviews.slice(0, 3).map(review => (
//               <div key={review.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                 <div>
//                   <p className="font-medium text-gray-900">{review.employeeName}</p>
//                   <p className="text-sm text-gray-600">{review.period}</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="flex items-center gap-1">
//                     <Star size={16} className="text-yellow-500 fill-current" />
//                     <span className="font-medium">{review.rating}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Progress</h3>
//           <div className="space-y-3">
//             {goals.slice(0, 3).map(goal => (
//               <div key={goal.id} className="p-3 bg-gray-50 rounded-lg">
//                 <div className="flex items-center justify-between mb-2">
//                   <p className="font-medium text-gray-900 text-sm">{goal.title}</p>
//                   <span className="text-sm font-medium text-gray-600">{goal.progress}%</span>
//                 </div>
//                 <div className="bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-blue-500 h-2 rounded-full"
//                     style={{ width: `${goal.progress}%` }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div> */}
//     </div>
//   )

//   const renderGoals = () => (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-semibold text-gray-900">Goals & Objectives</h2>
//         <div className="flex items-center gap-3">
//           <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
//             <option value="">All Types</option>
//             <option value="monthly">Monthly</option>
//             <option value="quarterly">Quarterly</option>
//             <option value="annual">Annual</option>
//           </select>
//           <button 
//             onClick={handleCreateGoal}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <Plus size={16} />
//             New Goal
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {goals.map(goal => (
//           <GoalCard key={goal.id} goal={goal} />
//         ))}
//       </div>
//     </div>
//   )

//   const renderReviews = () => (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-semibold text-gray-900">Performance Reviews</h2>
//         <div className="flex items-center gap-3">
//           <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
//             <option value="">All Periods</option>
//             <option value="2024-Q1">Q1 2024</option>
//             <option value="2024-Q2">Q2 2024</option>
//           </select>
//           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//             <Plus size={16} />
//             New Review
//           </button>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {reviews.map(review => (
//           <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">{review.employeeName}</h3>
//                 <p className="text-sm text-gray-600">{review.period} • Reviewed by {review.reviewerName}</p>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="flex items-center gap-1">
//                   <Star size={18} className="text-yellow-500 fill-current" />
//                   <span className="text-lg font-semibold">{review.rating}</span>
//                   <span className="text-sm text-gray-500">/5</span>
//                 </div>
//                 <button 
//                   onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
//                   className="p-1"
//                 >
//                   {expandedReview === review.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
//                 </button>
//               </div>
//             </div>

//             {expandedReview === review.id && (
//               <div className="space-y-4 pt-4 border-t border-gray-200">
//                 <div>
//                   <h4 className="font-medium text-gray-900 mb-2">Feedback</h4>
//                   <p className="text-gray-700 text-sm">{review.feedback}</p>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
//                     <div className="flex flex-wrap gap-1">
//                       {review.strengths.map((strength, idx) => (
//                         <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
//                           {strength}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
                  
//                   <div>
//                     <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
//                     <div className="flex flex-wrap gap-1">
//                       {review.improvements.map((improvement, idx) => (
//                         <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
//                           {improvement}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h4 className="font-medium text-gray-900 mb-2">Goals for Next Period</h4>
//                   <ul className="text-sm text-gray-700 space-y-1">
//                     {review.goals.map((goal, idx) => (
//                       <li key={idx} className="flex items-center gap-2">
//                         <Target size={12} />
//                         {goal}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   )

//   const render360Feedback = () => (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-semibold text-gray-900">360° Feedback</h2>
//         <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//           <Plus size={16} />
//           Start New 360°
//         </button>
//       </div>

//       <div className="space-y-6">
//         {feedback360.map(feedback => (
//           <div key={feedback.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">{feedback.employeeName}</h3>
//                 <p className="text-sm text-gray-600">{feedback.period}</p>
//               </div>
//               <div className="text-right">
//                 <div className="text-2xl font-bold text-gray-900">{feedback.averageRating}</div>
//                 <div className="text-sm text-gray-500">Average Rating</div>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
//               {Object.entries(feedback.categories).map(([category, rating]) => (
//                 <div key={category} className="text-center">
//                   <div className="text-lg font-semibold text-gray-900">{rating}</div>
//                   <div className="text-xs text-gray-600 capitalize">{category}</div>
//                   <div className="mt-1 bg-gray-200 rounded-full h-1">
//                     <div 
//                       className="bg-blue-500 h-1 rounded-full"
//                       style={{ width: `${(rating / 5) * 100}%` }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="mb-4">
//               <div className="flex items-center gap-2 mb-3">
//                 <MessageCircle size={16} />
//                 <span className="font-medium">Feedback Comments</span>
//                 <span className="text-sm text-gray-500">({feedback.responses}/{feedback.totalInvited} responses)</span>
//               </div>
//               <div className="space-y-2">
//                 {feedback.feedback.map((fb, idx) => (
//                   <div key={idx} className="p-3 bg-gray-50 rounded-lg">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="text-xs font-medium text-gray-600">{fb.from}</span>
//                       <div className="flex items-center gap-1">
//                         <Star size={12} className="text-yellow-500 fill-current" />
//                         <span className="text-xs">{fb.rating}</span>
//                       </div>
//                     </div>
//                     <p className="text-sm text-gray-700">{fb.comment}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )

//   const renderReports = () => (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-semibold text-gray-900">Performance Reports</h2>
//         <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//           <BarChart3 size={16} />
//           Generate Report
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <TrendingUp className="text-blue-600" size={20} />
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900">Department Performance</h3>
//               <p className="text-sm text-gray-600">Quarterly comparison</p>
//             </div>
//           </div>
//           <button className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
//             View Report
//           </button>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 bg-green-100 rounded-lg">
//               <Target className="text-green-600" size={20} />
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900">Goal Achievement</h3>
//               <p className="text-sm text-gray-600">Success rates by team</p>
//             </div>
//           </div>
//           <button className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
//             View Report
//           </button>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-2 bg-purple-100 rounded-lg">
//               <Users className="text-purple-600" size={20} />
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900">Employee Development</h3>
//               <p className="text-sm text-gray-600">Skills & growth tracking</p>
//             </div>
//           </div>
//           <button className="w-full py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
//             View Report
//           </button>
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Management</h1>
//           <p className="text-gray-600">Track goals, conduct reviews, and analyze performance metrics</p>
//         </div>

//         <div className="mb-6">
//           <div className="flex flex-wrap gap-2">
//             <TabButton id="dashboard" label="Dashboard" icon={BarChart3} isActive={activeTab === 'dashboard'} onClick={setActiveTab} />
//             <TabButton id="goals" label="Goals" icon={Target} isActive={activeTab === 'goals'} onClick={setActiveTab} />
//             <TabButton id="reviews" label="Reviews" icon={Star} isActive={activeTab === 'reviews'} onClick={setActiveTab} />
//             <TabButton id="feedback360" label="360° Feedback" icon={Users} isActive={activeTab === 'feedback360'} onClick={setActiveTab} />
//             <TabButton id="reports" label="Reports" icon={TrendingUp} isActive={activeTab === 'reports'} onClick={setActiveTab} />
//           </div>
//         </div>

//         <div className="transition-all duration-200">
//           {activeTab === 'dashboard' && renderDashboard()}
//           {activeTab === 'goals' && renderGoals()}
//           {activeTab === 'reviews' && renderReviews()}
//           {activeTab === 'feedback360' && render360Feedback()}
//           {activeTab === 'reports' && renderReports()}
//         </div>
//       </div>
//     </div>
//   )
// }