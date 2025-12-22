"use client";

import type { Family, Individual, IndividualIdentifier } from "@/types";
import { useMemo, useState } from "react";

type Props = {
    mode: "create" | "edit";
    initial?: Family;
    individuals: Individual[];
};

export default function FamilyForm({ mode, initial, individuals }: Props) {
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        HUSB: (initial?.HUSB ?? "") as "" | IndividualIdentifier,
        WIFE: (initial?.WIFE ?? "") as "" | IndividualIdentifier,
        CHIL: (initial?.CHIL ?? []) as IndividualIdentifier[],
        MARR: initial?.MARR ?? "",
        DIV: initial?.DIV ?? ""
    });

    const title = useMemo(() => (mode === "create" ? "Create Family" : `Edit Family ${initial?._id}`), [mode, initial]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const payload: Partial<Family> = {
            HUSB: form.HUSB || undefined,
            WIFE: form.WIFE || undefined,
            CHIL: form.CHIL,
            MARR: form.MARR || undefined,
            DIV: form.DIV || undefined
        };

        try {
            const url = mode === "create" ? "/api/families" : `/api/families/${encodeURIComponent(initial!._id)}`;

            const method = mode === "create" ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "content-type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = (await res.json()) as { family: Family };
            window.location.href = `/families/${encodeURIComponent(data.family._id)}/edit`;
        } catch {
            setError("Something went wrong");
        }
    }

    return (
        <div style={{ maxWidth: 720, margin: "20px auto", fontFamily: "system-ui, sans-serif" }}>
            <h1 style={{ marginBottom: 12 }}>{title}</h1>

            {error && <div style={{ padding: 10, border: "1px solid #ccc", marginBottom: 12 }}>{error}</div>}

            <form onSubmit={onSubmit}>
                <div style={{ display: "grid", gap: 10 }}>
                    <label>
                        Husband (HUSB)
                        <select
                            value={form.HUSB}
                            onChange={(e) => setForm({ ...form, HUSB: e.target.value as IndividualIdentifier })}
                            style={{ display: "block", width: "100%", padding: 6 }}
                        >
                            <option value="">(unset)</option>
                            {individuals.map((i) => (
                                <option key={i._id} value={i._id}>
                                    {i.NAME}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Wife (WIFE)
                        <select
                            value={form.WIFE}
                            onChange={(e) => setForm({ ...form, WIFE: e.target.value as IndividualIdentifier })}
                            style={{ display: "block", width: "100%", padding: 6 }}
                        >
                            <option value="">(unset)</option>
                            {individuals.map((i) => (
                                <option key={i._id} value={i._id}>
                                    {i.NAME}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Marriage (YYYY-MM-DD)
                        <input
                            value={form.MARR}
                            type="date"
                            onChange={(e) => setForm({ ...form, MARR: e.target.value })}
                            placeholder="YYYY-MM-DD"
                            style={{ display: "block", width: "100%", padding: 6 }}
                        />
                    </label>

                    <label>
                        Divorce (YYYY-MM-DD)
                        <input
                            value={form.DIV}
                            type="date"
                            onChange={(e) => setForm({ ...form, DIV: e.target.value })}
                            placeholder="YYYY-MM-DD"
                            style={{ display: "block", width: "100%", padding: 6 }}
                        />
                    </label>

                    <fieldset style={{ padding: 10 }}>
                        <legend>Children (CHIL)</legend>

                        <select
                            multiple
                            size={Math.min(10, individuals.length)}
                            value={form.CHIL}
                            onChange={(e) => {
                                const selected = Array.from(e.currentTarget.selectedOptions).map(
                                    (opt) => opt.value as IndividualIdentifier
                                );

                                setForm({ ...form, CHIL: selected });
                            }}
                            style={{ width: "100%", padding: 6 }}
                        >
                            {individuals.map((i) => (
                                <option key={i._id} value={i._id}>
                                    {i.NAME}
                                </option>
                            ))}
                        </select>
                    </fieldset>

                    <button type="submit" style={{ padding: 10 }}>
                        {mode === "create" ? "Create" : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}
