import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Calendar,
  Mail,
  Users,
  DollarSign,
  Smartphone,
  Settings,
  Plus,
  X,
} from "lucide-react";

export default function Automation() {
  const [integrations, setIntegrations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("integrations");

  // Dummy data
  const dummyIntegrations = [
    {
      id: 1,
      name: "Gmail Integration",
      type: "email",
      status: "connected",
      icon: Mail,
      description: "Sync email notifications and calendar events",
      lastSync: "2024-09-18T10:30:00Z",
      apiEndpoint: "/api/integrations/gmail",
    },
    {
      id: 2,
      name: "Google Calendar",
      type: "calendar",
      status: "connected",
      icon: Calendar,
      description: "Automatic leave calendar synchronization",
      lastSync: "2024-09-18T09:15:00Z",
      apiEndpoint: "/api/integrations/calendar",
    },
    {
      id: 3,
      name: "Payroll System",
      type: "payroll",
      status: "pending",
      icon: DollarSign,
      description: "Integrate with existing payroll software",
      lastSync: null,
      apiEndpoint: "/api/integrations/payroll",
    },
    {
      id: 4,
      name: "HR Management System",
      type: "hr",
      status: "connected",
      icon: Users,
      description: "Employee data synchronization",
      lastSync: "2024-09-18T08:00:00Z",
      apiEndpoint: "/api/integrations/hr",
    },
  ];

  const dummyAlerts = [
    {
      id: 1,
      type: "leave_request",
      message: "New leave request from John Doe",
      priority: "medium",
      timestamp: "2024-09-18T11:00:00Z",
      isRead: false,
      recipient: "manager",
    },
    {
      id: 2,
      type: "approval_needed",
      message: "Leave approval needed for Jane Smith",
      priority: "high",
      timestamp: "2024-09-18T10:45:00Z",
      isRead: false,
      recipient: "hr",
    },
    {
      id: 3,
      type: "system",
      message: "Payroll integration sync completed",
      priority: "low",
      timestamp: "2024-09-18T09:30:00Z",
      isRead: true,
      recipient: "admin",
    },
  ];

  const dummyNotifications = [
    {
      id: 1,
      title: "Email Notifications",
      description: "Send email alerts for leave requests and approvals",
      enabled: true,
      type: "email",
      recipients: ["managers", "hr"],
    },
    {
      id: 2,
      title: "Mobile Push Notifications",
      description: "Real-time notifications on mobile devices",
      enabled: true,
      type: "push",
      recipients: ["employees", "managers"],
    },
    {
      id: 3,
      title: "Calendar Sync Alerts",
      description: "Notify when leave is added to calendar",
      enabled: false,
      type: "calendar",
      recipients: ["employees"],
    },
  ];

  // API service (replace with actual API calls)
  const apiService = {
    fetchIntegrations: async () =>
      new Promise((resolve) => setTimeout(() => resolve(dummyIntegrations), 500)),

    fetchAlerts: async () =>
      new Promise((resolve) => setTimeout(() => resolve(dummyAlerts), 500)),

    fetchNotifications: async () =>
      new Promise((resolve) => setTimeout(() => resolve(dummyNotifications), 500)),

    toggleIntegration: async (id, status) =>
      new Promise((resolve) => setTimeout(() => resolve({ success: true }), 300)),

    toggleNotification: async (id, enabled) =>
      new Promise((resolve) => setTimeout(() => resolve({ success: true }), 300)),
  };

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [integrationsData, alertsData, notificationsData] = await Promise.all([
          apiService.fetchIntegrations(),
          apiService.fetchAlerts(),
          apiService.fetchNotifications(),
        ]);
        setIntegrations(integrationsData);
        setAlerts(alertsData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleToggleIntegration = async (id) => {
    const integration = integrations.find((i) => i.id === id);
    const newStatus = integration.status === "connected" ? "disconnected" : "connected";
    const result = await apiService.toggleIntegration(id, newStatus);
    if (result.success) {
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );
    }
  };

  const handleToggleNotification = async (id) => {
    const notification = notifications.find((n) => n.id === id);
    const newEnabled = !notification.enabled;
    const result = await apiService.toggleNotification(id, newEnabled);
    if (result.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, enabled: newEnabled } : n))
      );
    }
  };

  // Convert to Indian format
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "connected":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "disconnected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50";
      case "low":
        return "border-l-blue-500 bg-blue-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading integrations...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Integration & Automation
        </h1>
        <p className="text-gray-600">
          Connect with enterprise software and manage automated notifications
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 border-b">
          {[
            { id: "integrations", label: "Integrations", icon: Settings },
            { id: "alerts", label: "Alerts", icon: AlertCircle },
            { id: "notifications", label: "Notifications", icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Integrations */}
      {activeTab === "integrations" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold">Connected Integrations</h2>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-fit">
              <Plus size={16} />
              Add Integration
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <div
                  key={integration.id}
                  className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {integration.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        integration.status
                      )}`}
                    >
                      {integration.status}
                    </span>
                  </div>

                  {integration.lastSync && (
                    <p className="text-xs text-gray-500 mb-3">
                      Last sync: {formatTimestamp(integration.lastSync)}
                    </p>
                  )}

                  <button
                    onClick={() => handleToggleIntegration(integration.id)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      integration.status === "connected"
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    }`}
                  >
                    {integration.status === "connected"
                      ? "Disconnect"
                      : "Connect"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Alerts */}
      {activeTab === "alerts" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 p-4 rounded-r-lg ${getPriorityColor(
                  alert.priority
                )}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Bell size={16} className="text-gray-600" />
                      <span className="font-medium text-gray-900">
                        {alert.message}
                      </span>
                      {!alert.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                      <span>Type: {alert.type.replace("_", " ")}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Priority: {alert.priority}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Recipient: {alert.recipient}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(alert.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {alerts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No alerts at the moment
            </div>
          )}
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Notification Settings</h2>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white border rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {notification.recipients.map((recipient, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {recipient}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleNotification(notification.id)}
                    className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notification.enabled ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notification.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Notice */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800">
          <Smartphone size={20} />
          <span className="font-medium">Mobile Optimized</span>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          This interface is fully responsive and mobile-friendly. Test it on
          different screen sizes!
        </p>
      </div>
    </div>
  );
}
