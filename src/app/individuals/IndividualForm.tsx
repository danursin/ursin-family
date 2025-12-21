"use client";

import type { Family, FamilyIdentifier, Individual } from "@/types";
import { useMemo, useState } from "react";

type Props = {
    mode: "create" | "edit";
    initial?: Individual;
    families: Family[];
};

export default function IndividualForm({ mode, initial, families }: Props) {
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        NAME: initial?.NAME ?? "",
        GIVN: initial?.GIVN ?? "",
        SURN: initial?.SURN ?? "",
        SEX: (initial?.SEX ?? "") as "" | "M" | "F",
        BIRT: initial?.BIRT ?? "",
        DEAT: initial?.DEAT ?? "",
        FAMC: (initial?.FAMC ?? "") as "" | FamilyIdentifier,
        FAMS: (initial?.FAMS ?? "") as "" | FamilyIdentifier
    });

    const title = useMemo(() => (mode === "create" ? "Create Individual" : `Edit Individual ${initial?._id}`), [mode, initial]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const payload = {
            NAME: form.NAME || undefined,
            GIVN: form.GIVN || undefined,
            SURN: form.SURN || undefined,
            SEX: (form.SEX || undefined) as Individual["SEX"],
            BIRT: form.BIRT || undefined,
            DEAT: form.DEAT || undefined,
            FAMC: form.FAMC || undefined,
            FAMS: form.FAMS || undefined
        };

        try {
            const url = mode === "create" ? "/api/individuals" : `/api/individuals/${encodeURIComponent(initial!._id)}`;

            const method = mode === "create" ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "content-type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data = (await res.json().catch(() => null)) as any;
                throw new Error(data?.error || `Request failed (${res.status})`);
            }

            const data = (await res.json()) as { individual: Individual };
            window.location.href = `/individuals/${encodeURIComponent(data.individual._id)}/edit`;
        } catch (err) {
            setError((err as Error)?.message ?? "Something went wrong");
        }
    }

    return (
        <div style={{ maxWidth: 720, margin: "20px auto", fontFamily: "system-ui, sans-serif" }}>
            <h1 style={{ marginBottom: 12 }}>{title}</h1>

            {error && <div style={{ padding: 10, border: "1px solid #ccc", marginBottom: 12 }}>{error}</div>}

            <form onSubmit={onSubmit}>
                <div style={{ display: "grid", gap: 10 }}>
                    <label>
                        Full Name (NAME)
                        <input
                            name="NAME"
                            value={form.NAME}
                            onChange={(e) => setForm({ ...form, NAME: e.target.value })}
                            style={{ display: "block", width: "100%", padding: 6 }}
                        />
                    </label>

                    <label>
                        Given (GIVN)
                        <input
                            name="GIVN"
                            value={form.GIVN}
                            onChange={(e) => setForm({ ...form, GIVN: e.target.value })}
                            style={{ display: "block", width: "100%", padding: 6 }}
                        />
                    </label>

                    <label>
                        Surname (SURN)
                        <input
                            name="SURN"
                            value={form.SURN}
                            onChange={(e) => setForm({ ...form, SURN: e.target.value })}
                            style={{ display: "block", width: "100%", padding: 6 }}
                        />
                    </label>

                    <label>
                        Sex
                        <select
                            name="SEX"
                            value={form.SEX}
                            onChange={(e) => setForm({ ...form, SEX: e.target.value as "M" | "F" })}
                            style={{ display: "block", width: "100%", padding: 6 }}
                        >
                            <option value="">(unset)</option>
                            <option value="M">M</option>
                            <option value="F">F</option>
                        </select>
                    </label>

                    <label>
                        Birth (YYYY-MM-DD)
                        <input
                            name="BIRT"
                            value={form.BIRT}
                            onChange={(e) => setForm({ ...form, BIRT: e.target.value })}
                            placeholder="YYYY-MM-DD"
                            style={{ display: "block", width: "100%", padding: 6 }}
                        />
                    </label>

                    <label>
                        Death (YYYY-MM-DD)
                        <input
                            name="DEAT"
                            value={form.DEAT}
                            onChange={(e) => setForm({ ...form, DEAT: e.target.value })}
                            placeholder="YYYY-MM-DD"
                            style={{ display: "block", width: "100%", padding: 6 }}
                        />
                    </label>

                    <label>
                        Child in Family (FAMC)
                        <select
                            name="FAMC"
                            value={form.FAMC}
                            onChange={(e) => setForm({ ...form, FAMC: e.target.value as FamilyIdentifier })}
                            style={{ display: "block", width: "100%", padding: 6 }}
                        >
                            <option value="">(none)</option>
                            {families.map((f) => (
                                <option key={f._id} value={f._id}>
                                    {f._id}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Spouse in Family (FAMS)
                        <select
                            name="FAMS"
                            value={form.FAMS}
                            onChange={(e) => setForm({ ...form, FAMS: e.target.value as FamilyIdentifier })}
                            style={{ display: "block", width: "100%", padding: 6 }}
                        >
                            <option value="">(none)</option>
                            {families.map((f) => (
                                <option key={f._id} value={f._id}>
                                    {f._id}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button type="submit" style={{ padding: 10 }}>
                        {mode === "create" ? "Create" : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}
