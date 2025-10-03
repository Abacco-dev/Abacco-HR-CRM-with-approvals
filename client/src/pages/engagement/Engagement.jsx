import { useEffect, useState, useReducer } from "react";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Award,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";

/* ================== BACKEND API SERVICE (COMMENTED OUT) ================== 
class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
    this.token = localStorage.getItem("authToken");
  }

  setAuthToken(token) {
    this.token = token;
    localStorage.setItem("authToken", token);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Request failed");
      return data;
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  login(credentials) {
    return this.request("/auth/login", { method: "POST", body: credentials });
  }

  register(userData) {
    return this.request("/auth/register", { method: "POST", body: userData });
  }

  getSurveys(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(
      `/engagement/surveys${queryParams ? `?${queryParams}` : ""}`
    );
  }

  createSurvey(surveyData) {
    return this.request("/engagement/surveys", {
      method: "POST",
      body: surveyData,
    });
  }

  submitSurveyResponse(surveyId, responses) {
    return this.request(`/engagement/surveys/${surveyId}/responses`, {
      method: "POST",
      body: { responses },
    });
  }

  getRecognitions(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(
      `/engagement/recognitions${queryParams ? `?${queryParams}` : ""}`
    );
  }

  sendRecognition(recognitionData) {
    return this.request("/engagement/recognitions", {
      method: "POST",
      body: recognitionData,
    });
  }

  getSuggestions(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(
      `/engagement/suggestions${queryParams ? `?${queryParams}` : ""}`
    );
  }

  createSuggestion(suggestionData) {
    return this.request("/engagement/suggestions", {
      method: "POST",
      body: suggestionData,
    });
  }

  voteSuggestion(suggestionId, vote) {
    return this.request(`/engagement/suggestions/${suggestionId}/vote`, {
      method: "POST",
      body: { vote },
    });
  }

  getDashboardStats() {
    return this.request("/engagement/dashboard/stats");
  }

  getEmployees() {
    return this.request("/users");
  }
}

const apiService = new ApiService();
========================================================================= */

// ================== DUMMY DATA ==================
const dummyData = {
  user: {
    id: "current-user",
    name: "John Smith",
    email: "john.smith@company.com",
    department: "Engineering",
    role: "employee",
    points: 245,
    avatar: "JS",
  },
  surveys: [
    {
      id: 1,
      title: "Q4 Employee Satisfaction Survey",
      description: "Help us understand your experience this quarter",
      questions: [
        {
          id: "q1",
          text: "How satisfied are you with your current role?",
          type: "rating",
          required: true,
        },
        {
          id: "q2",
          text: "How would you rate work-life balance?",
          type: "rating",
          required: true,
        },
        {
          id: "q3",
          text: "How likely are you to recommend our company?",
          type: "rating",
          required: true,
        },
      ],
      status: "active",
      responses: 45,
      totalEmployees: 120,
      responseRate: 37.5,
      createdAt: "2024-01-15",
      endDate: "2024-01-30",
      createdBy: { name: "HR Team" },
    },
  ],
  recognitions: [
    {
      id: 1,
      from: { id: 1, name: "Sarah Johnson", avatar: "SJ" },
      to: { id: 2, name: "Mike Chen", avatar: "MC" },
      message:
        "Excellent work on the new feature implementation! Your attention to detail made all the difference.",
      points: 75,
      type: "excellence",
      isPublic: true,
      createdAt: "2024-01-18T10:30:00Z",
    },
  ],
  suggestions: [
    {
      id: 1,
      author: { name: "Anonymous", department: "Engineering" },
      title: "Flexible Working Hours",
      description:
        "Could we implement more flexible working hours to improve work-life balance?",
      category: "work-life-balance",
      votes: 23,
      status: "under-review",
      priority: "medium",
      createdAt: "2024-01-15T11:00:00Z",
    },
  ],
  employees: [
    { id: 1, name: "Sarah Johnson", department: "Marketing", avatar: "SJ" },
    { id: 2, name: "Mike Chen", department: "Engineering", avatar: "MC" },
  ],
  dashboardStats: {
    activeSurveys: 2,
    totalRecognitions: 3,
    totalSuggestions: 3,
    engagementRate: 78,
  },
};

// ================== REDUCER ==================
const engagementReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_SURVEYS":
      return { ...state, surveys: action.payload, loading: false };
    case "SET_RECOGNITIONS":
      return { ...state, recognitions: action.payload, loading: false };
    case "SET_SUGGESTIONS":
      return { ...state, suggestions: action.payload, loading: false };
    case "SET_EMPLOYEES":
      return { ...state, employees: action.payload };
    case "SET_DASHBOARD_STATS":
      return { ...state, dashboardStats: action.payload };
    case "ADD_RECOGNITION":
      return {
        ...state,
        recognitions: [action.payload, ...state.recognitions],
        dashboardStats: {
          ...state.dashboardStats,
          totalRecognitions: state.dashboardStats.totalRecognitions + 1,
        },
      };
    case "ADD_SUGGESTION":
      return {
        ...state,
        suggestions: [action.payload, ...state.suggestions],
        dashboardStats: {
          ...state.dashboardStats,
          totalSuggestions: state.dashboardStats.totalSuggestions + 1,
        },
      };
    case "UPDATE_SUGGESTION_VOTE":
      return {
        ...state,
        suggestions: state.suggestions.map((s) =>
          s.id === action.payload.id
            ? { ...s, votes: action.payload.newVoteCount }
            : s
        ),
      };
    case "SET_USER":
      return { ...state, currentUser: action.payload };
    default:
      return state;
  }
};

const initialState = {
  surveys: [],
  recognitions: [],
  suggestions: [],
  employees: [],
  dashboardStats: {},
  currentUser: null,
  loading: false,
  error: null,
};

// ================== MAIN COMPONENT ==================
export default function Engagement() {
  const [state, dispatch] = useReducer(engagementReducer, initialState);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [votedSuggestions, setVotedSuggestions] = useState(new Set());

  // Load dummy data instead of backend
  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: "SET_DASHBOARD_STATS", payload: dummyData.dashboardStats });
      dispatch({ type: "SET_SURVEYS", payload: dummyData.surveys });
      dispatch({ type: "SET_RECOGNITIONS", payload: dummyData.recognitions });
      dispatch({ type: "SET_SUGGESTIONS", payload: dummyData.suggestions });
      dispatch({ type: "SET_EMPLOYEES", payload: dummyData.employees });
      dispatch({ type: "SET_USER", payload: dummyData.user });
      dispatch({ type: "SET_LOADING", payload: false });
    }, 500);
  }, []);

  // Helpers
  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      "under-review": "bg-orange-100 text-orange-800",
      pending: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type) => {
    const icons = {
      excellence: <Star className="w-4 h-4 text-yellow-500" />,
      creativity: <Award className="w-4 h-4 text-purple-500" />,
      teamwork: <Users className="w-4 h-4 text-blue-500" />,
      leadership: <Target className="w-4 h-4 text-green-500" />,
    };
    return icons[type] || <ThumbsUp className="w-4 h-4 text-green-500" />;
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / (1000 * 60 * 60));
    if (diff < 1) return "Just now";
    if (diff < 24) return `${diff}h ago`;
    const days = Math.floor(diff / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // ========== RENDER ==========
  if (state.loading)
    return <p className="text-center p-8">Loading engagement data...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Engagement</h1>
          <p className="text-gray-600">
            Welcome back, {state.currentUser?.name || "User"}!
          </p>
        </div>
        {/* Tabs */}
        <div className="mt-4 lg:mt-0">
          <nav className="flex gap-2">
            {[
              { key: "dashboard", label: "Dashboard", icon: TrendingUp },
              { key: "surveys", label: "Surveys", icon: MessageSquare },
              { key: "recognition", label: "Recognition", icon: Award },
              { key: "suggestions", label: "Suggestions", icon: Target },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-lg ${
                  activeTab === key
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Dashboard */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border p-6">
              <p>Active Surveys</p>
              <p className="text-2xl font-bold">
                {state.dashboardStats.activeSurveys}
              </p>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <p>Recognitions</p>
              <p className="text-2xl font-bold">
                {state.dashboardStats.totalRecognitions}
              </p>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <p>Suggestions</p>
              <p className="text-2xl font-bold">
                {state.dashboardStats.totalSuggestions}
              </p>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <p>Engagement Rate</p>
              <p className="text-2xl font-bold">
                {state.dashboardStats.engagementRate}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recognitions */}
            <div className="lg:col-span-2 bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">
                Recent Recognitions
              </h3>
              <div className="space-y-4">
                {state.recognitions.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                  >
                    {getTypeIcon(rec.type)}
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{rec.from.name}</span>{" "}
                        recognized{" "}
                        <span className="font-medium">{rec.to.name}</span>
                      </p>
                      <p className="text-sm text-gray-600">{rec.message}</p>
                      <p className="text-xs text-gray-400">
                        {formatTimeAgo(rec.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Top Suggestions</h3>
              <div className="space-y-4">
                {state.suggestions.map((sug) => (
                  <div
                    key={sug.id}
                    className="p-4 bg-gray-50 rounded-lg space-y-2"
                  >
                    <p className="text-sm font-medium">{sug.title}</p>
                    <p className="text-xs text-gray-500">by {sug.author.name}</p>
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-xs px-2 py-1 rounded ${getStatusColor(
                          sug.status
                        )}`}
                      >
                        {sug.status}
                      </span>
                      <button
                        disabled={votedSuggestions.has(sug.id)}
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_SUGGESTION_VOTE",
                            payload: { id: sug.id, newVoteCount: sug.votes + 1 },
                          })
                        }
                        className={`flex items-center space-x-1 text-sm ${
                          votedSuggestions.has(sug.id)
                            ? "text-gray-400"
                            : "text-blue-600"
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{sug.votes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
