import type { Metadata } from "next";

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
            <body>{children}</body>
        </html>
    );
}
