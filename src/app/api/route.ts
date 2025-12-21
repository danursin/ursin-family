import { NextResponse } from "next/server";
import gedcomData from "@/services/family";
import toGedcomString from "@/services/scripts/write-gedcom";

export async function GET() {
    const gedcom = toGedcomString(gedcomData);
    return new NextResponse(gedcom, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Content-Disposition": 'attachment; filename="family.ged"'
        }
    });
}
