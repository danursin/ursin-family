import * as fs from "fs";
import * as rl from "readline";

import type { Family, FamilyIdentifier, GedcomData, Individual, IndividualIdentifier } from "../../types/index.js";

interface Node {
    tag: string;
    value?: string;
    xref?: string;
    level: number;
    children?: Node[];
}

function fromGedcomDate(dateStr: string): string {
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const [year, month, day] = dateStr.split(" ");
    const dateParts = [year];
    if (month) {
        const monthIndex = monthNames.indexOf(month) + 1;
        dateParts.push(monthIndex.toString().padStart(2, "0"));
    }
    if (day) {
        dateParts.push(day.toString().padStart(2, "0"));
    }
    return dateParts.join("-");
}

const rs = fs.createReadStream("./dist/ursin-family.ged");
const reader = rl.createInterface({ input: rs, crlfDelay: Infinity });

const nodes: Node[] = [];

// Initial parse of records
let prevXRef: string | undefined;
for await (const line of reader) {
    const parts = line.trim().split(" ");
    const level = parseInt(parts[0], 10);
    let tag: string;
    let value: string | undefined;
    let xref: string | undefined = prevXRef;

    if (level === 0) {
        prevXRef = undefined;
        if (parts[1] === "HEAD" || parts[1] === "TRLR") {
            // HEAD and TRLR special case
            tag = parts[1];
        } else {
            // INDI or FAM record start
            xref = prevXRef = parts[1];
            tag = parts[2];
            value = parts.slice(3).join(" ") || undefined;
        }
    } else {
        tag = parts[1];
        value = parts.slice(2).join(" ") || undefined;
    }

    nodes.push({ level, tag, value, xref });
}

const individualMap: Record<IndividualIdentifier, Individual> = {};
for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.level === 0 && node.tag === "INDI" && node.xref) {
        const individual: Individual = { _id: node.xref as IndividualIdentifier };
        const stack: Node[] = [];
        for (let j = i + 1; j < nodes.length; j++) {
            const childNode = nodes[j];
            if (childNode.level === 0) {
                break; // Next record
            }
            stack.push(childNode);
        }
        // extract individual
        const simpleTags = ["NAME", "GIVN", "SURN", "SEX"];
        for (const st of simpleTags) {
            (individual as any)[st] = stack.find((n) => n.tag === st)?.value;
        }

        const dateTags = ["BIRT", "DEAT"];
        for (const dt of dateTags) {
            const dateNodeIndex = stack.findIndex((n) => n.tag === dt);
            if (dateNodeIndex !== -1 && stack[dateNodeIndex + 1]?.tag === "DATE") {
                (individual as any)[dt] = fromGedcomDate(stack[dateNodeIndex + 1].value || "");
            }
        }

        const famTags = ["FAMC", "FAMS"];
        for (const ft of famTags) {
            const famNode = stack.find((n) => n.tag === ft);
            if (famNode?.value) {
                (individual as any)[ft] = famNode.value;
            }
        }

        individualMap[individual._id] = individual;
    }
}

// build families
const familyMap: Record<FamilyIdentifier, Family> = {};
for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.level === 0 && node.tag === "FAM" && node.xref) {
        const family: Family = { _id: node.xref as FamilyIdentifier };
        const stack: Node[] = [];
        for (let j = i + 1; j < nodes.length; j++) {
            const childNode = nodes[j];
            if (childNode.level === 0) {
                break; // Next record
            }
            stack.push(childNode);
        }
        // extract family
        const husbNode = stack.find((n) => n.tag === "HUSB");
        if (husbNode?.value) {
            family.HUSB = husbNode.value as IndividualIdentifier;
        }
        const wifeNode = stack.find((n) => n.tag === "WIFE");
        if (wifeNode?.value) {
            family.WIFE = wifeNode.value as IndividualIdentifier;
        }
        const childNodes = stack.filter((n) => n.tag === "CHIL");
        family.CHIL = childNodes.map((cn) => cn.value as IndividualIdentifier);

        familyMap[family._id] = family;
    }
}

for (const family of Object.values(familyMap)) {
    family.HUSB = individualMap[family.HUSB as IndividualIdentifier];
    family.WIFE = individualMap[family.WIFE as IndividualIdentifier];
    family.CHIL = (family.CHIL as IndividualIdentifier[]).map((cid) => individualMap[cid]);
}

for (const individual of Object.values(individualMap)) {
    if (individual.FAMC) {
        individual.FAMC = familyMap[individual.FAMC as FamilyIdentifier];
    }
    if (individual.FAMS) {
        individual.FAMS = familyMap[individual.FAMS as FamilyIdentifier];
    }
}

const gedcomData: GedcomData = {
    header: {
        GEDC: {
            FORM: "LINEAGE-LINKED",
            VERS: "5.5.1"
        },
        CHAR: "UTF-8",
        SOUR: "ursin-family",
        NAME: "ursin-family",
        AUTH: "Dan Ursin",
        SUBM: {
            _id: "@U_DAN_URSIN@",
            NAME: "Dan Ursin"
        }
    },
    families: Object.values(familyMap),
    individuals: Object.values(individualMap),
    trailer: "TRLR"
};

console.log(gedcomData);
