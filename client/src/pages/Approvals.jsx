import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext.jsx"
import { Mail, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"

export default function Approvals() {
  const { api, currentUser } = useAuth()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })

  // Check if user is admin
  const isAdmin = currentUser?.role === 'admin'

  useEffect(() => {
    if (!isAdmin) return
    
    const fetchApprovals = async () => {
      try {
        setLoading(true)
        const { data } = await api.get("/api/approvals")
        setList(data)
      } catch (error) {
        console.error('Failed to fetch approvals:', error)
        showNotification('Failed to load approvals', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchApprovals()
  }, [api, isAdmin])

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000)
  }

  async function approve(id) {
    try {
      setLoading(true)
      await api.post(`/api/approvals/${id}/approve`)
      setList(list.filter((l) => l.id !== id))
      showNotification('Request approved successfully!', 'success')
    } catch (error) {
      console.error('Failed to approve:', error)
      showNotification('Failed to approve request', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function reject(id) {
    const reason = prompt("Reason (optional)")
    if (reason === null) return // User cancelled
    
    try {
      setLoading(true)
      await api.post(`/api/approvals/${id}/reject`, { reason })
      setList(list.filter((l) => l.id !== id))
      showNotification('Request rejected', 'success')
    } catch (error) {
      console.error('Failed to reject:', error)
      showNotification('Failed to reject request', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Status badge component
  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            <Clock size={12} />
            Pending
          </span>
        )
      case 'APPROVED':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            <CheckCircle size={12} />
            Approved
          </span>
        )
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            <XCircle size={12} />
            Rejected
          </span>
        )
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>
    }
  }

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h1>
          <p className="text-red-600">You don't have permission to view approval requests.</p>
          <p className="text-red-600 mt-2">This page is only accessible to administrators.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Approval Requests</h1>
        <div className="text-sm text-gray-500">
          {list.filter(r => r.status === 'PENDING').length} pending requests
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
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

      {loading && list.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading approval requests...</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-left text-gray-700">
              <tr>
                <th className="p-3 border font-medium">When</th>
                <th className="p-3 border font-medium">By</th>
                <th className="p-3 border font-medium">Action</th>
                <th className="p-3 border font-medium">Entity</th>
                <th className="p-3 border font-medium">Details</th>
                <th className="p-3 border font-medium">Status</th>
                <th className="p-3 border font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 border-t">
                  <td className="p-3">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="p-3">{r.requestedBy?.name || "Unknown"}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {r.actionType}
                    </span>
                  </td>
                  <td className="p-3">{r.entity}</td>
                  <td className="p-3">
                    {r.data && (
                      <div className="space-y-1">
                        <p><span className="font-medium">Name:</span> {r.data.name}</p>
                        <p><span className="font-medium">Target:</span> {r.data.target}</p>
                        <p><span className="font-medium">Total Leads:</span> {r.data.totalLeads}</p>
                        <p><span className="font-medium">Today:</span> {r.data.todayAchieved}</p>
                        <p><span className="font-medium">Weekly:</span> {r.data.weeklyAchieved}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Mail size={14} className="text-gray-500" />
                          <span className="font-medium">Emails:</span> {r.data.leadEmails || "admin@company.com"}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="p-3">
                    {r.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-1 text-sm disabled:opacity-50"
                          onClick={() => approve(r.id)}
                          disabled={loading}
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                        <button
                          className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-1 text-sm disabled:opacity-50"
                          onClick={() => reject(r.id)}
                          disabled={loading}
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td className="p-8 text-sm text-gray-500 text-center" colSpan="7">
                    <div className="flex flex-col items-center">
                      <Mail className="text-gray-300 mb-2" size={48} />
                      <p>No approval requests yet.</p>
                      <p className="mt-1">When employees submit requests, they will appear here.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Email Notification Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Mail className="text-blue-600 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-blue-800">Email Notifications</h3>
            <p className="text-blue-700 text-sm mt-1">
              When you approve an employee request, an email notification will be sent to the specified email addresses for each lead the employee has achieved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}