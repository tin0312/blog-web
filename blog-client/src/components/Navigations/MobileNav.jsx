import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";

function MobileNav() {
  const { logOut, user } = useAuth();
  const [isToggled, setIsToggled] = useState(false);
  const location = useLocation();
  function handleOpenMenu() {
    setIsToggled((prevState) => !prevState);
  }
  useEffect(() => {
    setIsToggled(false);
  }, [location]);
  return (
    <>
      <span
        onClick={handleOpenMenu}
        className={`nav-icon hide ${isToggled ? "active" : ""}`}
      >
        <i></i>
        <i></i>
        <i></i>
      </span>
      <ul className={`mobile-nav ${isToggled ? "show" : ""}`}>
        <li>
          <Link className="nav-link" to="/">
            posts
          </Link>
        </li>

        {user ? (
          <>
            <li>
              <Link className="nav-link create-post-btn" to="/create-post">
                Create Post
              </Link>
            </li>
            <li>
              <Link className="nav-link" to="/profile">
                Profile
              </Link>
            </li>
            <li>
              <img
                className="user-icon"
                src="/icon/log-out.png"
                alt="user-icon"
                onClick={logOut}
              />
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">
                <img
                  className="user-icon"
                  src="/icon/user.png"
                  alt="user-icon"
                />
              </Link>
            </li>

            <li>
              <Link className="nav-link create-post-btn" to="/signup">
                Sign up
              </Link>
            </li>
          </>
        )}
      </ul>
    </>
  );
}

export default MobileNav;
