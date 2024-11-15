import React from "react";
import { useAuth } from "../../hooks/AuthProvider";
import Posts from "../Posts/Posts";

function UserProfile() {
  const { user } = useAuth();

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        {user && (
          <div className="profile-content">
            <img
              className="profile-pic"
              src={user?.profile_pic}
              alt="profile-image"
              referrerPolicy="no-referrer"
            />
            <div>
              <button>Edit Profile</button>
            </div>
            <h1>{user.username}</h1>
            <p>Bio</p>
            <p>Join Date</p>
            <div className="profile-posts">
              <Posts class="profile-posts" user={user} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
