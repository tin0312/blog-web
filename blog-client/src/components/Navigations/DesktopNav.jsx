import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import UserMenu from "../UI/UserMenu";
import { useAuth } from "../../hooks/AuthProvider";
import NotificationWindow from "../UI/NotificationWindow";
import { Row, Col, Form, Container, Button } from "react-bootstrap";
import PopUpModal from "../UI/PopUpModal";

function DesktopNav() {
  const { user, isNavHidden, setIsNavHidden, setCategory } = useAuth();
  const [isUserMenu, setIsUserMenu] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isPopUpModalShown, setIsPopUpModalShown] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isComposingPost = pathname === "/create-post"
  const isProfile = pathname === "/profile"
  useEffect(()=> {
    function handleAutomaticClose(){
        if(isUserMenu){
          setIsUserMenu(false)
        } else if(isNotificationOpen){
          setIsNotificationOpen(false)
        }
    }
    window.addEventListener("click", handleAutomaticClose)
    return () => {
      window.removeEventListener("click", handleAutomaticClose)
    }
  }, [isUserMenu, isNotificationOpen])
  function handleOpenUserMenu(event) {
    event.stopPropagation();
    if(isNotificationOpen){
        handleOpenNotification(event)
    }
    setIsUserMenu((preState) => !preState);
  }
  function handleOpenNotification(event) {
    event.stopPropagation();
    if(isUserMenu) {
      handleOpenUserMenu(event)
    }
    setIsNotificationOpen((preState) => !preState);
  }
  return (
    <Container className={`desktop-nav ${isProfile ? "position-fixed top-0" : ""} ${isNavHidden ? "bg-transparent" : "bg-white"}`} fluid >
      <Row className="w-100">
        <Col xs={2} md={6} className="desktop-nav p-0">
          <Row className="w-100 align-iteFms-center">
            <Col className="px-0" md={2}>
              <li className="fs-2 fw-bold">
                <p className="pl-0 logo" onClick={() => isComposingPost ? setIsPopUpModalShown(true) : (navigate("/"), setCategory("software"))}>
                  Yours
                </p>
              </li>
            </Col>
            <Col md={10} className="d-flex align-items-center">
            <li className={`${isNavHidden ? "d-none" : "d-none d-xl-block w-100"}`}>
                <Form>
                  <Form.Control
                    type="text"
                    placeholder="Search"
                  />
                </Form>
            </li>
              <li className={`${isNavHidden ? "d-none d-md-block" : "d-none"}`}>
                <p className="fst-italic">{`Draft in ${user?.username}`}</p>
              </li>
            </Col>
          </Row>
        </Col>
        {/* Navigation to home page, close current editor */}
        <Col xs={10} md={6} className={`desktop-nav p-0 justify-content-end ${isNavHidden ? "d-flex" : "d-none"}`}>
          <Button variant="light" onClick={() => setIsPopUpModalShown(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>

          </ Button>
          < PopUpModal
            isPopUpModalShown={isPopUpModalShown}
            setIsPopUpModalShown={setIsPopUpModalShown}
            isNavHidden={isNavHidden}
            setIsNavHidden={setIsNavHidden}
          />
        </Col>
        {/* User essentials */}
        <Col xs={10} md={6} className={`desktop-nav p-0 justify-content-end ${isNavHidden ? "d-none" : "d-md-flex"}`} >
          {user ? (
            <>
              <li className="nav-link d-none d-md-flex align-items-center">
                <Link 
                onClick={() =>{
                    setIsNavHidden(true)
                    localStorage.setItem("navState", "true")}
                } 
                className="nav-link"
                to="/create-post">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  Write
                </Link>
              </li>
              <div className="notification-container">
                <li>
                  <svg onClick={handleOpenNotification} stroke="currentColor" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="icon nav-link">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                </li>
                {isNotificationOpen && <NotificationWindow />}
              </div>
              <li className="d-block d-md-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </li>
              <li onClick={handleOpenUserMenu} className="user-container">
                <img
                  style={
                    user
                      ? { borderRadius: "50%", width: "50px", height: "50px" }
                      : null
                  }
                  className="icon"
                  src={user?.profile_pic_file || user?.profile_pic_url}
                  alt="user-icon"
                  referrerPolicy="no-referrer"
                />
                {isUserMenu && <UserMenu setIsNavHidden={setIsNavHidden}/>}
              </li>
            </>
          ) : (
            <>
              <li className="d-none d-xl-block">
                <Link className="nav-link d-none d-md-block" to="/login"> Sign in</Link>
              </li>
              <li className="px-0">
                <Link className="get-started-btn" to="/signup">Get started</Link>
              </li>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default DesktopNav;
