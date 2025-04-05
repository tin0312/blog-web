import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/AuthProvider";

function NotificationWindow() {
  const [notifications, setNotifications] = useState([]);
  // fetch un_read notifications from notifications
  useEffect(() => {
    async function getNotifications() {
      try {
        const result = await fetch("/api/posts/notifications?content=true");
        const data = await result.json();
        setNotifications(data);
      } catch (error) {
        console.log("Error retrieving notification data")
      }
    }
    getNotifications()
  }, [])

  return (
    <div className="user-drop-down">
      <p className="fw-bold h5 mb-4">Notification</p>
      <ul>
        {
          notifications.length === 0 ? (
            <li>N/A</li>
          ) :
            (
              notifications.map((notification, index) => <li key={index} className={notification.is_read ? "" : "unread mb-2"}>{notification.message}</li>)
            )
        }
      </ul>
    </div>
  );
}

export default NotificationWindow;
