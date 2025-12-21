import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
    }
});

export default s3;
export const BUCKET_NAME = "ursin-family";
export const OBJECT_NAME = "data.gedcom";
