"use client";

import type { FamilyItem, IndividualIdentifier } from "@/types";
import { useContext, useMemo, useState } from "react";

import Alert from "@mui/material/Alert";
import { AppContext } from "../components/AppContextProvider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IndividualLink from "../components/IndividualLink";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useFamily from "../hooks/useFamily";
import { useRouter } from "next/navigation";
import { useToast } from "../components/ToastProvider";

type Props = {
    mode: "create" | "edit";
    initial?: FamilyItem;
};

export default function FamilyForm({ mode, initial }: Props) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();
    const { upsertFamily } = useContext(AppContext);
    const { getIndividuals, getFamilyName, getIndividualName } = useFamily();
    const individuals = getIndividuals();

    const [form, setForm] = useState({
        HUSB: (initial?.HUSB ?? "") as "" | IndividualIdentifier,
        WIFE: (initial?.WIFE ?? "") as "" | IndividualIdentifier,
        CHIL: (initial?.CHIL ?? []) as IndividualIdentifier[],
        MARR: initial?.MARR ?? "",
        DIV: initial?.DIV ?? ""
    });

    const title = useMemo(() => {
        if (mode === "create") return "Create Family";
        return `Edit Family ${getFamilyName(initial!.id)}`;
    }, [mode, getFamilyName, initial]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSaving(true);

        const payload: Partial<FamilyItem> = {
            HUSB: form.HUSB || undefined,
            WIFE: form.WIFE || undefined,
            CHIL: form.CHIL,
            MARR: form.MARR || undefined,
            DIV: form.DIV || undefined
        };

        try {
            const url = mode === "create" ? "/api/families" : `/api/families/${encodeURIComponent(initial!.id)}`;

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

            const data = (await res.json()) as FamilyItem;

            upsertFamily(data);

            showToast("Family updated successfully", "success");

            router.push(`/families/${encodeURIComponent(data.id)}/edit`);
            router.refresh();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {title}
                </Typography>

                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack>
                        {[initial?.HUSB, initial?.WIFE]
                            .filter((i) => Boolean(i))
                            .map((i) => (
                                <IndividualLink key={i!} id={i!} />
                            ))}
                    </Stack>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack component="form" spacing={2} onSubmit={onSubmit}>
                        {error && <Alert severity="error">{error}</Alert>}

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="Husband (HUSB)"
                                select
                                fullWidth
                                value={form.HUSB}
                                onChange={(e) => setForm((p) => ({ ...p, HUSB: e.target.value as "" | IndividualIdentifier }))}
                            >
                                <MenuItem value="">(unset)</MenuItem>
                                {(individuals ?? []).map((i) => (
                                    <MenuItem key={i.id} value={i.id}>
                                        {getIndividualName(i.id)}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Wife (WIFE)"
                                select
                                fullWidth
                                value={form.WIFE}
                                onChange={(e) => setForm((p) => ({ ...p, WIFE: e.target.value as "" | IndividualIdentifier }))}
                            >
                                <MenuItem value="">(unset)</MenuItem>
                                {(individuals ?? []).map((i) => (
                                    <MenuItem key={i.id} value={i.id}>
                                        {getIndividualName(i.id)}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                label="Marriage (MARR)"
                                type="date"
                                fullWidth
                                value={form.MARR}
                                onChange={(e) => setForm((p) => ({ ...p, MARR: e.target.value }))}
                                InputLabelProps={{ shrink: true }}
                            />

                            <TextField
                                label="Divorce (DIV)"
                                type="date"
                                fullWidth
                                value={form.DIV}
                                onChange={(e) => setForm((p) => ({ ...p, DIV: e.target.value }))}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Stack>

                        <Divider />

                        <Box>
                            <FormControl fullWidth>
                                <InputLabel id="chil-label">Children (CHIL)</InputLabel>
                                <Select
                                    labelId="chil-label"
                                    multiple
                                    value={form.CHIL}
                                    onChange={(e) => {
                                        const value = e.target.value as IndividualIdentifier[];
                                        setForm((p) => ({ ...p, CHIL: value }));
                                    }}
                                    input={<OutlinedInput label="Children (CHIL)" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                            {selected.map((id) => (
                                                <Chip key={id} label={getIndividualName(id) || id} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {(individuals ?? []).map((i) => (
                                        <MenuItem key={i.id} value={i.id}>
                                            {i.NAME}
                                        </MenuItem>
                                    ))}
                                </Select>

                                <FormHelperText>Select one or more individuals. Selected children appear as chips.</FormHelperText>
                            </FormControl>
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
