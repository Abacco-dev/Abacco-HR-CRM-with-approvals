import React, { useState, useEffect } from 'react';
import { Users, Plus, Calendar, FileText, CheckCircle, Clock, User, Mail, Phone, MapPin, Star, Send, Eye } from 'lucide-react';

// Dummy Data - Replace with API calls
const DUMMY_JOBS = [
  {
    id: 1,
    title: 'Senior HR Manager',
    department: 'Human Resources',
    location: 'Hyderabad, India',
    type: 'Full-time',
    status: 'active',
    postedDate: '2024-09-10',
    applicants: 12,
    description: 'Looking for an experienced HR Manager to lead our growing team.'
  },
  {
    id: 2,
    title: 'Software Engineer',
    department: 'Engineering',
    location: 'Bengaluru, India',
    type: 'Full-time',
    status: 'active',
    postedDate: '2024-09-15',
    applicants: 28,
    description: 'Join our engineering team to build innovative solutions.'
  },
  {
    id: 3,
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Mumbai, India',
    type: 'Contract',
    status: 'paused',
    postedDate: '2024-09-05',
    applicants: 8,
    description: 'Drive our marketing campaigns and brand awareness.'
  }
];

const DUMMY_APPLICANTS = [
  {
    id: 1,
    jobId: 1,
    name: 'Jayant Kumar',
    email: 'jayant.kumar@email.com',
    phone: '+91 98765 43210',
    location: 'Hyderabad, India',
    experience: '5 years',
    status: 'offer_stage',
    stage: 'Offer Stage',
    appliedDate: '2024-09-12',
    rating: 4.5,
    resume: 'jayant_kumar_resume.pdf',
    interviews: [
      { type: 'HR Interview - Telephonic', status: 'completed', date: '2024-09-14', feedback: 'Great communication skills' },
      { type: 'Technical Interview - Face to Face', status: 'completed', date: '2024-09-16', feedback: 'Strong technical background' },
      { type: 'Interview with CEO', status: 'completed', date: '2024-09-17', feedback: 'Excellent cultural fit' }
    ]
  },
  {
    id: 2,
    jobId: 1,
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 87654 32109',
    location: 'Delhi, India',
    experience: '3 years',
    status: 'technical_interview',
    stage: 'Technical Interview',
    appliedDate: '2024-09-13',
    rating: 4.0,
    resume: 'priya_sharma_resume.pdf',
    interviews: [
      { type: 'HR Interview - Telephonic', status: 'completed', date: '2024-09-15', feedback: 'Good attitude' },
      { type: 'Technical Interview - Face to Face', status: 'scheduled', date: '2024-09-19', feedback: '' }
    ]
  },
  {
    id: 3,
    jobId: 2,
    name: 'Rahul Patel',
    email: 'rahul.patel@email.com',
    phone: '+91 76543 21098',
    location: 'Bengaluru, India',
    experience: '4 years',
    status: 'hr_interview',
    stage: 'HR Interview',
    appliedDate: '2024-09-16',
    rating: 3.8,
    resume: 'rahul_patel_resume.pdf',
    interviews: [
      { type: 'HR Interview - Telephonic', status: 'scheduled', date: '2024-09-20', feedback: '' }
    ]
  }
];

const WORKFLOW_STAGES = [
  { id: 'screening', name: 'Screening', icon: Users },
  { id: 'hr_interview', name: 'HR Interview', icon: Phone },
  { id: 'technical_interview', name: 'Technical Interview', icon: User },
  { id: 'ceo_interview', name: 'CEO Interview', icon: Star },
  { id: 'offer_stage', name: 'Offer Stage', icon: CheckCircle }
];

export default function RecruitmentATS() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState(DUMMY_JOBS);
  const [applicants, setApplicants] = useState(DUMMY_APPLICANTS);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);

  // Backend Integration Points - Uncomment and connect to your API
  useEffect(() => {
    // fetchJobs();
    // fetchApplicants();
  }, []);

  // const fetchJobs = async () => {
  //   try {
  //     const response = await api.get('/api/recruitment/jobs');
  //     setJobs(response.data);
  //   } catch (error) {
  //     console.error('Error fetching jobs:', error);
  //   }
  // };

  // const fetchApplicants = async () => {
  //   try {
  //     const response = await api.get('/api/recruitment/applicants');
  //     setApplicants(response.data);
  //   } catch (error) {
  //     console.error('Error fetching applicants:', error);
  //   }
  // };

  const createJob = async (jobData) => {
    // Backend call - uncomment when ready
    // try {
    //   const response = await api.post('/api/recruitment/jobs', jobData);
    //   setJobs([...jobs, response.data]);
    // } catch (error) {
    //   console.error('Error creating job:', error);
    // }
    
    // Dummy implementation
    const newJob = {
      id: jobs.length + 1,
      ...jobData,
      postedDate: new Date().toISOString().split('T')[0],
      applicants: 0,
      status: 'active'
    };
    setJobs([...jobs, newJob]);
    setShowJobForm(false);
  };

  const updateApplicantStatus = async (applicantId, newStatus) => {
    // Backend call - uncomment when ready
    // try {
    //   await api.put(`/api/recruitment/applicants/${applicantId}`, { status: newStatus });
    // } catch (error) {
    //   console.error('Error updating applicant status:', error);
    // }
    
    // Dummy implementation
    setApplicants(applicants.map(app => 
      app.id === applicantId 
        ? { ...app, status: newStatus, stage: WORKFLOW_STAGES.find(s => s.id === newStatus)?.name }
        : app
    ));
  };

  const scheduleInterview = async (applicantId, interviewData) => {
    // Backend call - uncomment when ready
    // try {
    //   await api.post(`/api/recruitment/applicants/${applicantId}/interviews`, interviewData);
    // } catch (error) {
    //   console.error('Error scheduling interview:', error);
    // }
    
    console.log('Interview scheduled:', interviewData);
    alert('Interview scheduled successfully!');
  };

  const sendOffer = async (applicantId, offerData) => {
    // Backend call - uncomment when ready
    // try {
    //   await api.post(`/api/recruitment/applicants/${applicantId}/offer`, offerData);
    // } catch (error) {
    //   console.error('Error sending offer:', error);
    // }
    
    console.log('Offer sent:', offerData);
    alert('Offer sent successfully!');
    setShowOfferForm(false);
  };

  const JobForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      description: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 max-h-96 overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">Post New Job</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Job Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
            <textarea
              placeholder="Job Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded h-20"
              required
            />
            <div className="flex space-x-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Post Job
              </button>
              <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const OfferForm = ({ applicant, onSubmit, onCancel }) => {
    const [offerData, setOfferData] = useState({
      position: applicant?.name ? `Senior HR Manager` : '',
      salary: '',
      startDate: '',
      benefits: 'Health Insurance, Retirement Plan, Flexible Hours'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(applicant.id, offerData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 max-h-96 overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">Send Offer to {applicant?.name}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Position Title"
              value={offerData.position}
              onChange={(e) => setOfferData({...offerData, position: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Salary Package"
              value={offerData.salary}
              onChange={(e) => setOfferData({...offerData, salary: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="date"
              placeholder="Start Date"
              value={offerData.startDate}
              onChange={(e) => setOfferData({...offerData, startDate: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Benefits & Perks"
              value={offerData.benefits}
              onChange={(e) => setOfferData({...offerData, benefits: e.target.value})}
              className="w-full p-2 border rounded h-20"
            />
            <div className="flex space-x-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center">
                <Send className="w-4 h-4 mr-2" />
                Send Offer
              </button>
              <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Recruitment & Onboarding System</h1>
      
      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'jobs' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-300'
          }`}
        >
          Job Postings
        </button>
        <button
          onClick={() => setActiveTab('applicants')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'applicants' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-300'
          }`}
        >
          Applicants
        </button>
        <button
          onClick={() => setActiveTab('workflow')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'workflow' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-300'
          }`}
        >
          Hiring Workflow
        </button>
      </div>

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Active Job Postings</h2>
            <button
              onClick={() => setShowJobForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </button>
          </div>

          <div className="grid gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{job.location}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{job.type}</span>
                      <span className={`px-2 py-1 rounded ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{job.description}</p>
                    <div className="text-sm text-gray-500">Posted: {job.postedDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{job.applicants}</div>
                    <div className="text-sm text-gray-600">Applicants</div>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="mt-2 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
                    >
                      View Applicants
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applicants Tab */}
      {activeTab === 'applicants' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">All Applicants</h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applicants.map((applicant) => {
                  const job = jobs.find(j => j.id === applicant.jobId);
                  return (
                    <tr key={applicant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                            {applicant.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
                            <div className="text-sm text-gray-500">{applicant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{job?.title}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          applicant.status === 'offer_stage' ? 'bg-green-100 text-green-800' :
                          applicant.status === 'technical_interview' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {applicant.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{applicant.appliedDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">{applicant.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedApplicant(applicant)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Workflow Tab */}
      {activeTab === 'workflow' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Hiring Workflow</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-8">
              {WORKFLOW_STAGES.map((stage, index) => {
                const Icon = stage.icon;
                return (
                  <div key={stage.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        index <= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="mt-2 text-sm font-medium text-gray-700">{stage.name}</span>
                    </div>
                    {index < WORKFLOW_STAGES.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 ${
                        index < 2 ? 'bg-blue-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Automated Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Automatic resume screening and ranking
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Interview scheduling with calendar integration
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Automated feedback collection
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Offer letter generation and tracking
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Stage Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Screening:</strong> Initial application review and basic qualification check
                  </div>
                  <div>
                    <strong>HR Interview:</strong> Cultural fit assessment and basic requirements validation
                  </div>
                  <div>
                    <strong>Technical Interview:</strong> Skills assessment and technical competency evaluation
                  </div>
                  <div>
                    <strong>CEO Interview:</strong> Final leadership assessment and strategic alignment
                  </div>
                  <div>
                    <strong>Offer Stage:</strong> Compensation negotiation and contract finalization
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedApplicant.name}</h3>
              <button onClick={() => setSelectedApplicant(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <div className="space-y-2 text-sm">
                  <div><strong>Email:</strong> {selectedApplicant.email}</div>
                  <div><strong>Phone:</strong> {selectedApplicant.phone}</div>
                  <div><strong>Location:</strong> {selectedApplicant.location}</div>
                  <div><strong>Experience:</strong> {selectedApplicant.experience}</div>
                  <div><strong>Applied:</strong> {selectedApplicant.appliedDate}</div>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{selectedApplicant.rating}/5.0</span>
                </div>
                <div className="text-sm">
                  <strong>Current Stage:</strong> {selectedApplicant.stage}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-3">Interview Progress</h4>
              <div className="space-y-2">
                {selectedApplicant.interviews.map((interview, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-sm">{interview.type}</div>
                      {interview.date && <div className="text-xs text-gray-600">Scheduled: {interview.date}</div>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                        interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {interview.status}
                      </span>
                      {interview.status === 'scheduled' && (
                        <button
                          onClick={() => scheduleInterview(selectedApplicant.id, interview)}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <select 
                value={selectedApplicant.status}
                onChange={(e) => updateApplicantStatus(selectedApplicant.id, e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="screening">Screening</option>
                <option value="hr_interview">HR Interview</option>
                <option value="technical_interview">Technical Interview</option>
                <option value="ceo_interview">CEO Interview</option>
                <option value="offer_stage">Offer Stage</option>
              </select>
              
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Schedule Interview
              </button>
              
              {selectedApplicant.status === 'offer_stage' && (
                <button
                  onClick={() => setShowOfferForm(true)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex items-center"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Send Offer
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Forms */}
      {showJobForm && <JobForm onSubmit={createJob} onCancel={() => setShowJobForm(false)} />}
      {showOfferForm && selectedApplicant && (
        <OfferForm 
          applicant={selectedApplicant} 
          onSubmit={sendOffer} 
          onCancel={() => setShowOfferForm(false)} 
        />
      )}
    </div>
  );
}