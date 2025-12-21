import { Individual, IndividualIdentifier } from "@/types";
import { getFamilyAsJson, writeGedcom } from "@/services/gedcomService";

import { NextResponse } from "next/server";

export async function GET(_: Request, ctx: { params: Promise<{ id: IndividualIdentifier }> }) {
    const { id } = await ctx.params;
    const gedcomData = await getFamilyAsJson();
    const individuals = gedcomData.individuals;
    const individual = individuals.find((i) => i._id === id);
    if (!individual) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ individual });
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: IndividualIdentifier }> }) {
    const { id } = await ctx.params;
    const gedcomData = await getFamilyAsJson();
    const individuals = gedcomData.individuals;
    const existing = individuals.find((i) => i._id === id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = (await req.json()) as Partial<Individual>;

    // overwrite properties from body
    for (const [key, value] of Object.entries(body)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (existing as any)[key] = value;
    }

    await writeGedcom(gedcomData);
    return NextResponse.json({ individual: existing });
}
