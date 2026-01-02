"use client";

import { useEffect, useState } from "react";
import FamilyForm from "../../FamilyForm";
import { FamilyItem, IndividualItem, type IndividualIdentifier } from "@/types";
import { useParams } from "next/navigation";

export default function EditIndividualPage() {
    const { id } = useParams<{ id: IndividualIdentifier }>();

    const [individuals, setIndividuals] = useState<IndividualItem[]>();
    const [family, setFamily] = useState<FamilyItem>();

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/families/${id}`);
            const data = (await response.json()) as FamilyItem;
            setFamily(data);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const response = await fetch(`/api/individuals`);
            const data = (await response.json()) as IndividualItem[];
            setIndividuals(data);
        })();
    }, []);

    if (!family || !individuals) {
        return <p>Loading...</p>;
    }

    return <FamilyForm mode="edit" initial={family} individuals={individuals} />;
}
