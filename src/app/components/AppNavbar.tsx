"use client";

import * as React from "react";

import AddIcon from "@mui/icons-material/Add";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";

type NavItem = {
    label: string;
    href: string;
};

const primaryNav: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Families", href: "/families" },
    { label: "Individuals", href: "/individuals" }
];

const quickAddNav: NavItem[] = [
    { label: "Add Family", href: "/families/new" },
    { label: "Add Individual", href: "/individuals/new" }
];

export default function AppNavbar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname === href || pathname?.startsWith(href + "/");
    };

    return (
        <AppBar position="static" elevation={1} color="default">
            <Toolbar sx={{ gap: 2 }}>
                <Typography variant="h6" component={Link} href="/" sx={{ color: "inherit", textDecoration: "none", fontWeight: 600 }}>
                    Ursin Family Genealogy
                </Typography>

                <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                    {primaryNav.map((item) => (
                        <Button
                            key={item.href}
                            component={Link}
                            href={item.href}
                            color="inherit"
                            variant={isActive(item.href) ? "outlined" : "text"}
                            sx={{
                                borderColor: "rgba(255,255,255,0.6)",
                                ...(isActive(item.href) && { backgroundColor: "rgba(255,255,255,0.08)" })
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Stack>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ borderColor: "rgba(255,255,255,0.35)", display: { xs: "none", sm: "block" } }}
                    />
                    {quickAddNav.map((item) => (
                        <Button
                            key={item.href}
                            component={Link}
                            href={item.href}
                            color="inherit"
                            startIcon={<AddIcon />}
                            variant="contained"
                            sx={{
                                backgroundColor: "rgba(255,255,255,0.18)",
                                "&:hover": { backgroundColor: "rgba(255,255,255,0.28)" }
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
