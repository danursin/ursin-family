import AppContextProvider from "./components/AppContextProvider";
import AppNavbar from "@/app/components/AppNavbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import type { Metadata } from "next";
import MuiRegistry from "./mui-registry";
import { ToastProvider } from "./components/ToastProvider";

export const metadata: Metadata = {
    title: "Ursin Family Genealogy",
    description: "Ursin Family Genealogy Website"
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <MuiRegistry>
                    <AppContextProvider>
                        <ToastProvider>
                            <AppNavbar />
                            <Container maxWidth="lg">
                                <Box sx={{ py: 3 }}>{children}</Box>
                            </Container>
                        </ToastProvider>
                    </AppContextProvider>
                </MuiRegistry>
            </body>
        </html>
    );
}
