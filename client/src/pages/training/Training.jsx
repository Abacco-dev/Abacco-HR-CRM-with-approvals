import { useEffect, useState } from 'react';

// Mock hooks for development - replace with your actual hooks later
const useAuth = () => ({
  api: {
    get: () => Promise.resolve({ data: [] }),
    post: () => Promise.resolve({ data: {} })
  },
  user: { role: 'ADMIN', id: 1, name: 'John Doe' } // Change to 'USER' to test non-admin flow
});

const useApproval = () => ({
  request: (type, resource, data) => Promise.resolve({ success: true })
});

// Dummy data for development
const DUMMY_TRAININGS = [
  {
    id: 1,
    title: 'React Fundamentals',
    description: 'Learn the basics of React including components, hooks, and state management',
    duration: '4 weeks',
    level: 'Beginner',
    instructor: 'Sarah Johnson',
    enrolledCount: 24,
    maxCapacity: 30,
    startDate: '2024-10-15',
    endDate: '2024-11-12',
    status: 'ACTIVE',
    category: 'Technical',
    skills: ['React', 'JavaScript', 'Frontend Development'],
    isEnrolled: false,
    progress: 0,
    completionRate: 85
  },
  {
    id: 2,
    title: 'Leadership Excellence',
    description: 'Develop essential leadership skills for managing teams and driving results',
    duration: '6 weeks',
    level: 'Intermediate',
    instructor: 'Michael Chen',
    enrolledCount: 18,
    maxCapacity: 25,
    startDate: '2024-11-01',
    endDate: '2024-12-13',
    status: 'UPCOMING',
    category: 'Management',
    skills: ['Leadership', 'Team Management', 'Communication'],
    isEnrolled: true,
    progress: 0,
    completionRate: 92
  },
  {
    id: 3,
    title: 'Data Analytics with Python',
    description: 'Master data analysis techniques using Python, pandas, and visualization libraries',
    duration: '8 weeks',
    level: 'Advanced',
    instructor: 'Dr. Emily Rodriguez',
    enrolledCount: 15,
    maxCapacity: 20,
    startDate: '2024-10-22',
    endDate: '2024-12-17',
    status: 'ACTIVE',
    category: 'Technical',
    skills: ['Python', 'Data Analysis', 'Pandas', 'Matplotlib'],
    isEnrolled: false,
    progress: 0,
    completionRate: 78
  },
  {
    id: 4,
    title: 'Project Management Certification',
    description: 'Comprehensive PMP certification preparation course',
    duration: '12 weeks',
    level: 'Professional',
    instructor: 'Robert Kim',
    enrolledCount: 12,
    maxCapacity: 15,
    startDate: '2024-11-15',
    endDate: '2025-02-07',
    status: 'UPCOMING',
    category: 'Management',
    skills: ['Project Management', 'PMP', 'Agile', 'Scrum'],
    isEnrolled: false,
    progress: 0,
    completionRate: 95
  },
  {
    id: 5,
    title: 'Cloud Security Fundamentals',
    description: 'Learn essential cloud security practices and compliance requirements',
    duration: '5 weeks',
    level: 'Intermediate',
    instructor: 'Lisa Wang',
    enrolledCount: 8,
    maxCapacity: 25,
    startDate: '2024-09-01',
    endDate: '2024-10-06',
    status: 'COMPLETED',
    category: 'Security',
    skills: ['Cloud Security', 'AWS', 'Compliance', 'Risk Management'],
    isEnrolled: true,
    progress: 100,
    completionRate: 88
  },
  {
    id: 6,
    title: 'UI/UX Design Principles',
    description: 'Master the fundamentals of user interface and user experience design',
    duration: '6 weeks',
    level: 'Beginner',
    instructor: 'Amanda Foster',
    enrolledCount: 22,
    maxCapacity: 30,
    startDate: '2024-10-08',
    endDate: '2024-11-19',
    status: 'ACTIVE',
    category: 'Design',
    skills: ['UI Design', 'UX Research', 'Figma', 'Prototyping'],
    isEnrolled: true,
    progress: 65,
    completionRate: 91
  }
];

export default function Training() {
  const { api, user } = useAuth();
  const { request } = useApproval();

  // State management
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);

  const [newTraining, setNewTraining] = useState({
    title: '',
    description: '',
    duration: '',
    level: 'Beginner',
    instructor: '',
    maxCapacity: 20,
    startDate: '',
    endDate: '',
    category: 'Technical',
    skills: []
  });

  // Initialize data (simulating API call)
  useEffect(() => {
    const loadTrainings = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTrainings(DUMMY_TRAININGS);
      } catch (error) {
        console.error('Failed to load trainings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrainings();
  }, []);

  // Filter and search trainings
  const filteredTrainings = trainings
    .filter(training => {
      if (filter === 'enrolled') return training.isEnrolled;
      if (filter === 'available') return !training.isEnrolled && training.status !== 'COMPLETED';
      if (filter === 'completed') return training.status === 'COMPLETED';
      return true;
    })
    .filter(training =>
      training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'startDate':
          return new Date(a.startDate) - new Date(b.startDate);
        case 'level':
          const levels = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Professional': 4 };
          return levels[a.level] - levels[b.level];
        default:
          return 0;
      }
    });

  // Create new training
 const handleCreateTraining = async () => {
  try {
    if (user.role === "EMPLOYEE") {
      alert("Employees are not allowed to create training programs.");
      return;
    }

    if (user.role === "ADMIN") {
      const id = Math.max(...trainings.map(t => t.id)) + 1;
      const training = {
        ...newTraining,
        id,
        enrolledCount: 0,
        status: "UPCOMING",
        skills: newTraining.skills.filter(skill => skill.trim()),
        isEnrolled: false,
        progress: 0,
        completionRate: 0
      };

      setTrainings(prev => [...prev, training]);
      alert("Training created successfully!");
    } else {
      await request("CREATE_TRAINING", "training", newTraining);
      alert("Training creation request submitted for approval!");
    }

    setShowCreateModal(false);
    setNewTraining({
      title: "",
      description: "",
      duration: "",
      level: "Beginner",
      instructor: "",
      maxCapacity: 20,
      startDate: "",
      endDate: "",
      category: "Technical",
      skills: []
    });
  } catch (error) {
    console.error("Failed to create training:", error);
    alert("Failed to create training. Please try again.");
  }
};


  // Enroll in training
  const handleEnroll = async (trainingId) => {
    try {
      setTrainings(prev =>
        prev.map(training =>
          training.id === trainingId
            ? { ...training, isEnrolled: true, enrolledCount: training.enrolledCount + 1 }
            : training
        )
      );
      alert('Successfully enrolled in training!');
    } catch (error) {
      console.error('Failed to enroll:', error);
      alert('Failed to enroll. Please try again.');
    }
  };

  // Unenroll from training
  const handleUnenroll = async (trainingId) => {
    try {
      setTrainings(prev =>
        prev.map(training =>
          training.id === trainingId
            ? { ...training, isEnrolled: false, enrolledCount: Math.max(0, training.enrolledCount - 1), progress: 0 }
            : training
        )
      );
      alert('Successfully unenrolled from training!');
    } catch (error) {
      console.error('Failed to unenroll:', error);
      alert('Failed to unenroll. Please try again.');
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'UPCOMING': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get level badge color
  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-orange-100 text-orange-700';
      case 'Professional': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-64">
  //       <div className="text-lg">Loading trainings...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Training & Development</h1>
        {user && (user.role === "ADMIN" || user.role === "MANAGER") && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create Training
          </button>
        )}


      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Search trainings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Trainings</option>
            <option value="available">Available</option>
            <option value="enrolled">My Enrollments</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="title">Sort by Title</option>
            <option value="startDate">Sort by Start Date</option>
            <option value="level">Sort by Level</option>
          </select>
        </div>
      </div>

      {/* Training Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{trainings.length}</div>
          <div className="text-gray-600">Total Trainings</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">
            {trainings.filter(t => t.isEnrolled).length}
          </div>
          <div className="text-gray-600">My Enrollments</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-orange-600">
            {trainings.filter(t => t.isEnrolled && t.progress > 0).length}
          </div>
          <div className="text-gray-600">In Progress</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">
            {trainings.filter(t => t.isEnrolled && t.progress === 100).length}
          </div>
          <div className="text-gray-600">Completed</div>
        </div>
      </div>

      {/* Training List */}
      <div className="space-y-4">
        {filteredTrainings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No trainings found matching your criteria.
          </div>
        ) : (
          filteredTrainings.map((training) => (
            <div key={training.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{training.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(training.status)}`}>
                      {training.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(training.level)}`}>
                      {training.level}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">{training.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-3">
                    <div>
                      <span className="font-medium">Instructor:</span> {training.instructor}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {training.duration}
                    </div>
                    <div>
                      <span className="font-medium">Capacity:</span> {training.enrolledCount}/{training.maxCapacity}
                    </div>
                    <div>
                      <span className="font-medium">Start Date:</span> {new Date(training.startDate).toLocaleDateString()}
                    </div>
                  </div>

                  {training.isEnrolled && training.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{training.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${training.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {training.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {training.isEnrolled ? (
                    <>
                      <button
                        onClick={() => setSelectedTraining(training)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        View Progress
                      </button>
                      <button
                        onClick={() => handleUnenroll(training.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        Unenroll
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEnroll(training.id)}
                      disabled={training.enrolledCount >= training.maxCapacity || training.status === 'COMPLETED'}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors text-sm disabled:cursor-not-allowed"
                    >
                      {training.enrolledCount >= training.maxCapacity ? 'Full' : 'Enroll'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Training Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Create New Training</h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Training Title"
                  value={newTraining.title}
                  onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                  placeholder="Description"
                  value={newTraining.description}
                  onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Duration (e.g., 4 weeks)"
                    value={newTraining.duration}
                    onChange={(e) => setNewTraining({ ...newTraining, duration: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <select
                    value={newTraining.level}
                    onChange={(e) => setNewTraining({ ...newTraining, level: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Instructor Name"
                  value={newTraining.instructor}
                  onChange={(e) => setNewTraining({ ...newTraining, instructor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={newTraining.startDate}
                    onChange={(e) => setNewTraining({ ...newTraining, startDate: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="number"
                    placeholder="Max Capacity"
                    value={newTraining.maxCapacity}
                    onChange={(e) => setNewTraining({ ...newTraining, maxCapacity: parseInt(e.target.value) || 20 })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTraining}
                  disabled={!newTraining.title || !newTraining.instructor}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training Details Modal */}
      {selectedTraining && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">{selectedTraining.title} - Progress</h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Overall Progress</span>
                    <span>{selectedTraining.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${selectedTraining.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Start Date:</span><br />
                    {new Date(selectedTraining.startDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">End Date:</span><br />
                    {new Date(selectedTraining.endDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span><br />
                    {selectedTraining.duration}
                  </div>
                  <div>
                    <span className="font-medium">Completion Rate:</span><br />
                    {selectedTraining.completionRate}%
                  </div>
                </div>

                <div>
                  <span className="font-medium text-sm">Skills You'll Learn:</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedTraining.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedTraining(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}