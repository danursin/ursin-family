import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import s3, { BUCKET_NAME, OBJECT_NAME } from "./s3/client";

import { GedcomData } from "@/types";
import cache from "./cacheService";
import toGedcomString from "./scripts/write-gedcom";

export async function writeGedcom(gedcomData: GedcomData): Promise<GedcomData> {
    const gedcomString = toGedcomString(gedcomData);
    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: OBJECT_NAME,
            Body: gedcomString
        })
    );
    cache.put(gedcomString);
    return gedcomData;
}

export async function getFamilyAsGedcomString(): Promise<string> {
    const cached = cache.get();
    if (cached) {
        return cached;
    }

    const response = await s3.send(
        new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: OBJECT_NAME
        })
    );

    if (response.Body) {
        const data = await response.Body.transformToString();
        cache.put(data);
        return data;
    }

    throw new Error(`Failed to fetch ${OBJECT_NAME} from ${BUCKET_NAME}`);
}
