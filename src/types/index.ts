export interface User {
    _id: UserIdentifier;
    NAME: string;
}

export type Individual = {
    _id: IndividualIdentifier;
    /** Full name, surname wrapped in \/\/ */
    NAME?: string;
    GIVN?: string;
    SURN?: string;
    SEX?: "M" | "F";
    BIRT?: string; // Birth date in YYYY-MM-DD format
    DEAT?: string; // Death date in YYYY-MM-DD format
    FAMC?: FamilyIdentifier | Family;
    FAMS?: FamilyIdentifier | Family;
    OBJE?: MultimediaObject[];
};

export type Family = {
    _id: FamilyIdentifier;
    HUSB?: IndividualIdentifier | Individual;
    WIFE?: IndividualIdentifier | Individual;
    CHIL?: (IndividualIdentifier | Individual)[];
    MARR?: string; // Marriage date in YYYY-MM-DD format
    DIV?: string; // Divorce date in YYYY-MM-DD format
};

export interface MultimediaObject {
    FORM: MultimediaFormat;
    FILE: string;
}

export type MultimediaFormat = "url" | "jpg" | "jpeg" | "gif" | "png" | "tiff" | "avi" | "mpg" | "wav" | "pdf" | "doc" | "txt";
export type FamilyIdentifier = `@F_${string}@`;
export type IndividualIdentifier = `@I_${string}@`;
export type UserIdentifier = `@U_${string}@`;

export interface GedcomHeader {
    SOUR: "ursin-family";
    NAME: "ursin-family";
    AUTH: "Dan Ursin";
    SUBM: User;
    GEDC: {
        VERS: "5.5.1";
        FORM: "LINEAGE-LINKED";
    };
    CHAR: "UTF-8";
}

export type GedcomTrailer = "TRLR";

export interface GedcomData {
    header: GedcomHeader;
    individuals: Individual[];
    families: Family[];
    trailer: GedcomTrailer;
}
