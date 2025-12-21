"use client";

import { useEffect, useState } from "react";
import FamilyForm from "../../FamilyForm";
import { Family, Individual, type IndividualIdentifier } from "@/types";
import { useParams } from "next/navigation";

export default function EditIndividualPage() {
    const { id } = useParams<{ id: IndividualIdentifier }>();

    const [individuals, setIndividuals] = useState<Individual[]>();
    const [family, setFamily] = useState<Family>();

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/families/${id}`);
            const data = (await response.json()) as { family: Family };
            setFamily(data.family);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/individuals`);
            const data = (await response.json()) as { individuals: Individual[] };
            setIndividuals(data.individuals);
        })();
    }, []);

    if (!family || !individuals) {
        return <p>Loading...</p>;
    }

    return <FamilyForm mode="edit" initial={family} individuals={individuals} />;
}
