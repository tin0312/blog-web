import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import {Link} from "react-router-dom"
import moment from "moment";
import { Button } from "react-bootstrap"
import convertBinaryImageData from "../../helpers/convertImage";

export default function UserInfo() {
    const { user, setUser } = useAuth()
     useEffect(() =>{
        async function fetchUserData(){
            try {
                const response = await fetch(`/api/users/profile/${user?.id}`);
                const userData = await response.json()
                userData.profile_pic_file = convertBinaryImageData(userData.profile_pic_file)
                setUser(userData)
            } catch(error) {
                console.log("Error retrieving user data", error)
            }
        }
        fetchUserData()
     }
        , [user?.id])
    return (
        <>
            <img src={user?.profile_pic_file} className="profile-pic" alt="user-picture" />
            <h6 className="fw-bold my-4">{user?.username}</h6>
            <p>{user?.bio}</p>
            <div className="divider bg-secondary w-100 opacity-25 my-4"></div>
            <ul className="d-flex flex-wrap gap-4 p-2 justify-content-center">
                <li className="text-secondary">
                    <span className="material-symbols-outlined align-bottom">location_on</span>{user?.location}</li>
                <li className="text-secondary"><span className="material-symbols-outlined align-bottom">
                    keyboard_keys
                </span>Joined on { moment(user?.join_date).format("MMM Do, YYYY")}</li>
                <li className="text-secondary"><span className="material-symbols-outlined align-bottom">
                    link
                </span>{user?.profile_url}</li>
            </ul>
            <Link to="/profile/setting">
                <Button className="mb-3" variant="dark">Edit profile</Button>
            </Link>
        </>
    )
}