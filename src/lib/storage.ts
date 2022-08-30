import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

function generatePresignedUrl(key: string, expiresIn = 3600) {
    const cmd = new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key });
    return getSignedUrl(s3Client, cmd, { expiresIn });
}
export { s3Client as s3, getSignedUrl };
