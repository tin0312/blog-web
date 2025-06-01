import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";

export default function UploadButton({ label, register, name, existingFile }) {
    const [file, setFile] = useState("");
    const { ref, ...rest } = register(name);
    // custom ref for custom behaviour
    const fileInputRef = useRef(null);
    function displayFilePreview(event) {
        setFile(URL.createObjectURL(event.target.files[0]))
    }
    function removeFilePreview() {
        setFile("");
        fileInputRef.current.value = "";
    }
    function handleFileChange() {
        fileInputRef.current.value = "";
        fileInputRef.current.click()
    }

    return (
        <div className="upload-btn">
            <span className="ps-2">
                {file || existingFile ? <img className={`${name === "profileImg" ? "profile-pic" : "file-preview"} me-2`} src={file || existingFile} /> : null}
            </span>
            <input type="file" id="actual-btn" {...register(name, {
                onChange: (e) => displayFilePreview(e)
            })}
                name={name}
                ref={(e) => {
                    ref(e)
                    fileInputRef.current = e
                }}
                hidden />
            <label htmlFor="actual-btn" className={`${file ? "d-none" : "d-inline-block"}`}>{label}</label>
            <span className={`${file ? "" : "d-none"}`}>
                <Button className="ms-4 me-2" variant="light" onClick={handleFileChange}>Change</Button>
                <Button variant="danger" onClick={removeFilePreview}>Remove</Button>
            </span>

        </div>
    )
}