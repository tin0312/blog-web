import React, { useState } from "react";
import { generateReactHelpers, useDropzone } from "@uploadthing/react";
import { Button, Spinner } from "react-bootstrap";

export default function CustomAutoUploadDropzone({
    onUploadComplete,
    onError,
    imgFile,
    setImgFile,
    setIsImgInput,
}) {
    const { useUploadThing } = generateReactHelpers();
    const [isUploading, setIsUploading] = useState(false);

    const { startUpload } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            setIsUploading(false);
            onUploadComplete(res);
        },
        onUploadError: (res) => {
            setIsUploading(false);
            onError(res);
        },
    });

    const onDrop = async (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setIsImgInput(false);
            setImgFile(acceptedFiles);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        disabled: isUploading
    });

    return (
        <div
            {...getRootProps()}
            className={`drag-zone-container w-75 p-4 mb-4 text-center cursor-pointer ${
                imgFile.length > 0 ? "bg-light" : ""
            }`}
            style={{ transition: "background-color 0.2s" }}
        >
            <input {...getInputProps()} />
            {imgFile.length > 0 ? (
                <>
                    <p className="mb-3">Drag & drop or upload to change your file here...</p>
                    <Button
                        variant="dark"
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsUploading(true);
                            startUpload(imgFile);
                        }}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        ) : (
                            `Upload ${imgFile.length} file${imgFile.length > 1 ? "s" : ""}`
                        )}
                    </Button>
                </>
            ) : (
                <p>Drag & drop or upload your file here...</p>
            )}
        </div>
    );
}
