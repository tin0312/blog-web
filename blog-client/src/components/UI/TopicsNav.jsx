import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
export default function TopicsNav() {
    const { setCategory} = useAuth();
    return (
        <div className="p-0">
            <ul className="position-sticky topics-nav d-flex bg-white p-3 align-items-center justify-content-between overflow-auto">
                <span class="material-symbols-outlined">
                    arrow_back_ios
                </span>
                <li className="px-2"><NavLink to="/" className={({ isActive }) => isActive ? "fw-bold" : "text-secondary"} onClick={() => setCategory("software")} >
                    Software Engineering</NavLink></li>
                <li className="px-2"><NavLink to="networking" className={({ isActive }) => isActive ? "fw-bold" : "text-secondary"} onClick={() => setCategory("networking")}>Networking Security</NavLink></li>
                <li className="px-2"><NavLink to= "penetration" className={({ isActive }) => isActive ? "fw-bold" : "text-secondary"} onClick={() => setCategory("penetration")}>Penetration Testing</NavLink></li>
                <span class="material-symbols-outlined">arrow_forward_ios</span>
            </ul>
                <Outlet />
        </div>
    )
}
