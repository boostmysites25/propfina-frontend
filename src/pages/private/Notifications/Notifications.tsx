import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sendNotificationApi, getAllNotificationsApi, deleteNotificationApi } from "../../../utils/api";
import { handleApiError } from "../../../utils/errorHandler";
import toast from "react-hot-toast";

const Notifications: React.FC = () => {
  const [notificationHeading, setNotificationHeading] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const queryClient = useQueryClient();

  // Fetch notifications from backend
  const { data: notificationsData, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await getAllNotificationsApi();
      return response.data;
    },
  });

  // Send notification mutation
  const sendMutation = useMutation({
    mutationFn: sendNotificationApi,
    onSuccess: () => {
      toast.success("Notification sent successfully!");
      setNotificationHeading("");
      setNotificationMessage("");
      // Refresh notifications list
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      handleApiError(error, "Failed to send notification");
    },
  });

  // Delete notification mutation
  const deleteMutation = useMutation({
    mutationFn: deleteNotificationApi,
    onSuccess: () => {
      toast.success("Notification deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      handleApiError(error, "Failed to delete notification");
    },
  });

  const handleSendNotification = () => {
    if (notificationHeading.trim() && notificationMessage.trim()) {
      sendMutation.mutate({
        heading: notificationHeading,
        message: notificationMessage,
      });
    } else {
      toast.error("Please fill in both heading and message");
    }
  };

  const handleDeleteNotification = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Get notifications from backend response
  const sentNotifications = notificationsData?.data || [];

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
      <div className="">
        {/* Send Notification Section */}
        <div className="">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-xl font-semibold text-gray-800">
              Send Notification
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Send notifications to all users in the system
            </p>
          </div>

          <div className="p-6 space-y-6">
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
                onClick={handleSendNotification}
                disabled={sendMutation.isPending}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 ease-in-out cursor-pointer whitespace-nowrap !rounded-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2 text-sm"></i>
                    Send Notification
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sent Notifications Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">
              Sent Notifications
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
                <div>
                  <h3 className="font-medium text-gray-800">
                    {notification.heading}
                  </h3>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Sent by {notification.createdBy || 'admin'} • {
                      (() => {
                        try {
                          // Handle Firestore Timestamp objects
                          if (notification.createdAt?._seconds) {
                            return new Date(notification.createdAt._seconds * 1000).toLocaleString();
                          }
                          // Handle regular date strings/objects
                          const date = new Date(notification.createdAt);
                          return date.toLocaleString();
                        } catch (error) {
                          return 'Invalid Date';
                        }
                      })()
                    }
                    {notification.sent && <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Delivered</span>}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer whitespace-nowrap !rounded-button"
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
