import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import UserMenu from "../UI/UserMenu";
import { useAuth } from "../../hooks/AuthProvider";
import NotificationWindow from "../UI/NotificationWindow";

function DesktopNav() {
  const { user } = useAuth();
  const [isUserMenu, setIsUserMenu] = useState(false);
  const [isSticked, setIsSticked] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  function handleOpenUserMenu() {
    setIsUserMenu((preState) => !preState);
  }
  function handleOpenNotification() {
    setIsNotificationOpen((preState) => !preState);
  }
  useEffect(() => {
    const initialScroll = window.scrollY;
    window.addEventListener("scroll", () => {
      const currentScroll = window.scrollY;
      if (currentScroll > initialScroll) {
        setIsSticked(true);
      } else {
        setIsSticked(false);
      }
    });
  }, []);

  return (
    <>
      {/* Desktop Nabigation */}
      <ul className={`desktop-nav ${isSticked ? "is-sticky" : ""}`}>
        <li>
          <Link className="nav-link" to="/">
            home
          </Link>
        </li>
        {user && (
          <>
            <li>
              <Link to="/create-post" className="create-post-btn">
                Create Post
              </Link>
            </li>
            <div className="notification-container">
              <li>
                <img
                  onClick={handleOpenNotification}
                  className="notification-icon"
                  src="/icon/notification-icon.png"
                  alt="notification-icon"
                />
              </li>
              {isNotificationOpen && <NotificationWindow />}
            </div>
          </>
        )}
        <li>
          <div onClick={handleOpenUserMenu} className="user-container">
            <img
              style={
                user
                  ? { borderRadius: "50%", width: "50px", height: "50px" }
                  : null
              }
              className="user-icon"
              src={`${user ? user.profile_pic : "/icon/user.png"}`}
              alt="user-icon"
              referrerPolicy="no-referrer"
            />
            {isUserMenu && <UserMenu />}
          </div>
        </li>
      </ul>
    </>
  );
}

export default DesktopNav;
