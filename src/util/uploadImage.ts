import * as SparkMD5 from "spark-md5";
import "whatwg-fetch";

import { PresignedPostRequest } from "../api/requests";

export default function uploadImage(imageFile, getPresignedPost): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async () => {
            const hash = await SparkMD5.hash(reader.result);
            const request = {
                file_hash: hash,
                file_name: imageFile.name,
                file_type: imageFile.type,
            } as PresignedPostRequest;
            const presignedPost = await getPresignedPost(request);
            const image = await uploadToS3(presignedPost, imageFile);
            resolve(image);
        };
        reader.readAsDataURL(imageFile);
    });
}

async function uploadToS3(presignedPostResponse, file) {
    const formData = new FormData();
    const result = presignedPostResponse.result;
    formData.append("key", result.fields.key);
    formData.append("AWSAccessKeyId", result.fields.AWSAccessKeyId);
    formData.append("acl", result.fields.acl);
    formData.append("policy", result.fields.policy);
    formData.append("signature", result.fields.signature);
    formData.append("Content-Type", file.type);
    formData.append("file", file, file.name);

    const response = await fetch(result.url, {
        method: "POST",
        mode: "no-cors",
        body: formData,
    });

    // TODO: Error Handling

    return `${result.url}${result.fields.key}`;
}
