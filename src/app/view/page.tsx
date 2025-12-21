"use client";

import { useEffect, useState } from "react";

export default function View() {
    const [gedcomData, setGedcomData] = useState<string>();

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/gedcom");
            const data = await response.text();
            setGedcomData(data);
        })();
    }, []);

    if (!gedcomData) {
        return <p>Fetching...</p>;
    }

    return <pre>{gedcomData}</pre>;
}
