export interface Person {
    id: number;
    gender: "M" | "F";
    first: string;
    middle?: string;
    last: string;
    maiden?: string;
    dob: string;
    relations?: { type: "spouse"; id: number }[];
    children?: number[];
    father?: number;
    mother?: number;
}
