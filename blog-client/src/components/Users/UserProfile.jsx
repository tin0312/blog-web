import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import UserInfo from "../Users/UserInfo"
import { Outlet } from "react-router-dom";

function UserProfile() {
  return (
    <Container className="user-profile-wrapper d-flex flex-column align-items-center relative p-0" fluid>
      {/* User bg image */}
      <Row className="position-absolute w-100">
        <Col className="bg-secondary h-50">
          <div className="user-bg"></div>
        </Col>
      </Row>
      {/* User info */}
      <Row className="user-profile-container bg-white align-self-center">
        <Col>
          <Row className="user-information-container">
            <Col className="d-flex flex-column align-items-center px-0">
              < UserInfo/>
            </Col>
          </Row>
        </Col>
      </Row>
       {/* User posts */}
       <Row className="user-posts">
            <Col className="p-0">
                <Outlet/> 
            </Col>
        </Row>
    </Container>
  );
}

export default UserProfile;
