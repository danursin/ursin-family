"use client";

import { useEffect, useState } from "react";

import FamilyForm from "../FamilyForm";
import { Individual } from "@/types";

export default function NewIndividualPage() {
    const [individuals, setIndividuals] = useState<Individual[]>();

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/individuals");
            const data = (await response.json()) as { individuals: Individual[] };
            setIndividuals(data.individuals);
        })();
    }, []);

    if (!individuals) {
        return <p>Loading...</p>;
    }
    return <FamilyForm mode="create" individuals={individuals} />;
}
