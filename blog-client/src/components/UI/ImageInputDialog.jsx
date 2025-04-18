import { useState } from "react";
import { UploadDropzone } from "@uploadthing/react";
import { Button, Modal, Form, Spinner, Row, Col, Alert } from "react-bootstrap";
import { insertImage$, usePublisher  } from "@mdxeditor/editor";
import { Image } from "react-bootstrap-icons";

export default function ImageInputDialog() {
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [alert, setAlert] = useState({
        type: "",
        message: ""
    });
    const [imgUrl, setImgUrl] = useState({
        src: "",
        alt: ""
    });
    const insertImage = usePublisher(insertImage$);
    const [loading, setLoading] = useState(false);
    
    async function handleInsertImage(){
        if(!imgUrl.src || !imgUrl.alt) return;
        try{
            setLoading(true);
            await insertImage({
                src: imgUrl.src,
                altText: imgUrl.alt,
                title: imgUrl.alt,
            })
            setAlert({type: "suceess", message: "Image inserted successfully!"})
            setLoading(false);
            setIsImageDialogOpen(false);
        } catch(error){
            setLoading(false);
            setAlert({type: "danger", message: "Can't add your image. Please try again."})
        }
    }



    return (
        <>
            <Button className="bg-transparent border-0" onClick={() => setIsImageDialogOpen(true)}>
                <Image />
            </Button>
            <Modal show={isImageDialogOpen} onHide={()=> setIsImageDialogOpen(false)}>
                <Modal.Header>
                    <Modal.Title>Add Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                    <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                            res.forEach((file) => {
                                insertImage({
                                    src: file.url,
                                    altText: file.name,
                                    title: file.title
                                })
                            })
                            setAlert({ type: "success", message: "Upload complete!" });
                            setIsImageDialogOpen(false);
                        }}
                        onUploadError={(error) => {
                            setAlert({ type: "danger", message: `ERROR: ${error.message}` });
                        }}
                        appearance={{
                            button: "btn btn-warning my-2",
                            allowedContent: "text-muted small",
                        }}
                        className="border rounded p-3 mb-4"
                    />
                    <Form.Group>
                        <Form.Label>
                            Source link:
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Image URL"
                            value={imgUrl.src}
                            onChange={(e) => setImgUrl({ ...imgUrl, src: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            Image title:
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Image Title"
                            value={imgUrl.alt}
                            onChange={(e) => setImgUrl({ ...imgUrl, alt: e.target.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsImageDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="success"
                        onClick={handleInsertImage}
                        disabled={loading }
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
            </Modal>
        </>
    )
}