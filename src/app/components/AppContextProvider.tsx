"use client";

import { Box, CircularProgress } from "@mui/material";
import { FamilyItem, IndividualItem } from "@/types";
import { ReactNode, createContext, useCallback, useEffect, useState } from "react";

interface AppContextProps {
    families: FamilyItem[];
    individuals: IndividualItem[];
    upsertIndividual: (item: IndividualItem) => IndividualItem;
    upsertFamily: (item: FamilyItem) => FamilyItem;
}

export const AppContext = createContext<AppContextProps>({
    families: [],
    individuals: [],
    upsertIndividual: () => {
        throw new Error();
    },
    upsertFamily: () => {
        throw new Error();
    }
});

const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [families, setFamilies] = useState<FamilyItem[]>();
    const [individuals, setIndividuals] = useState<IndividualItem[]>();

    useEffect(() => {
        (async () => {
            const individualsResponse = await fetch("/api/individuals");
            const individualsData = (await individualsResponse.json()) as IndividualItem[];
            const individualsSorted = individualsData.sort((a, b) => {
                const s = (a.SURN ?? "").localeCompare(b.SURN ?? "");
                if (s !== 0) return s;
                return (a.GIVN ?? "").localeCompare(b.GIVN ?? "");
            });
            setIndividuals(individualsSorted);

            const familiesResponse = await fetch("/api/families");
            const familiesData = (await familiesResponse.json()) as FamilyItem[];
            const familiesSorted = familiesData.sort((a, b) => {
                const ha = a.HUSB && individualsData.find((i) => i.id === a.HUSB);
                const hb = b.HUSB && individualsData.find((i) => i.id === b.HUSB);

                const wa = a.WIFE && individualsData.find((i) => i.id === a.WIFE);
                const wb = b.WIFE && individualsData.find((i) => i.id === b.WIFE);

                const surnameA = ha?.SURN ?? wa?.SURN ?? "";
                const surnameB = hb?.SURN ?? wb?.SURN ?? "";

                const s = surnameA.localeCompare(surnameB);
                if (s !== 0) return s;

                const givenA = ha?.GIVN ?? wa?.GIVN ?? "";
                const givenB = hb?.GIVN ?? wb?.GIVN ?? "";

                return givenA.localeCompare(givenB);
            });
            setFamilies(familiesSorted);
        })();
    }, []);

    const upsertIndividual = useCallback((individual: IndividualItem) => {
        let returnValue: IndividualItem | undefined;
        setIndividuals((current) => {
            const newList = current ? [...current] : [];
            const existingIndex = newList.findIndex((i) => i.id === individual.id);
            if (existingIndex === -1) {
                newList.push(individual);
                returnValue = individual;
            } else {
                const updated = {
                    ...newList[existingIndex],
                    ...individual
                };
                newList[existingIndex] = updated;
                returnValue = updated;
            }
            return newList;
        });
        return returnValue as IndividualItem;
    }, []);

    const upsertFamily = useCallback((family: FamilyItem) => {
        let returnValue: FamilyItem | undefined;
        setFamilies((current) => {
            const newList = current ? [...current] : [];
            const existingIndex = newList.findIndex((i) => i.id === family.id);
            if (existingIndex === -1) {
                newList.push(family);
                returnValue = family;
            } else {
                const updated = {
                    ...newList[existingIndex],
                    ...family
                };
                newList[existingIndex] = updated;
                returnValue = updated;
            }
            return newList;
        });
        return returnValue as FamilyItem;
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

    return <AppContext.Provider value={{ families, individuals, upsertFamily, upsertIndividual }}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
