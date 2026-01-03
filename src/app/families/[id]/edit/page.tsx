"use client";

import FamilyForm from "../../FamilyForm";
import { FamilyIdentifier } from "@/types";
import useDecodedParam from "@/app/hooks/useDecodedParam";
import useFamily from "@/app/hooks/useFamily";

export default function EditFamilyPage() {
    const id = useDecodedParam<FamilyIdentifier>("id");
    const { getFamily } = useFamily();
    const family = getFamily(id);
    return <FamilyForm mode="edit" initial={family} />;
}
