import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";

function UserMenu() {
  const { user, logOut } = useAuth();
  return (
    <div className="user-drop-down">
      <ul>
        {user ? (
          <>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <hr className="solid" />
            <li>
              <img
                className="user-icon"
                src="/icon/log-out.png"
                alt="logout-icon"
                onClick={logOut}
              />
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login"> Sign in</Link>
            </li>
            <hr class="solid" />
            <li>
              <Link to="/signup">Sign up</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default UserMenu;
