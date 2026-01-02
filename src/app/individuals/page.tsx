"use client";

import { useEffect, useMemo, useState } from "react";

import { IndividualItem } from "@/types";
import Link from "next/link";

function individualLabel(i: IndividualItem) {
    const name = (i.NAME || "").trim();
    if (name) return name;

    const givn = (i.GIVN || "").trim();
    const surn = (i.SURN || "").trim();

    const combined = [surn, givn].filter(Boolean).join(", ").trim();
    if (combined) return combined;

    return i.id;
}

export default function IndividualsIndexPage() {
    const [individuals, setIndividuals] = useState<IndividualItem[]>();

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/individuals");
            const data = (await response.json()) as IndividualItem[];
            setIndividuals(data);
        })();
    }, []);

    const sorted = useMemo(() => {
        if (!individuals) return [];
        return [...individuals].sort((a, b) => individualLabel(a).localeCompare(individualLabel(b), undefined, { sensitivity: "base" }));
    }, [individuals]);

    if (!individuals) {
        return <p>Loading...</p>;
    }

    return (
        <div style={{ maxWidth: 720, margin: "20px auto", fontFamily: "system-ui, sans-serif" }}>
            <h1 style={{ marginBottom: 12 }}>Individuals</h1>

            <div style={{ marginBottom: 12 }}>
                <Link href="/individuals/new">Create individual</Link>
            </div>

            {sorted.length === 0 ? (
                <p>No individuals yet.</p>
            ) : (
                <ul style={{ paddingLeft: 18 }}>
                    {sorted.map((i) => (
                        <li key={i.id} style={{ marginBottom: 6 }}>
                            <Link href={`/individuals/${encodeURIComponent(i.id)}/edit`}>{individualLabel(i)}</Link>{" "}
                            <span style={{ color: "#666" }}>{i.id}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
