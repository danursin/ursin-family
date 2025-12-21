import * as crypto from "node:crypto";

import { getFamilyAsJson, writeGedcom } from "@/services/gedcomService";

import { Individual } from "@/types";
import { NextResponse } from "next/server";

export async function GET() {
    const gedcomData = await getFamilyAsJson();
    const individuals = gedcomData.individuals;
    return NextResponse.json({ individuals });
}

export async function POST(req: Request) {
    const body = (await req.json()) as Partial<Individual>;

    const created: Individual = {
        _id: `@I_${crypto.randomUUID()}@`,
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

    const gedcomData = await getFamilyAsJson();
    gedcomData.individuals.push(created);
    await writeGedcom(gedcomData);

    return NextResponse.json({ individual: created }, { status: 201 });
}
