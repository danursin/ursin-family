import { FamilyIdentifier, FamilyItem, IndividualIdentifier, IndividualItem } from "@/types";
import { useCallback, useContext, useMemo } from "react";

import { AppContext } from "../components/AppContextProvider";

type UseFamilyProps = {
    getIndividual: (id: IndividualIdentifier) => IndividualItem;
    getFamily: (id: FamilyIdentifier) => FamilyItem;
    getIndividuals: () => IndividualItem[];
    getFamilies: () => FamilyItem[];
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

    return { getIndividual, getFamily, getIndividuals, getFamilies };
}
