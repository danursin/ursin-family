"use client";

import * as React from "react";

import AddIcon from "@mui/icons-material/Add";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import GroupsIcon from "@mui/icons-material/Groups";
import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";

function useIsActive() {
    const pathname = usePathname();

    return React.useCallback(
        (href: string) => {
            if (href === "/") return pathname === "/";
            return pathname === href || pathname?.startsWith(href + "/");
        },
        [pathname]
    );
}

export default function AppNavbar() {
    const isActive = useIsActive();
    const [open, setOpen] = React.useState(false);

    const toggle = (next: boolean) => () => setOpen(next);

    return (
        <>
            <AppBar position="sticky" elevation={1} color="default">
                <Toolbar sx={{ gap: 1 }}>
                    {/* Mobile menu button */}
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={toggle(true)}
                        aria-label="Open navigation menu"
                        sx={{ display: { xs: "inline-flex", md: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Brand */}
                    <Typography
                        variant="h6"
                        component={Link}
                        href="/"
                        sx={{
                            color: "inherit",
                            textDecoration: "none",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: { xs: 190, sm: 280, md: "none" }
                        }}
                    >
                        Ursin Family Genealogy
                    </Typography>

                    <Box sx={{ flex: 1 }} />

                    {/* Desktop primary nav */}
                    <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
                        <Button
                            component={Link}
                            href="/"
                            color="inherit"
                            startIcon={<HomeIcon fontSize="small" />}
                            variant={isActive("/") ? "outlined" : "text"}
                        >
                            Home
                        </Button>
                        <Button
                            component={Link}
                            href="/families"
                            color="inherit"
                            startIcon={<GroupsIcon fontSize="small" />}
                            variant={isActive("/families") ? "outlined" : "text"}
                        >
                            Families
                        </Button>
                        <Button
                            component={Link}
                            href="/individuals"
                            color="inherit"
                            startIcon={<PersonIcon fontSize="small" />}
                            variant={isActive("/individuals") ? "outlined" : "text"}
                        >
                            Individuals
                        </Button>
                    </Stack>

                    {/* Desktop quick actions */}
                    <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
                        <Divider orientation="vertical" flexItem />
                        <Button
                            component={Link}
                            href="/families/new"
                            color="inherit"
                            startIcon={<AddIcon fontSize="small" />}
                            variant="contained"
                        >
                            Add Family
                        </Button>
                        <Button
                            component={Link}
                            href="/individuals/new"
                            color="inherit"
                            startIcon={<AddIcon fontSize="small" />}
                            variant="contained"
                        >
                            Add Individual
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* Mobile drawer */}
            <Drawer anchor="left" open={open} onClose={toggle(false)} PaperProps={{ sx: { width: 280 } }}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                        Navigation
                    </Typography>
                </Box>

                <List sx={{ pt: 0 }}>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="/" selected={isActive("/")} onClick={toggle(false)}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="/families" selected={isActive("/families")} onClick={toggle(false)}>
                            <ListItemIcon>
                                <GroupsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Families" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="/individuals" selected={isActive("/individuals")} onClick={toggle(false)}>
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Individuals" />
                        </ListItemButton>
                    </ListItem>

                    <Divider sx={{ my: 1 }} />

                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="/families/new" selected={isActive("/families/new")} onClick={toggle(false)}>
                            <ListItemIcon>
                                <AddIcon />
                            </ListItemIcon>
                            <ListItemText primary="Add Family" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton
                            component={Link}
                            href="/individuals/new"
                            selected={isActive("/individuals/new")}
                            onClick={toggle(false)}
                        >
                            <ListItemIcon>
                                <AddIcon />
                            </ListItemIcon>
                            <ListItemText primary="Add Individual" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
}
