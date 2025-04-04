import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useWebSocket from "./webSocketHook";

const AuthContext = createContext();
function AuthProvider({ children }) {
  const [isNavHidden, setIsNavHidden] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [badgeCount, setBadgeCount] = useState(0);
  const [loginError, setLoginError] = useState("");
  const [category, setCategory] = useState("software");
  const ws = useWebSocket({
    socketUrl: "ws://localhost:8080",
    userId: user?.userId
  })
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(
        "/api/users/current-user"
      );
      if (response.status === 200) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.log("Error fetching current user");
    }
  };
  useEffect(() => {
    fetchCurrentUser();
  }, [])

  useEffect(() => {
    // get current notifications
    async function getNotificationCounts() {
      try {
        const result = await fetch("/api/posts/notification-count");
        const { unreadCount } = await result.json();
        setBadgeCount(unreadCount);
      } catch (error) {
        console.log("Error retrieving notification count", error)
      }
    }
    getNotificationCounts()
  }, [ws.data])
  // get the current navbar display
  useEffect(() => {
    const currentNavState = localStorage.getItem("navState") === "true";
    setIsNavHidden(currentNavState)
  }, [])
  async function logIn(userData) {
    let data;
    try {
      const response = await fetch(
        "/api/users/login",

        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          method: "POST",
          body: JSON.stringify({
            username: userData.username,
            password: userData.password,
          }),
        }
      );
      data = await response.json();
      if (response.status === 200) {
        setUser(data.user);
        navigate("/");
      } else if (response.status === 404) {
        setLoginError(data.message);
      } else {
        setLoginError(data.message);
      }
    } catch (error) {
      setLoginError(data.message);
    }
  }
  async function logOut() {
    try {
      await fetch("/api/users/log-out", {
        method: "POST",
      });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log("Error Logging Out", error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, logIn, loginError, logOut, setUser, isNavHidden, setIsNavHidden, category, setCategory, fetchCurrentUser, ws, badgeCount, setBadgeCount }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

// custom hook enble app child components to consume authentication context
export function useAuth() {
  return useContext(AuthContext);
}
