"use client";

import { FamilyIdentifier, FamilyItem, IndividualIdentifier, IndividualItem } from "@/types";
import { useCallback, useEffect, useState } from "react";

import Link from "next/link";

export default function FamiliesIndexPage() {
    const [families, setFamilies] = useState<FamilyItem[]>();
    const [individuals, setIndividuals] = useState<IndividualItem[]>();

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/families");
            const data = (await response.json()) as FamilyItem[];
            setFamilies(data);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/individuals");
            const data = (await response.json()) as IndividualItem[];
            setIndividuals(data);
        })();
    }, []);

    const getFamilyById = useCallback(
        (id: FamilyIdentifier): FamilyItem => {
            if (!families) {
                throw new Error("No families yet");
            }
            const family = families.find((f) => f.id === id) as FamilyItem;
            return family;
        },
        [families]
    );

    const getIndividualById = useCallback(
        (id: IndividualIdentifier): IndividualItem => {
            if (!individuals) {
                throw new Error("No individuals yet");
            }
            const individual = individuals.find((f) => f.id === id) as IndividualItem;
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
                            <li key={f.id} style={{ marginBottom: 6 }}>
                                <Link href={`/families/${encodeURIComponent(f.id)}/edit`}>
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
