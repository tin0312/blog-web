import React from "react";
import { Button } from "react-bootstrap";
import {Link } from "react-router-dom";

export default function ButtonsBox({buttonOneContent, buttonTwoContent}){
    return (
            <>
                <Button className="me-2" variant="dark" type="submit">{buttonOneContent}</Button>
                <Link to = ".." relative="path">
                <Button variant="light">{buttonTwoContent}</Button>
                
                </Link>
            </>
    )
}