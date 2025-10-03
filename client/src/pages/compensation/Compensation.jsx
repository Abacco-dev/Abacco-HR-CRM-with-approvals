import { useEffect, useState } from 'react'
import { Calendar, DollarSign, Heart, Users, Plus, Edit2, CheckCircle, XCircle, Clock } from 'lucide-react'

// Dummy data - replace with actual API calls
const dummyCompensation = [
  { id: 1, effectiveFrom: '2024-01-01', baseSalary: 85000, bonus: 12000, status: 'active' },
  { id: 2, effectiveFrom: '2023-06-01', baseSalary: 80000, bonus: 10000, status: 'inactive' },
  { id: 3, effectiveFrom: '2023-01-01', baseSalary: 75000, bonus: 8000, status: 'inactive' }
]

const dummyBenefits = [
  { id: 1, name: 'Health Insurance', type: 'health', enrolled: true, cost: 450, description: 'Comprehensive medical coverage' },
  { id: 2, name: 'Dental Insurance', type: 'health', enrolled: true, cost: 85, description: 'Full dental coverage' },
  { id: 3, name: 'Vision Insurance', type: 'health', enrolled: false, cost: 25, description: 'Eye care coverage' },
  { id: 4, name: '401k Retirement Plan', type: 'retirement', enrolled: true, cost: 0, description: 'Company matching up to 6%' },
  { id: 5, name: 'Life Insurance', type: 'insurance', enrolled: true, cost: 35, description: '2x annual salary coverage' },
  { id: 6, name: 'Flexible Spending Account', type: 'health', enrolled: false, cost: 0, description: 'Pre-tax healthcare expenses' }
]

const dummyPayroll = [
  { id: 1, period: '2024-09-15', grossPay: 7083.33, netPay: 5245.67, deductions: 1837.66, status: 'paid' },
  { id: 2, period: '2024-08-31', grossPay: 7083.33, netPay: 5267.89, deductions: 1815.44, status: 'paid' },
  { id: 3, period: '2024-08-15', grossPay: 7083.33, netPay: 5234.12, deductions: 1849.21, status: 'paid' },
  { id: 4, period: '2024-07-31', grossPay: 7083.33, netPay: 5198.45, deductions: 1884.88, status: 'paid' }
]

// Mock user data - replace with actual auth context
const mockUser = { id: 1, role: 'EMPLOYEE', name: 'John Doe' }

export default function Compensation() {
  const [activeTab, setActiveTab] = useState('compensation')
  const [comp, setComp] = useState([])
  const [benefits, setBenefits] = useState([])
  const [payroll, setPayroll] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCompensation, setNewCompensation] = useState({ baseSalary: '', bonus: '', effectiveFrom: '' })

  // Simulate API calls - replace with actual API integration
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Replace these with actual API calls:
      // const compData = await api.get(`/api/compensation?userId=${user.id}`)
      // const benefitsData = await api.get(`/api/benefits?userId=${user.id}`)
      // const payrollData = await api.get(`/api/payroll?userId=${user.id}`)
      
      setComp(dummyCompensation)
      setBenefits(dummyBenefits)
      setPayroll(dummyPayroll)
      setLoading(false)
    }
    
    fetchData()
  }, [])

  const handleAddCompensation = async () => {
    if (!newCompensation.baseSalary || !newCompensation.effectiveFrom) {
      alert('Please fill in all required fields')
      return
    }

    const compensationData = {
      userId: mockUser.id,
      baseSalary: parseFloat(newCompensation.baseSalary),
      bonus: parseFloat(newCompensation.bonus) || 0,
      effectiveFrom: newCompensation.effectiveFrom,
      status: 'pending'
    }

    try {
      if (mockUser.role === 'ADMIN') {
        // Replace with actual API call:
        // await api.post('/api/compensation', compensationData)
        
        // Simulate adding to state
        const newComp = {
          id: Date.now(),
          ...compensationData,
          status: 'active'
        }
        setComp(prev => [newComp, ...prev.map(c => ({ ...c, status: 'inactive' }))])
        alert('Compensation updated successfully')
      } else {
        // Replace with actual approval request:
        // await request('CREATE_COMPENSATION', 'compensation', compensationData)
        alert('Compensation change request submitted for approval')
      }
      
      setShowAddForm(false)
      setNewCompensation({ baseSalary: '', bonus: '', effectiveFrom: '' })
    } catch (error) {
      alert('Error processing request')
    }
  }

  const handleBenefitEnrollment = async (benefitId, enroll) => {
    try {
      // Replace with actual API call:
      // await api.put(`/api/benefits/${benefitId}/enrollment`, { enrolled: enroll })
      
      setBenefits(prev => prev.map(benefit => 
        benefit.id === benefitId ? { ...benefit, enrolled: enroll } : benefit
      ))
      alert(`Successfully ${enroll ? 'enrolled in' : 'unenrolled from'} benefit`)
    } catch (error) {
      alert('Error updating benefit enrollment')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading compensation data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Compensation & Benefits</h1>
        <div className="text-sm text-gray-600">
          Employee: {mockUser.name} | Role: {mockUser.role}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'compensation', name: 'Compensation', icon: DollarSign },
            { id: 'benefits', name: 'Benefits', icon: Heart },
            { id: 'payroll', name: 'Payroll', icon: Calendar }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Compensation Tab */}
      {activeTab === 'compensation' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Compensation History</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Compensation</span>
            </button>
          </div>

          {/* Current Compensation Summary */}
          {comp.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="ml-2 text-sm font-medium text-green-900">Current Base Salary</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-green-900">
                  ${comp[0].baseSalary.toLocaleString()}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span className="ml-2 text-sm font-medium text-blue-900">Current Bonus</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-blue-900">
                  ${comp[0].bonus.toLocaleString()}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <span className="ml-2 text-sm font-medium text-purple-900">Total Compensation</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-purple-900">
                  ${(comp[0].baseSalary + comp[0].bonus).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Add Compensation Form */}
          {showAddForm && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Add New Compensation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Salary *
                  </label>
                  <input
                    type="number"
                    value={newCompensation.baseSalary}
                    onChange={(e) => setNewCompensation(prev => ({ ...prev, baseSalary: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="85000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bonus
                  </label>
                  <input
                    type="number"
                    value={newCompensation.bonus}
                    onChange={(e) => setNewCompensation(prev => ({ ...prev, bonus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Effective From *
                  </label>
                  <input
                    type="date"
                    value={newCompensation.effectiveFrom}
                    onChange={(e) => setNewCompensation(prev => ({ ...prev, effectiveFrom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleAddCompensation}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {mockUser.role === 'ADMIN' ? 'Add Compensation' : 'Submit Request'}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Compensation History Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Effective Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bonus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comp.map((c, index) => (
                  <tr key={c.id} className={index === 0 ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(c.effectiveFrom).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${c.baseSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${c.bonus.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${(c.baseSalary + c.bonus).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        c.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {comp.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                      No compensation records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Benefits Tab */}
      {activeTab === 'benefits' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Benefits Enrollment</h2>
            <div className="text-sm text-gray-600">
              Total Monthly Cost: ${benefits.filter(b => b.enrolled).reduce((sum, b) => sum + b.cost, 0)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map(benefit => (
              <div key={benefit.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{benefit.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{benefit.description}</p>
                  </div>
                  <div className="flex items-center">
                    {benefit.enrolled ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500">Monthly Cost:</span>
                    <span className="ml-2 font-medium">${benefit.cost}</span>
                  </div>
                  
                  <button
                    onClick={() => handleBenefitEnrollment(benefit.id, !benefit.enrolled)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      benefit.enrolled
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {benefit.enrolled ? 'Unenroll' : 'Enroll'}
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    benefit.enrolled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {benefit.enrolled ? 'Enrolled' : 'Not Enrolled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payroll Tab */}
      {activeTab === 'payroll' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Payroll History</h2>
            <div className="text-sm text-gray-600">
              Last 4 pay periods
            </div>
          </div>

          {/* Payroll Summary Cards */}
          {payroll.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span className="ml-2 text-sm font-medium text-blue-900">Last Gross Pay</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-blue-900">
                  ${payroll[0].grossPay.toLocaleString()}
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="ml-2 text-sm font-medium text-green-900">Last Net Pay</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-green-900">
                  ${payroll[0].netPay.toLocaleString()}
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-red-600" />
                  <span className="ml-2 text-sm font-medium text-red-900">Last Deductions</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-red-900">
                  ${payroll[0].deductions.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Payroll History Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pay Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gross Pay
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deductions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Pay
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payroll.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(p.period).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${p.grossPay.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      -${p.deductions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${p.netPay.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {payroll.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                      No payroll records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}