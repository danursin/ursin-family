import * as crypto from "node:crypto";

import { IndividualIdentifier, IndividualItem } from "@/types";
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
                ":GSI1PK": "INDIVIDUAL"
            }
        })
    );

    return NextResponse.json(Items);
}

export async function POST(req: Request) {
    const body = (await req.json()) as Partial<IndividualItem>;

    const id: IndividualIdentifier = `@I_${crypto.randomUUID()}@`;
    const updates: IndividualItem = {
        PK: `INDIVIDUAL#${id}`,
        SK: "PROFILE",
        Type: "INDIVIDUAL",
        GSI1PK: "INDIVIDUAL",
        GSI1SK: id,
        id,
        NAME: body.NAME?.trim() || undefined,
        GIVN: body.GIVN?.trim() || undefined,
        SURN: body.SURN?.trim() || undefined,
        SEX: body.SEX === "M" || body.SEX === "F" ? body.SEX : undefined,
        BIRT: body.BIRT?.trim() || undefined,
        DEAT: body.DEAT?.trim() || undefined,
        FAMC: body.FAMC || undefined,
        FAMS: body.FAMS || undefined,
        OBJE: body.OBJE || undefined
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
