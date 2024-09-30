import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Fetch the current user when the app loads
  useEffect(() => {
    if (!user) {
      const fetchCurrentUser = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/current-user`,
            {
              credentials: "include",
            }
          );
          if (response.status === 200) {
            const userData = await response.json();
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.log("Error fetching current user", error);
        }
      };

      fetchCurrentUser();
    }
  }, [user]);

  async function logIn(userData) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/login`,

        {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          method: "POST",
          body: JSON.stringify({
            username: userData.username,
            password: userData.password,
          }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        setUser(data.user);
        navigate("/");
      }
    } catch (error) {
      console.log("Error Loging In", error);
    }
  }
  async function logOut() {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/log-out`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.log("Error Logging Out", error);
    }
  }
  return (
    <AuthContext.Provider value={{ user, logIn, logOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

// custom hook enble app child components to consume authentication context
export function useAuth() {
  return useContext(AuthContext);
}
