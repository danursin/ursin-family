import { FamilyIdentifier, FamilyItem, IndividualIdentifier, IndividualItem } from "@/types";
import { useCallback, useContext, useMemo } from "react";

import { AppContext } from "../components/AppContextProvider";

type UseFamilyProps = {
    getIndividual: (id: IndividualIdentifier) => IndividualItem;
    getFamily: (id: FamilyIdentifier) => FamilyItem;
    getIndividuals: () => IndividualItem[];
    getFamilies: () => FamilyItem[];
    getFamilyName: (id: FamilyIdentifier) => string;
    getIndividualName: (id: IndividualIdentifier) => string;
    getFamilyWhereChild: (id: IndividualIdentifier) => FamilyItem | undefined;
    getFamiliesWhereSpouse: (id: IndividualIdentifier) => FamilyItem[];
};

export default function useFamily(): UseFamilyProps {
    const { families, individuals } = useContext(AppContext);

    const individualById = useMemo(() => {
        const m = new Map<IndividualIdentifier, IndividualItem>();
        for (const i of individuals) m.set(i.id as IndividualIdentifier, i);
        return m;
    }, [individuals]);

    const familyById = useMemo(() => {
        const m = new Map<FamilyIdentifier, FamilyItem>();
        for (const f of families) m.set(f.id as FamilyIdentifier, f);
        return m;
    }, [families]);

    const getIndividual = useCallback((id: IndividualIdentifier) => individualById.get(id)!, [individualById]);
    const getFamily = useCallback((id: FamilyIdentifier) => familyById.get(id)!, [familyById]);
    const getIndividuals = useCallback(() => individuals, [individuals]);
    const getFamilies = useCallback(() => families, [families]);

    const getIndividualName = useCallback(
        (id: IndividualIdentifier) => {
            const individual = individualById.get(id)!;
            const display = `${individual.SURN}, ${individual.GIVN}`;
            return display;
        },
        [individualById]
    );

    const getFamilyName = useCallback(
        (id: FamilyIdentifier) => {
            const { HUSB, WIFE } = familyById.get(id)!;

            if (HUSB && WIFE) {
                return `${getIndividualName(HUSB)} and ${getIndividualName(WIFE)}`;
            }
            if (HUSB) return getIndividualName(HUSB);
            if (WIFE) return getIndividualName(WIFE);
            return "Unknown";
        },
        [familyById, getIndividualName]
    );

    const getFamilyWhereChild = useCallback(
        (id: IndividualIdentifier) => {
            const family = families.find((i) => i.CHIL?.includes(id));
            return family;
        },
        [families]
    );

    const getFamiliesWhereSpouse = useCallback(
        (id: IndividualIdentifier) => {
            const fams = families.filter((f) => f.HUSB === id || f.WIFE === id);
            return fams;
        },
        [families]
    );

    return {
        getIndividual,
        getFamily,
        getIndividuals,
        getFamilies,
        getFamilyName,
        getIndividualName,
        getFamilyWhereChild,
        getFamiliesWhereSpouse
    };
}
