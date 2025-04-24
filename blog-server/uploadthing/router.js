import { createUploadthing } from "uploadthing/express";


const f = createUploadthing();

export const fileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(() => {
    }),
};
