"use client";

import { useEffect, useState } from "react";

import { Family } from "@/types";
import IndividualForm from "../IndividualForm";

export default function NewIndividualPage() {
    const [families, setFamilies] = useState<Family[]>();

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/families");
            const data = (await response.json()) as { families: Family[] };
            setFamilies(data.families);
        })();
    }, []);

    if (!families) {
        return <p>Loading...</p>;
    }
    return <IndividualForm mode="create" families={families} />;
}
