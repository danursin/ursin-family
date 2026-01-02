import * as crypto from "node:crypto";

import { FamilyIdentifier, FamilyItem } from "@/types";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb, { TABLE_NAME } from "@/db/dynamodb";

import { NextResponse } from "next/server";

export async function GET() {
    const { Items } = await dynamodb.send(
        new QueryCommand({
            TableName: TABLE_NAME,
            IndexName: "GSI1",
            KeyConditionExpression: "#GSI1PK = :GSI1PK",
            ExpressionAttributeNames: {
                "#GSI1PK": "GSI1PK"
            },
            ExpressionAttributeValues: {
                ":GSI1PK": "FAMILY"
            }
        })
    );

    return NextResponse.json(Items);
}

export async function POST(req: Request) {
    const body = (await req.json()) as Partial<FamilyItem>;

    const id: FamilyIdentifier = `@F_${crypto.randomUUID()}@`;
    const updates: FamilyItem = {
        PK: `FAMILY#${id}`,
        SK: "PROFILE",
        Type: "FAMILY",
        GSI1PK: "FAMILY",
        GSI1SK: id,
        id,
        ...body
    };

    await dynamodb.send(
        new PutCommand({
            TableName: TABLE_NAME,
            Item: updates,
            ReturnValues: "NONE"
        })
    );

    return NextResponse.json(updates, { status: 201 });
}
