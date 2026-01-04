import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb, { TABLE_NAME } from "@/db/dynamodb";

import { IndividualItem } from "@/types";
import { NextResponse } from "next/server";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;
    const { Item: individual } = await dynamodb.send(
        new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: `INDIVIDUAL#${id}`,
                SK: "PROFILE"
            }
        })
    );
    if (!individual) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(individual);
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;
    const body = (await req.json()) as Partial<IndividualItem>;
    const updates = Object.fromEntries(
        Object.entries({
            NAME: body.NAME,
            GIVN: body.GIVN,
            SURN: body.SURN,
            SEX: body.SEX,
            BIRT: body.BIRT,
            DEAT: body.DEAT,
            FAMS: body.FAMS,
            OBJE: body.OBJE
        }).filter(([, v]) => v !== undefined)
    ) as Partial<IndividualItem>;

    const response = await dynamodb.send(
        new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: `INDIVIDUAL#${id}`,
                SK: "PROFILE"
            },
            UpdateExpression: `SET ${Object.keys(updates).map((k) => `#${k} = :${k}`)}`,
            ExpressionAttributeNames: Object.fromEntries(Object.keys(updates).map((k) => [`#${k}`, k])),
            ExpressionAttributeValues: Object.fromEntries(Object.entries(updates).map(([key, value]) => [`:${key}`, value])),
            ReturnValues: "ALL_NEW"
        })
    );

    return NextResponse.json({ id, ...response.Attributes });
}
