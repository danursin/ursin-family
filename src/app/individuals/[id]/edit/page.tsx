"use client";

import { useEffect, useState } from "react";
import IndividualForm from "../../IndividualForm";
import { Family, Individual, type IndividualIdentifier } from "@/types";
import { useParams } from "next/navigation";

export default function EditIndividualPage() {
    const { id } = useParams<{ id: IndividualIdentifier }>();

    const [individual, setIndividual] = useState<Individual>();
    const [families, setFamilies] = useState<Family[]>();

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/individuals/${id}`);
            const data = (await response.json()) as { individual: Individual };
            setIndividual(data.individual);
        })();
    }, [id]);

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/families`);
            const data = (await response.json()) as { families: Family[] };
            setFamilies(data.families);
        })();
    }, []);

    if (!individual || !families) {
        return <p>Loading...</p>;
    }

    return <IndividualForm mode="edit" initial={individual} families={families} />;
}
