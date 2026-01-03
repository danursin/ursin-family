"use client";

import { Box, CircularProgress } from "@mui/material";
import { FamilyItem, IndividualItem } from "@/types";
import { ReactNode, createContext, useEffect, useState } from "react";

interface AppContextProps {
    families: FamilyItem[];
    individuals: IndividualItem[];
}

export const AppContext = createContext<AppContextProps>({
    families: [],
    individuals: []
});

const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [families, setFamilies] = useState<FamilyItem[]>();
    const [individuals, setIndividuals] = useState<IndividualItem[]>();

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/families");
            const data = (await response.json()) as FamilyItem[];
            setFamilies(data);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/individuals");
            const data = (await response.json()) as IndividualItem[];
            setIndividuals(data);
        })();
    }, []);

    if (!families || !individuals) {
        return (
            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return <AppContext.Provider value={{ families, individuals }}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
