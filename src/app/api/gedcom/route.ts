import { FamilyItem, GedcomData, IndividualItem } from "@/types";
import dynamodb, { TABLE_NAME } from "@/db/dynamodb";
import { getFamilyAsGedcomString, writeGedcom } from "@/services/gedcomService";

import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import toGedcomString from "@/services/scripts/write-gedcom";

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

async function getFamilies(): Promise<FamilyItem[]> {
    const { Items: FamilyItems } = await dynamodb.send(
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

    const families = FamilyItems as FamilyItem[];
    return families;
}

async function getIndividuals(): Promise<IndividualItem[]> {
    const { Items: IndividualItems } = await dynamodb.send(
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

    const individuals = IndividualItems as IndividualItem[];
    return individuals;
}

export async function POST() {
    const [families, individuals] = await Promise.all([getFamilies(), getIndividuals()]);

    const gedcom: GedcomData = {
        header: {
            SOUR: "ursin-family",
            NAME: "ursin-family",
            AUTH: "Dan Ursin",
            SUBM: {
                id: "@U_Dan_Ursin@",
                NAME: "Dan Ursin"
            },
            GEDC: {
                VERS: "5.5.1",
                FORM: "LINEAGE-LINKED"
            },
            CHAR: "UTF-8"
        },
        individuals,
        families,
        trailer: "TRLR"
    };

    await writeGedcom(gedcom);

    return new Response(toGedcomString(gedcom), {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,HEAD"
        }
    });
}
