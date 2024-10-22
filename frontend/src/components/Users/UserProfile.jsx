import React from "react";
import { useAuth } from "../../hooks/AuthProvider";
import Posts from "../Posts/Posts";

function UserProfile() {
  const { user } = useAuth();
  // convert image buffer to base64 string
  const profilePicFile = user?.profile_pic_file
    ? `data:image/png;base64,${btoa(
        String.fromCharCode(...new Uint8Array(user.profile_pic_file.data))
      )}`
    : null;

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        {user && (
          <div className="profile-content">
            <img
              className="profile-pic"
              src={
                user.profile_pic_file ? profilePicFile : user.profile_pic_url
              }
              alt="profile-image"
            />
            <div>
              <button>Edit Profile</button>
            </div>
            <h1>{user.username}</h1>
            <p>Bio</p>
            <p>Join Date</p>
            <div className="profile-posts">
              <Posts user={user} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
