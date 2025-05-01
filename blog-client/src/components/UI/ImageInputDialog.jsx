import { useState } from "react";
import { generateUploadDropzone } from "@uploadthing/react";
import { Button, Modal, Form, Spinner, Row, Col, Alert } from "react-bootstrap";
import { insertImage$, usePublisher } from "@mdxeditor/editor";
import { Image } from "react-bootstrap-icons";
import CustomAutoUploadDropzone from "./CustomAutoUploadDropzone";

export default function ImageInputDialog() {
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [alert, setAlert] = useState({
        type: "",
        message: ""
    });
    const [imgFile, setImgFile] = useState([]);
    const [manualImgInputFile, setManualImgInputFile] = useState({
        src: "",
        alt: ""
    })
    const insertImage = usePublisher(insertImage$);
    const [loading, setLoading] = useState(false);
    const [isImgInput, setIsImgInput] = useState(true);

    async function handleInsertImage() {
        if (!manualImgInputFile.src || !manualImgInputFile.alt) return;
        try {
            setLoading(true);
            await insertImage({
                src: manualImgInputFile.src,
                altText: manualImgInputFile.alt,
                title: manualImgInputFile.alt,
            })
            setAlert({ type: "suceess", message: "Image inserted successfully!" })
            setLoading(false);
            setIsImageDialogOpen(false);
            setManualImgInputFile({ src: "", alt: "" });
        } catch (error) {
            setLoading(false);
            setAlert({ type: "danger", message: "Can't add your image. Please try again." })
        }
    }

    return (
        <>
            <Button className="bg-transparent border-0" onClick={() => setIsImageDialogOpen(true)}>
                <Image />
            </Button>
            <Modal show={isImageDialogOpen} onHide={() => setIsImageDialogOpen(false)} centered>
                <Modal.Header>
                    <Modal.Title>Add Image</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex flex-column align-items-center" >
                    {
                        alert && (
                            <Alert
                                variant={alert.type}
                                onClose={() => setAlert(null)}
                            >
                                {alert.message}
                            </Alert>
                        )
                    }
                    <CustomAutoUploadDropzone
                        onUploadComplete={(res) => {
                            res.forEach((file) => {
                                insertImage({
                                    src: file.ufsUrl,
                                    altText: file.name,
                                    title: file.name,
                                });
                            });
                            setIsImageDialogOpen(false);
                            setImgFile([])
                            setIsImgInput(true)
                        }}
                        onError={(error) =>
                            setAlert({ type: "danger", message: `ERROR: ${error.message}` })
                        }
                        setIsImgInput={setIsImgInput}
                        setImgFile={setImgFile}
                        imgFile={imgFile}

                    />


                    {
                        isImgInput && (
                            <>
                                <Form.Group className="w-100">
                                    <Form.Label>
                                        Source link:
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Image URL"
                                        value={manualImgInputFile.src}
                                        onChange={(e) => setManualImgInputFile({ ...manualImgInputFile, src: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group className="w-100">
                                    <Form.Label>
                                        Image title:
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Image Title"
                                        value={manualImgInputFile.alt}
                                        onChange={(e) => setManualImgInputFile({ ...manualImgInputFile, alt: e.target.value })}
                                    />
                                </Form.Group>
                            </>
                        )
                    }
                </Modal.Body>
                {
                    isImgInput && (
                        <>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setIsImageDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={handleInsertImage}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save"
                                    )}
                                </Button>
                            </Modal.Footer>
                        </>
                    )
                }
            </Modal>
        </>
    )
}