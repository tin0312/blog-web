import React, {useState, useEffect } from "react";
import { useAuth } from "../../hooks/AuthProvider";

function NotificationWindow() {
  const [notifications, setNotifications] = useState([]);
  const { ws } = useAuth();

useEffect(()=>{
  console.log(ws.data)
  if(ws.data){
      const { message } = ws.data;
      console.log(message)
      setNotifications((prev) => [message, ...prev])
  }
}, [ws.data])

  return (
    <div className="user-drop-down">
      <p>Notification</p>
      <ul>
        {
          !notifications.length ? "N/A" :
          (
            notifications.map((notification, index )=> <li key={index}>{notification}</li>)
          )
        }
      </ul>
    </div>
  );
}

export default NotificationWindow;
