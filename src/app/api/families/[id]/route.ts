import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb, { TABLE_NAME } from "@/db/dynamodb";

import { FamilyItem } from "@/types";
import { NextResponse } from "next/server";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;
    const { Item: family } = await dynamodb.send(
        new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: `FAMILY#${id}`,
                SK: "PROFILE"
            }
        })
    );
    if (!family) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(family);
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
    const { id } = await ctx.params;
    const { DIV, MARR, HUSB, WIFE, CHIL } = (await req.json()) as Partial<FamilyItem>;
    const updates = Object.fromEntries(
        Object.entries({
            DIV,
            MARR,
            HUSB,
            WIFE,
            CHIL
        }).filter(([, v]) => v !== undefined)
    ) as Partial<FamilyItem>;

    const response = await dynamodb.send(
        new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                PK: `FAMILY#${id}`,
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
