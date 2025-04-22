import { createUploadthing } from "uploadthing/express";


const f = createUploadthing({
    auth: {
        token: process.env.UPLOADTHING_TOKEN
    }
});

export const fileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(() => {
    }),
};
