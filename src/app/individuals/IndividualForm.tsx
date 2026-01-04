"use client";

import { useContext, useMemo, useState } from "react";

import { AppContext } from "../components/AppContextProvider";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FamilyLink from "../components/FamilyLink";
import type { IndividualItem } from "@/types";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useFamily from "../hooks/useFamily";
import { useRouter } from "next/navigation";
import { useToast } from "../components/ToastProvider";

type Props = {
    mode: "create" | "edit";
    initial?: IndividualItem;
};

type Sex = "" | "M" | "F";

export default function IndividualForm({ mode, initial }: Props) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    const { upsertIndividual } = useContext(AppContext);
    const { getIndividualName, getFamiliesWhereSpouse, getFamilyWhereChild } = useFamily();

    const [form, setForm] = useState({
        NAME: initial?.NAME ?? "",
        GIVN: initial?.GIVN ?? "",
        SURN: initial?.SURN ?? "",
        SEX: (initial?.SEX ?? "") as Sex,
        BIRT: initial?.BIRT ?? "",
        DEAT: initial?.DEAT ?? ""
    });

    const familyWhereChild = useMemo(() => initial?.id && getFamilyWhereChild(initial?.id), [getFamilyWhereChild, initial?.id]);
    const familiesWhereSpouse = useMemo(() => initial?.id && getFamiliesWhereSpouse(initial?.id), [getFamiliesWhereSpouse, initial?.id]);

    const title = useMemo(() => {
        return mode === "create" ? "Create Individual" : `Edit Individual ${getIndividualName(initial!.id)}`;
    }, [mode, getIndividualName, initial]);

    const onChange =
        <K extends keyof typeof form>(key: K) =>
        (value: (typeof form)[K]) => {
            setForm((prev) => ({ ...prev, [key]: value }));
        };

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const payload = {
            NAME: form.NAME || undefined,
            GIVN: form.GIVN || undefined,
            SURN: form.SURN || undefined,
            SEX: form.SEX || undefined,
            BIRT: form.BIRT || undefined,
            DEAT: form.DEAT || undefined
        };

        try {
            const url = mode === "create" ? "/api/individuals" : `/api/individuals/${encodeURIComponent(initial!.id)}`;

            const method = mode === "create" ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "content-type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = (await res.json().catch(() => null)) as { error?: string } | null;
                throw new Error(data?.error || `Request failed (${res.status})`);
            }

            const data = (await res.json()) as IndividualItem;

            upsertIndividual(data);

            showToast("Individual updated successfully", "success");

            // navigate without full reload
            router.push(`/individuals/${encodeURIComponent(data.id)}/edit`);
            router.refresh();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong";
            showToast(message, "error");
        } finally {
            setSaving(false);
        }
    }

    const setNameParts = () => {
        const parts = form.NAME?.split(/\s/g);
        let SURN = form.SURN;
        let GIVN = form.GIVN;
        if (parts.length > 1) {
            SURN = (parts.pop() ?? "").replaceAll("/", "");
        }
        GIVN = parts.join(" ");
        setForm((existing) => ({
            ...existing,
            SURN,
            GIVN
        }));
    };

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {title}
                </Typography>

                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack component="form" spacing={2} onSubmit={onSubmit}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="Full Name (NAME)"
                                value={form.NAME}
                                onChange={(e) => onChange("NAME")(e.target.value)}
                                onBlur={setNameParts}
                                fullWidth
                            />

                            <TextField
                                label="Sex"
                                value={form.SEX}
                                onChange={(e) => onChange("SEX")(e.target.value as Sex)}
                                select
                                slotProps={{
                                    select: {
                                        native: true
                                    }
                                }}
                                sx={{ minWidth: 160 }}
                            >
                                <option value=""></option>
                                <option value="M">M</option>
                                <option value="F">F</option>
                            </TextField>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="Given (GIVN)"
                                value={form.GIVN}
                                onChange={(e) => onChange("GIVN")(e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Surname (SURN)"
                                value={form.SURN}
                                onChange={(e) => onChange("SURN")(e.target.value)}
                                fullWidth
                            />
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="Birth (YYYY-MM-DD)"
                                value={form.BIRT}
                                onChange={(e) => onChange("BIRT")(e.target.value)}
                                placeholder="YYYY-MM-DD"
                                fullWidth
                            />
                            <TextField
                                label="Death (YYYY-MM-DD)"
                                value={form.DEAT}
                                onChange={(e) => onChange("DEAT")(e.target.value)}
                                placeholder="YYYY-MM-DD"
                                fullWidth
                            />
                        </Stack>

                        <Divider />

                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            Family links
                        </Typography>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                gap: 2
                            }}
                        >
                            <Stack spacing={0.5}>
                                <Typography variant="caption" color="text.secondary">
                                    Child in family
                                </Typography>

                                {familyWhereChild ? (
                                    <FamilyLink id={familyWhereChild.id} />
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No family linked
                                    </Typography>
                                )}
                            </Stack>

                            <Stack spacing={0.5}>
                                <Typography variant="caption" color="text.secondary">
                                    Spouse in family
                                </Typography>

                                {familiesWhereSpouse && familiesWhereSpouse.length > 0 ? (
                                    <Stack spacing={0.5}>
                                        {familiesWhereSpouse.map((f) => (
                                            <FamilyLink key={f.id} id={f.id} />
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No spouse linked
                                    </Typography>
                                )}
                            </Stack>
                        </Box>

                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button variant="outlined" onClick={() => router.back()} disabled={saving}>
                                Cancel
                            </Button>

                            <Button type="submit" variant="contained" disabled={saving}>
                                {mode === "create" ? "Create" : "Save"}
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    );
}
