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

    const isMobile = window.innerWidth <= 768;

    const resizeToFixedAspect = (file) =>
        new Promise((resolve) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.src = e.target.result;
            };

            img.onload = () => {
                // Determine orientation
                const isPortrait = img.height > img.width;

                // Choose target dimensions and aspect ratio
                const targetAspect = isPortrait ? 9 / 16 : 16 / 9;
                const TARGET_WIDTH = isPortrait
                    ? (isMobile ? 196 : 268)  // narrower width for portrait
                    : (isMobile ? 378 : 512);
                const TARGET_HEIGHT = Math.round(TARGET_WIDTH / targetAspect);

                // Create canvas with fixed output dimensions
                const canvas = document.createElement("canvas");
                canvas.width = TARGET_WIDTH;
                canvas.height = TARGET_HEIGHT;

                const ctx = canvas.getContext("2d");

                // Original image aspect ratio
                const srcAspect = img.width / img.height;

                // Crop image to match target aspect ratio
                let srcX = 0,
                    srcY = 0,
                    srcW = img.width,
                    srcH = img.height;

                if (srcAspect > targetAspect) {
                    // Image is too wide — crop sides
                    srcW = img.height * targetAspect;
                    srcX = (img.width - srcW) / 2;
                } else {
                    // Image is too tall — crop top and bottom
                    srcH = img.width / targetAspect;
                    srcY = (img.height - srcH) / 2;
                }

                // Draw and resize
                ctx.drawImage(
                    img,
                    srcX,
                    srcY,
                    srcW,
                    srcH,
                    0,
                    0,
                    TARGET_WIDTH,
                    TARGET_HEIGHT
                );

                // Convert canvas to blob
                canvas.toBlob(
                    (blob) => {
                        const resizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });
                        resolve(resizedFile);
                    },
                    file.type
                );
            };
            reader.readAsDataURL(file);
        });


    const onDrop = async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        setIsImgInput(false);
        const originalFile = acceptedFiles[0];
        const resizedFile = await resizeToFixedAspect(originalFile);
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
