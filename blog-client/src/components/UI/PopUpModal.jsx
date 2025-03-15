import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"

export default function PopUpModal({ isPopUpModalShown, setIsPopUpModalShown, isNavHidden, setIsNavHidden }) {
    const navigate = useNavigate();
    function handleNavigate() {
        setIsPopUpModalShown(false)
        setIsNavHidden(false)
        localStorage.setItem("navState", "false")
        navigate("/")
    }

    return (
        <Modal
            show={isPopUpModalShown}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>You have unsaved changes. Do you want to navigate to leave this page?</Modal.Title>
            </Modal.Header>
            <Modal.Footer className="d-flex justify-content-center">
                <Button variant="secondary" onClick={handleNavigate}>

                    Yes, leave the page

                </Button>
                <Button variant="primary" onClick={() => setIsPopUpModalShown(false)}>No, keep editting</Button>
            </Modal.Footer>
        </Modal>
    )
}