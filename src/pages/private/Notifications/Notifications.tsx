import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendNotificationApi,
  sendEmailNotificationApi,
  testEmailApi,
  getAllNotificationsApi,
  deleteNotificationApi
} from "../../../utils/api";
import { handleApiError } from "../../../utils/errorHandler";
import toast from "react-hot-toast";

type TabType = 'push' | 'email';

type NotificationType = {
  id: string;
  heading?: string;
  subject?: string;
  message: string;
  createdAt?: string | { _seconds: number };
  type?: string;
  sentCount?: number;
  failedCount?: number;
  createdBy?: string;
};

interface NotificationsResponse {
  data: NotificationType[];
}

interface PushNotificationPayload {
  heading: string;
  message: string;
}

interface EmailNotificationPayload {
  subject: string;
  message: string;
}

interface TestEmailPayload {
  email: string;
}

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('push');

  // Push notification state
  const [notificationHeading, setNotificationHeading] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  // Email notification state
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [testEmail, setTestEmail] = useState("");

  const queryClient = useQueryClient();

  // Fetch notifications from backend
  const { data: notificationsData, isLoading, error } = useQuery<NotificationsResponse, unknown>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await getAllNotificationsApi();
      return response.data;
    },
  });

  // Send push notification mutation
  const sendPushMutation = useMutation<{ data?: unknown }, unknown, PushNotificationPayload>({
    mutationFn: sendNotificationApi,
    onSuccess: () => {
      toast.success("Push notification sent successfully!");
      setNotificationHeading("");
      setNotificationMessage("");
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to send push notification");
    },
  });

  // Send email notification mutation
  const sendEmailMutation = useMutation<{ data: { details?: { sentCount?: number; failedCount?: number } } }, unknown, EmailNotificationPayload>({
    mutationFn: sendEmailNotificationApi,
    onSuccess: (response) => {
      const details = response.data.details;
      toast.success(`Email notifications sent! ${details?.sentCount || 0} sent, ${details?.failedCount || 0} failed`);
      setEmailSubject("");
      setEmailMessage("");
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to send email notifications");
    },
  });

  // Test email mutation
  const testEmailMutation = useMutation<void, unknown, TestEmailPayload>({
    mutationFn: async (data: TestEmailPayload) => {
      await testEmailApi(data);
    },
    onSuccess: () => {
      toast.success("Test email sent successfully!");
      setTestEmail("");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to send test email");
    },
  });

  // Delete notification mutation
  const deleteMutation = useMutation<unknown, unknown, string>({
    mutationFn: deleteNotificationApi,
    onSuccess: () => {
      toast.success("Notification deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: unknown) => {
      handleApiError(error, "Failed to delete notification");
    },
  });

  const handleSendPushNotification = () => {
    if (notificationHeading.trim() && notificationMessage.trim()) {
      sendPushMutation.mutate({
        heading: notificationHeading,
        message: notificationMessage,
      });
    } else {
      toast.error("Please fill in both heading and message");
    }
  };

  const handleSendEmailNotification = () => {
    if (emailSubject.trim() && emailMessage.trim()) {
      sendEmailMutation.mutate({
        subject: emailSubject,
        message: emailMessage,
      });
    } else {
      toast.error("Please fill in both subject and message");
    }
  };

  const handleTestEmail = () => {
    if (testEmail.trim() && testEmail.includes('@')) {
      testEmailMutation.mutate({
        email: testEmail,
      });
    } else {
      toast.error("Please enter a valid email address");
    }
  };

  const handleDeleteNotification = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Get notifications from backend response
  const sentNotifications: NotificationType[] = notificationsData?.data || [];

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-red-600">Error loading notifications. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Send push notifications and emails to your users</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('push')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'push'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <i className="fas fa-bell mr-2"></i>
                Website Push Notifications
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'email'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <i className="fas fa-envelope mr-2"></i>
                Email Notifications
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'push' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Send Push Notification
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Send browser push notifications to all users who have enabled notifications
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="notification-heading"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Notification Heading
                  </label>
                  <input
                    id="notification-heading"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter notification heading"
                    value={notificationHeading}
                    onChange={(e) => setNotificationHeading(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="notification-message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Notification Message
                  </label>
                  <textarea
                    id="notification-message"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-32 resize-none"
                    placeholder="Enter notification message"
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                  />
                </div>

                <div>
                  <button
                    onClick={handleSendPushNotification}
                    disabled={sendPushMutation.isPending}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 ease-in-out cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendPushMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-bell mr-2 text-sm"></i>
                        Send Push Notification
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Send Email Notification
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Send email notifications to all registered users
                  </p>
                </div>

                {/* Test Email Section */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">
                    <i className="fas fa-flask mr-2"></i>
                    Test Email First
                  </h3>
                  <p className="text-yellow-700 text-sm mb-3">
                    Test your email setup before sending to all users
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      className="flex-1 px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      placeholder="Enter your email to test"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                    <button
                      onClick={handleTestEmail}
                      disabled={testEmailMutation.isPending}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm disabled:opacity-50"
                    >
                      {testEmailMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        'Test Email'
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email-subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Subject
                  </label>
                  <input
                    id="email-subject"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter email subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email-message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Message
                  </label>
                  <textarea
                    id="email-message"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-40 resize-none"
                    placeholder="Enter email message content"
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be formatted as HTML email with PropInfinia branding
                  </p>
                </div>

                <div>
                  <button
                    onClick={handleSendEmailNotification}
                    disabled={sendEmailMutation.isPending}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 ease-in-out cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendEmailMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Sending Emails...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-envelope mr-2 text-sm"></i>
                        Send Email to All Users
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sent Notifications Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">
              Notification History
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              History of all notifications sent to users
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {sentNotifications.map((notification) => (
              <div
                key={notification.id}
                className="p-6 flex justify-between items-start hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-800">
                      {notification.heading || notification.subject}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${notification.subject
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                      }`}>
                      {notification.subject ? 'Email' : 'Push'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{notification.message}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Sent by {notification.createdBy || 'admin'}</span>
                    <span>•</span>
                    <span>
                      {(() => {
                        try {
                          if (
                            notification.createdAt &&
                            typeof notification.createdAt === "object" &&
                            "_seconds" in notification.createdAt
                          ) {
                            return new Date((notification.createdAt as { _seconds: number })._seconds * 1000).toLocaleString();
                          }
                          return new Date(notification.createdAt as string).toLocaleString();
                        } catch {
                          return 'Invalid Date';
                        }
                      })()}
                    </span>
                    {notification.sentCount && (
                      <>
                        <span>•</span>
                        <span className="text-green-600">
                          {notification.sentCount} sent
                        </span>
                      </>
                    )}
                    {notification.failedCount && notification.failedCount > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-red-600">
                          {notification.failedCount} failed
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteNotification(notification.id)}
                  disabled={deleteMutation.isPending}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer whitespace-nowrap ml-4 disabled:opacity-50"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            ))}

            {sentNotifications.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No notifications have been sent yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
