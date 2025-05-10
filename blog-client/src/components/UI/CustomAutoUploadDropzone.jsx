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

    // Fixed 16:9 dimensions
    const isMobile = window.innerWidth <= 768;
    const TARGET_WIDTH = isMobile ? 378 : 512;
    const TARGET_HEIGHT = isMobile ? 196 : 268;

    const resizeToFixed16by9 = (file) =>
        new Promise((resolve) => {
            // create a memory-based image element
            const img = new Image();
            const reader = new FileReader();
            // read the file as base64 encoded string
            reader.onload = (e) => {
                img.src = e.target.result;

            };

            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = TARGET_WIDTH;
                canvas.height = TARGET_HEIGHT;

                const ctx = canvas.getContext("2d");

                // Draw the image centered/cropped into 16:9 frame
                const srcAspect = img.width / img.height;
                const targetAspect = TARGET_WIDTH / TARGET_HEIGHT;

                let srcX = 0, srcY = 0, srcW = img.width, srcH = img.height;

                if (srcAspect > targetAspect) {
                    // Image is wider than 16:9 → crop width
                    srcW = img.height * targetAspect;
                    srcX = (img.width - srcW) / 2;
                } else {
                    // Image is taller than 16:9 → crop height
                    srcH = img.width / targetAspect;
                    srcY = (img.height - srcH) / 2;
                }

                ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

                canvas.toBlob((blob) => {
                    const resizedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now(),
                    });
                    resolve(resizedFile);
                }, file.type);
            };
            reader.readAsDataURL(file);
        });

    const onDrop = async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        setIsImgInput(false);
        const originalFile = acceptedFiles[0];
        const resizedFile = await resizeToFixed16by9(originalFile);
        setImgFile([resizedFile]); // still use array for startUpload
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        disabled: isUploading,
        multiple: false,
        accept: {
            "image/*": [".jpeg", ".png", ".webp", ".jpg"],
        },
    });

    return (
        <div
            {...getRootProps()}
            className={`drag-zone-container w-75 p-4 mb-4 text-center cursor-pointer ${imgFile.length > 0 ? "bg-light" : ""
                }`}
            style={{ transition: "background-color 0.2s" }}
        >
            <input {...getInputProps()} />
            {imgFile.length > 0 ? (
                <>
                    <p className="mb-3">Drag & drop to change.</p>
                    <Button
                        variant="dark"
                        onClick={(e) => {
                            e.stopPropagation();
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
                            `Upload (${imgFile.length}) image`
                        )}
                    </Button>
                </>
            ) : (
                <p>Drag & drop or click to upload an image...</p>
            )}
        </div>
    );
}
