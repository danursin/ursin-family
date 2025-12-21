import { getFamilyAsGedcomString } from "@/services/gedcomService";

export async function GET() {
    const gedcom = await getFamilyAsGedcomString();
    return new Response(gedcom, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,HEAD"
        }
    });
}

// respond to HEAD because the Topola proxy issues a HEAD request first
export function HEAD() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,HEAD"
        }
    });
}
