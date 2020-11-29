export type Relation = "spouse";
export interface Person {
    id: number;
    gender: "M" | "F";
    first: string;
    middle?: string;
    last: string;
    maiden?: string;
    dob: string;
    relationIds?: { type: Relation; id: number }[];
    relations?: { type: Relation; person: Person }[];
    childrenIds?: number[];
    children?: Person[];
    fatherId?: number;
    father?: Person;
    motherId?: number;
    mother?: Person;
    level?: number;
}
