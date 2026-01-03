"use client";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FamilyLink from "../components/FamilyLink";
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
    const { getFamilies } = useFamily();

    const families = getFamilies();

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
                            {families.length} family record(s)
                        </Typography>
                    </div>

                    <Button component={Link} href="/families/new" variant="contained" startIcon={<AddIcon />} sx={{ whiteSpace: "nowrap" }}>
                        Add family
                    </Button>
                </Stack>

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
                                {families.map((f) => {
                                    return (
                                        <TableRow key={f.id} hover>
                                            <TableCell>{f.HUSB && <IndividualLink id={f.HUSB} />}</TableCell>
                                            <TableCell>{f.WIFE && <IndividualLink id={f.WIFE} />}</TableCell>
                                            <TableCell>
                                                {f.CHIL?.map((c) => (
                                                    <IndividualLink id={c} key={c} sx={{ display: "block" }} />
                                                ))}
                                            </TableCell>
                                            <TableCell align="right">
                                                <FamilyLink id={f.id} text="Edit" />
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
