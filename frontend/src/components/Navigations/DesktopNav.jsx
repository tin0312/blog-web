import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import UserMenu from "../Users/UserMenu";
import { useAuth } from "../../hooks/AuthProvider";

function DesktopNav() {
  const { user } = useAuth();
  const [isUserMenu, setIsUserMenu] = useState(false);
  const [isSticked, setIsSticked] = useState(false);
  function handleOpenUserMenu() {
    setIsUserMenu((preState) => !preState);
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
          <li>
            <Link to="/create-post" className="create-post-btn">
              Create Post
            </Link>
          </li>
        )}
        <li>
          <div
            onClick={handleOpenUserMenu}
            className="user-
                        container"
          >
            <img className="user-icon" src="/icon/user.png" alt="user-icon" />
            {isUserMenu && <UserMenu />}
          </div>
        </li>
      </ul>
    </>
  );
}

export default DesktopNav;
