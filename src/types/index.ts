export interface User {
    id: UserIdentifier;
    NAME: string;
}

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
    individuals: IndividualItem[];
    families: FamilyItem[];
    trailer: GedcomTrailer;
}

export type ItemType = "FAMILY" | "INDIVIDUAL";
export interface DynamoDbItem {
    PK: string;
    SK: string;
    Type: ItemType;
    GSI1PK?: string;
    GSI1SK?: string;
}

export interface FamilyItem extends DynamoDbItem {
    PK: `FAMILY#${FamilyIdentifier}`;
    SK: "PROFILE";
    Type: "FAMILY";
    GSI1PK: "FAMILY";
    GSI1SK: FamilyIdentifier;
    id: FamilyIdentifier;
    HUSB?: IndividualIdentifier;
    WIFE?: IndividualIdentifier;
    CHIL?: IndividualIdentifier[];
    MARR?: string; // Marriage date in YYYY-MM-DD format
    DIV?: string; // Divorce date in YYYY-MM-DD format
}

export interface IndividualItem extends DynamoDbItem {
    PK: `INDIVIDUAL#${IndividualIdentifier}`;
    SK: "PROFILE";
    Type: "INDIVIDUAL";
    GSI1PK: "INDIVIDUAL";
    GSI1SK: IndividualIdentifier;
    id: IndividualIdentifier;
    /** Full name, surname wrapped in \/\/ */
    NAME?: string;
    GIVN?: string;
    SURN?: string;
    SEX?: "M" | "F";
    BIRT?: string; // Birth date in YYYY-MM-DD format
    DEAT?: string; // Death date in YYYY-MM-DD format
    FAMC?: FamilyIdentifier;
    FAMS?: FamilyIdentifier;
    OBJE?: MultimediaObject[];
}
