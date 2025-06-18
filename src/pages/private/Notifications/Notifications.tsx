import React, { useState } from "react";

const Notifications: React.FC = () => {
  const [notificationHeading, setNotificationHeading] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [sentNotifications, setSentNotifications] = useState([
    {
      id: 1,
      heading: "hello",
      message: "test",
      sender: "admin",
      timestamp: "Jun 6, 2025 2:39 PM",
    },
  ]);

  const handleSendNotification = () => {
    if (notificationHeading.trim() && notificationMessage.trim()) {
      const newNotification = {
        id: Date.now(),
        heading: notificationHeading,
        message: notificationMessage,
        sender: "admin",
        timestamp: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };

      setSentNotifications([newNotification, ...sentNotifications]);
      setNotificationHeading("");
      setNotificationMessage("");
    }
  };

  const handleDeleteNotification = (id: number) => {
    setSentNotifications(
      sentNotifications.filter((notification) => notification.id !== id),
    );
  };

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
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 ease-in-out cursor-pointer whitespace-nowrap !rounded-button"
              >
                <i className="fas fa-paper-plane mr-2 text-sm"></i>
                Send Notification
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
                    Sent by {notification.sender} • {notification.timestamp}
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
