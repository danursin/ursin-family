"use client";

import { useEffect, useState } from "react";

import FamilyForm from "../FamilyForm";
import { IndividualItem } from "@/types";

export default function NewIndividualPage() {
    const [individuals, setIndividuals] = useState<IndividualItem[]>();

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/individuals");
            const data = (await response.json()) as IndividualItem[];
            setIndividuals(data);
        })();
    }, []);

    if (!individuals) {
        return <p>Loading...</p>;
    }
    return <FamilyForm mode="create" individuals={individuals} />;
}
