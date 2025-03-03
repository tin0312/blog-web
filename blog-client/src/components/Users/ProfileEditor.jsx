import React from "react";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import UploadButton from "../UI/UploadButton";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/AuthProvider";
import ButtonsBox from "../UI/ButtonsBox";
import { useNavigate } from "react-router-dom";

export default function ProfileEditor() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm();
    const navigate = useNavigate();
    const { user } = useAuth();
    async function handleEditProfile(user) {
        const formData = new FormData();
        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("username", user.username);
        formData.append("userURL", user.userURL);
        formData.append("userLocation", user.userLocation);
        formData.append("userBio", user.userBio);
        formData.append("profilePicFile", user.profileImg[0]);

    
        try {
            const response = await fetch("/api/users/profile/edit", {
                body: formData,
                method: "PATCH"
            })
            if(response.status === 200){
                navigate("/profile")
            } else {
                alert("Error updating user profile")
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <>
            <Container className="d-flex flex-column align-items-center my-5 justify-content-center" fluid>
                <Form className="user-info-editor w-50 mb-5" onSubmit={handleSubmit(handleEditProfile)}>
                <Row className="profile-edit-container">
                    <Col>
                        {/* User information */}
                        <Row className="bg-white p-4">
                            <Row>
                                <Col className="fw-bold">
                                    User
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            defaultValue={user?.name}
                                            aria-label="User Fullname"
                                            aria-describedby="basic-addon1"
                                            {...register("name")}
                                        />
                                    </InputGroup>
                                    <InputGroup className="mb-3">

                                        <Form.Control
                                            defaultValue={user?.email}
                                            aria-label="User Email"
                                            aria-describedby="basic-addon1"
                                            {...register("email")}
                                        />
                                    </InputGroup>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                                        <Form.Control
                                            defaultValue={user?.username}
                                            aria-label="Username"
                                            aria-describedby="basic-addon1"
                                            {...register("username")}
                                        />
                                    </InputGroup>
                                    <p className="fw-bold mb-3">Profile Image</p>
                                    <UploadButton
                                        label="Change"
                                        register={register}
                                        name="profileImg"
                                        existingFile={user?.profile_pic_file}
                                    />
                                </Col>
                            </Row>
                        </Row>
                    </Col>
                </Row>
                {/* User basic information */}
                <Row className="profile-edit-container bg-white mt-3 p-4">
                    <Col>
                        <Form.Label htmlFor="user-url">Website URL</Form.Label>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon3">
                                https://example.com
                            </InputGroup.Text>
                            <Form.Control id="user-url" aria-describedby="basic-addon3" {...register("userURL")} defaultValue={user?.profile_url}/>
                        </InputGroup>
                        <Form.Label htmlFor="location">Location</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Toronto, Ontario"
                                defaultValue={user?.location}
                                aria-label="User Location"
                                aria-describedby="basic-addon1"
                                {...register("userLocation")}
                            />
                        </InputGroup>
                        <Form.Label htmlFor="bio">Bio</Form.Label>
                        <InputGroup>

                            <Form.Control as="textarea" aria-label="User Bio" placeholder="A short bio..." defaultValue={user?.bio} {...register("userBio")}/>
                        </InputGroup>
                    </Col>
                </Row>
                {/* User basic END information */}
            <Row>
                <Col>
                    <ButtonsBox buttonOneContent= "Save" buttonTwoContent="Back"/>
                </Col>
            </Row>
            </Form>
            </Container>
        </>
    )
}