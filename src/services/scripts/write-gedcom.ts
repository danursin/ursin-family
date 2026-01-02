import type { GedcomData, IndividualItem } from "../../types/index.js";

function toGedcomDate(dateStr: string): string {
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const [year, month, day] = dateStr.split("-").map(Number);
    const dateParts: (string | number)[] = [year.toString().padStart(4, "0")];
    if (!isNaN(month)) {
        dateParts.push(monthNames[month - 1]);
    }
    if (!isNaN(day)) {
        dateParts.push(day.toString().padStart(2, "0"));
    }
    return dateParts.join(" ");
}

export function toGedcomString(gedcom: GedcomData): string {
    const lines: string[] = [];

    // Header
    lines.push("0 HEAD");
    lines.push("1 GEDC");
    lines.push(`2 VERS ${gedcom.header.GEDC.VERS}`);
    lines.push(`2 FORM ${gedcom.header.GEDC.FORM}`);
    lines.push(`1 CHAR ${gedcom.header.CHAR}`);
    lines.push(`1 SOUR ${gedcom.header.SOUR}`);
    lines.push(`2 NAME ${gedcom.header.NAME}`);

    lines.push(`1 SUBM ${gedcom.header.SUBM.id}`);

    lines.push(`0 ${gedcom.header.SUBM.id} SUBM`);
    lines.push(`1 NAME ${gedcom.header.SUBM.NAME}`);

    // Individuals
    for (const individual of gedcom.individuals) {
        lines.push(`0 ${individual.id} INDI`);

        // Top level individual properties
        const { NAME, SURN, GIVN, SEX } = individual as IndividualItem;
        lines.push(`1 NAME ${NAME}`);
        if (GIVN) {
            lines.push(`2 GIVN ${GIVN}`);
        }
        if (SURN) {
            lines.push(`2 SURN ${SURN}`);
        }
        if (SEX) {
            lines.push(`1 SEX ${SEX}`);
        }

        // Date properties
        const dateProperties: (keyof IndividualItem)[] = ["BIRT", "DEAT"];
        for (const prop of dateProperties) {
            const value = individual[prop] as string | undefined;
            if (value) {
                const formattedDate = toGedcomDate(value);
                lines.push(`1 ${prop}`);
                lines.push(`2 DATE ${formattedDate}`);
            }
        }

        // Family connection
        const fams = gedcom.families.filter((fam) => fam.HUSB === individual.id || fam.WIFE === individual.id);
        for (const fam of fams) {
            lines.push(`1 FAMS ${fam.id}`);
        }

        const famc = gedcom.families.find((fam) => fam.CHIL?.includes(individual.id));
        if (famc) {
            lines.push(`1 FAMC ${famc.id}`);
        }
    }

    // Families
    for (const family of gedcom.families) {
        lines.push(`0 ${family.id} FAM`);

        if (family.HUSB) {
            lines.push(`1 HUSB ${family.HUSB}`);
        }
        if (family.WIFE) {
            lines.push(`1 WIFE ${family.WIFE}`);
        }
        if (family.CHIL) {
            for (const child of family.CHIL) {
                lines.push(`1 CHIL ${child}`);
            }
        }
        if (family.MARR) {
            const formattedDate = toGedcomDate(family.MARR);
            lines.push(`1 MARR`);
            lines.push(`2 DATE ${formattedDate}`);
        }
        if (family.DIV) {
            const formattedDate = toGedcomDate(family.DIV);
            lines.push(`1 DIV`);
            lines.push(`2 DATE ${formattedDate}`);
        }
    }

    // Trailer
    lines.push(`0 TRLR`);

    return lines.join("\n") + "\n";
}

export default toGedcomString;
