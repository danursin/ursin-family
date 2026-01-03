"use client";

import * as React from "react";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useFamily from "../hooks/useFamily";

export default function FamiliesIndexPage() {
    const { getFamilies, getIndividual } = useFamily();

    const families = getFamilies();

    const [query, setQuery] = React.useState("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    React.useEffect(() => {
        setPage(0);
    }, [query]);

    const start = page * rowsPerPage;
    const filtered =
        families?.filter((f) => {
            const husband = f.HUSB && getIndividual(f.HUSB);
            const wife = f.WIFE && getIndividual(f.WIFE);
            if (
                (husband && husband.NAME?.toLowerCase().includes(query.toLowerCase())) ||
                (wife && wife.NAME?.toLowerCase().includes(query.toLowerCase()))
            ) {
                return true;
            }
            return false;
        }) ?? [];
    const pageRows = filtered.slice(start, start + rowsPerPage);

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Stack spacing={2}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    justifyContent="space-between"
                >
                    <div>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            Families
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {filtered.length} family record(s)
                        </Typography>
                    </div>

                    <Button component={Link} href="/families/new" variant="contained" startIcon={<AddIcon />} sx={{ whiteSpace: "nowrap" }}>
                        Add family
                    </Button>
                </Stack>

                <Paper variant="outlined" sx={{ p: 2 }}>
                    <TextField
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Quick search by spouse name or family id"
                        fullWidth
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            )
                        }}
                    />
                </Paper>

                <Paper variant="outlined">
                    <TableContainer>
                        <Table size="small" aria-label="Families table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Husband</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Wife</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Children</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }} align="right">
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {pageRows.map((f) => {
                                    const husband = f.HUSB && getIndividual(f.HUSB)?.NAME;
                                    const wife = f.WIFE && getIndividual(f.WIFE)?.NAME;
                                    const href = `/families/${encodeURIComponent(f.id)}/edit`;
                                    const children = f.CHIL?.map((c) => {
                                        const individual = getIndividual(c);
                                        return (
                                            <Button
                                                key={c}
                                                sx={{
                                                    display: "block"
                                                }}
                                                component={Link}
                                                href={`/individuals/${encodeURIComponent(c)}/edit`}
                                                size="small"
                                                variant="text"
                                            >
                                                {individual.NAME}
                                            </Button>
                                        );
                                    });

                                    return (
                                        <TableRow key={f.id} hover>
                                            <TableCell>{husband}</TableCell>
                                            <TableCell>{wife}</TableCell>
                                            <TableCell>{children}</TableCell>
                                            <TableCell align="right">
                                                <Button component={Link} href={href} size="small" variant="text">
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={filtered.length}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => {
                            const next = parseInt(e.target.value, 10);
                            setRowsPerPage(next);
                            setPage(0);
                        }}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                    />
                </Paper>
            </Stack>
        </Container>
    );
}
