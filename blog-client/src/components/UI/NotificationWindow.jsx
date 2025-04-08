import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";

function NotificationWindow() {
  const [notifications, setNotifications] = useState([]);
  const { setBadgeCount } = useAuth();
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
  async function handleReadNotification(notificationId) {
    try {
      const response = await fetch(`/api/posts/notifications/${notificationId}?isRead=true`, {
        method: "PATCH"
      });
      if (response.status === 200) {
        setNotifications(prevNotifications => {
          prevNotifications.map(notification => notification.id === notificationId ? { ...notification, is_read: true } : notification)
        })
        setBadgeCount(prevBadgeCount => prevBadgeCount - 1);
      }
    } catch (error) {
      console.log("Error set read messages", error)
    }
  }

  return (
    <div className="notifications-drop-down">
      <p className="fw-bold h5 mb-4">Notification</p>
      <ul>
        {
          notifications.length === 0 ? (
            <li>N/A</li>
          ) :
            (
              notifications.map((notification, index) => <Link to={`/posts/${notification.post_id}`} onClick={() => handleReadNotification(notification.id)} key={index}><li className={notification.is_read ? "" : "unread mb-2"}>{notification.message}</li></Link>)
            )
        }
      </ul>
    </div>
  );
}

export default NotificationWindow;
