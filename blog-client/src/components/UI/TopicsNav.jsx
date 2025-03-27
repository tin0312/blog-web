import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
export default function TopicsNav() {
    const location = useLocation();
    const { setCategory, category } = useAuth();
    const [categoryPos, setCategoryPos] = useState(0)
    const categoryList = ["software", "networking", "penetration"];
    const navigate = useNavigate();

    // navigate categories
    function scrollCategory(direction) {
        setCategoryPos(prevPos => {
            let newPos = prevPos;
            if (direction === "next") {
                newPos = prevPos < categoryList.length - 1 ? prevPos + 1 : 0;
            } else {
                newPos = prevPos > 0 ? prevPos - 1 : categoryList.length - 1
            }
            setCategory(categoryList[newPos]);
            navigate(`/${categoryList[newPos]}`)
            return newPos
        })
    }

    return (
        <div className="p-0">

            <ul className="position-sticky topics-nav d-flex bg-white p-3 align-items-center justify-content-between overflow-auto">
                <span className="material-symbols-outlined direction-icon" onClick={() => scrollCategory("prev")}>
                    arrow_back_ios
                </span>
                <li className="px-2 d-md-none"><NavLink to={categoryPos === 0 ? "/" : `/${category}`} className={({ isActive }) => isActive  || location.pathname === `/${category}`? "fw-bold" : "text-secondary"} onClick={() => setCategory(categoryList[categoryPos])} >
                    {category}</NavLink></li>
                {categoryList.map((category, index) => (
                    <li className="d-none d-md-block" key={index}>
                        <NavLink to={index === 0 ? "/" : `/${category}`} className={({ isActive }) => isActive || location.pathname === `/${category}` ? "fw-bold" : "text-secondary"} onClick={() => setCategory(category)}>{category}</NavLink>
                    </li>
                ))}
                <span className="material-symbols-outlined direction-icon" onClick={() => scrollCategory("next")}>arrow_forward_ios</span>
            </ul>
            <Outlet />
        </div>
    )
}
