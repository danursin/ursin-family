"use client";

import { useEffect, useState } from "react";

import { FamilyItem } from "@/types";
import IndividualForm from "../IndividualForm";

export default function NewIndividualPage() {
    const [families, setFamilies] = useState<FamilyItem[]>();

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/families");
            const data = (await response.json()) as FamilyItem[];
            setFamilies(data);
        })();
    }, []);

    if (!families) {
        return <p>Loading...</p>;
    }
    return <IndividualForm mode="create" families={families} />;
}
