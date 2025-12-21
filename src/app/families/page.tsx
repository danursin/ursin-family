"use client";

import { Family, FamilyIdentifier, Individual, IndividualIdentifier } from "@/types";
import { useCallback, useEffect, useState } from "react";

import Link from "next/link";

export default function FamiliesIndexPage() {
    const [families, setFamilies] = useState<Family[]>();
    const [individuals, setIndividuals] = useState<Individual[]>();

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/families");
            const data = (await response.json()) as { families: Family[] };
            setFamilies(data.families);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/individuals");
            const data = (await response.json()) as { individuals: Individual[] };
            setIndividuals(data.individuals);
        })();
    }, []);

    const getFamilyById = useCallback(
        (id: FamilyIdentifier): Family => {
            if (!families) {
                throw new Error("No families yet");
            }
            const family = families.find((f) => f._id === id) as Family;
            return family;
        },
        [families]
    );

    const getIndividualById = useCallback(
        (id: IndividualIdentifier): Individual => {
            if (!individuals) {
                throw new Error("No individuals yet");
            }
            const individual = individuals.find((f) => f._id === id) as Individual;
            return individual;
        },
        [individuals]
    );

    if (!families || !individuals) {
        return <p>Loading...</p>;
    }

    return (
        <div style={{ maxWidth: 720, margin: "20px auto", fontFamily: "system-ui, sans-serif" }}>
            <h1 style={{ marginBottom: 12 }}>Families</h1>

            <div style={{ marginBottom: 12 }}>
                <Link href="/families/new">Create family</Link>
            </div>

            {families.length === 0 ? (
                <p>No families yet.</p>
            ) : (
                <ul style={{ paddingLeft: 18 }}>
                    {families.map((f) => {
                        const husband = f.HUSB && getIndividualById(f.HUSB);
                        const wife = f.WIFE && getIndividualById(f.WIFE);
                        return (
                            <li key={f._id} style={{ marginBottom: 6 }}>
                                <Link href={`/families/${encodeURIComponent(f._id)}/edit`}>
                                    {husband?.GIVN} & {wife?.GIVN} {husband?.SURN}
                                </Link>{" "}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
