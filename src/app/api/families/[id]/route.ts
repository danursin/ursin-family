import { Family, FamilyIdentifier } from "@/types";
import { getFamilyAsJson, writeGedcom } from "@/services/gedcomService";

import { NextResponse } from "next/server";

export async function GET(_: Request, ctx: { params: Promise<{ id: FamilyIdentifier }> }) {
    const { id } = await ctx.params;
    const gedcomData = await getFamilyAsJson();
    const families = gedcomData.families;
    const family = families.find((i) => i._id === id);
    if (!family) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ family });
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: FamilyIdentifier }> }) {
    const { id } = await ctx.params;
    const gedcomData = await getFamilyAsJson();
    const families = gedcomData.families;
    const existing = families.find((i) => i._id === id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = (await req.json()) as Partial<Family>;

    // overwrite properties from body
    for (const [key, value] of Object.entries(body)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (existing as any)[key] = value;
    }

    await writeGedcom(gedcomData);
    return NextResponse.json({ family: existing });
}
