import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/users/current-user`,
          {
            credentials: "include",
          }
        );
        if (response.status === 200) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.log("Error fetching current user");
      }
    };
    fetchCurrentUser();
  }, []);

  async function logIn(userData) {
    let data;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/login`,

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
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/log-out`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log("Error Logging Out", error);
    }
  }
  return (
    <AuthContext.Provider value={{ user, logIn, loginError, logOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

// custom hook enble app child components to consume authentication context
export function useAuth() {
  return useContext(AuthContext);
}
