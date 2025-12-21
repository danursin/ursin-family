import * as crypto from "node:crypto";

import { getFamilyAsJson, writeGedcom } from "@/services/gedcomService";

import { Family } from "@/types";
import { NextResponse } from "next/server";

export async function GET() {
    const gedcomData = await getFamilyAsJson();
    const families = gedcomData.families;
    return NextResponse.json({ families });
}

export async function POST(req: Request) {
    const body = (await req.json()) as Partial<Family>;

    const created: Family = {
        _id: `@F_${crypto.randomUUID()}@`,
        HUSB: body.HUSB || undefined,
        WIFE: body.WIFE || undefined,
        CHIL: Array.isArray(body.CHIL) ? body.CHIL : [],
        MARR: body.MARR?.trim() || undefined,
        DIV: body.DIV?.trim() || undefined
    };

    const gedcomData = await getFamilyAsJson();
    gedcomData.families.push(created);

    await writeGedcom(gedcomData);

    return NextResponse.json({ family: created }, { status: 201 });
}
