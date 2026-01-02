"use client";

import { useEffect, useState } from "react";
import IndividualForm from "../../IndividualForm";
import { FamilyItem, IndividualItem, type IndividualIdentifier } from "@/types";
import { useParams } from "next/navigation";

export default function EditIndividualPage() {
    const { id } = useParams<{ id: IndividualIdentifier }>();

    const [individual, setIndividual] = useState<IndividualItem>();
    const [families, setFamilies] = useState<FamilyItem[]>();

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/individuals/${id}`);
            const data = (await response.json()) as IndividualItem;
            setIndividual(data);
        })();
    }, [id]);

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/families`);
            const data = (await response.json()) as FamilyItem[];
            setFamilies(data);
        })();
    }, []);

    if (!individual || !families) {
        return <p>Loading...</p>;
    }

    return <IndividualForm mode="edit" initial={individual} families={families} />;
}
