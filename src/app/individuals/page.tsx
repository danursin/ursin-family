"use client";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IndividualLink from "../components/IndividualLink";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useFamily from "../hooks/useFamily";

export default function FamiliesIndexPage() {
    const { getIndividuals } = useFamily();

    const individuals = getIndividuals();

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
                            Individuals
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {individuals.length} Individual record(s)
                        </Typography>
                    </div>

                    <Button
                        component={Link}
                        href="/individuals/new"
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ whiteSpace: "nowrap" }}
                    >
                        Add individual
                    </Button>
                </Stack>

                <Paper variant="outlined">
                    <TableContainer>
                        <Table size="small" aria-label="Individuals table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>DOB</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>DOD</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }} align="right">
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {individuals.map((i) => {
                                    return (
                                        <TableRow key={i.id} hover>
                                            <TableCell>
                                                <IndividualLink id={i.id} />
                                            </TableCell>
                                            <TableCell>{i.BIRT}</TableCell>
                                            <TableCell>{i.DEAT}</TableCell>
                                            <TableCell align="right">
                                                <IndividualLink id={i.id} text="Edit" />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Stack>
        </Container>
    );
}
