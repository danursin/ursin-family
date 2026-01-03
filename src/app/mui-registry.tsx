/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";

import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import createCache from "@emotion/cache";
import { theme } from "@/theme";
import { useServerInsertedHTML } from "next/navigation";

function createEmotionCache() {
    return createCache({ key: "mui", prepend: true });
}

export default function MuiRegistry({ children }: { children: React.ReactNode }) {
    const [cache] = React.useState(() => {
        const c = createEmotionCache();
        (c as any).compat = true;
        return c;
    });

    useServerInsertedHTML(() => {
        const styles = (cache as any).inserted;
        const names = Object.keys(styles);

        if (names.length === 0) return null;

        let css = "";
        for (const name of names) css += styles[name];

        return <style data-emotion={`${cache.key} ${names.join(" ")}`} dangerouslySetInnerHTML={{ __html: css }} />;
    });

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}
