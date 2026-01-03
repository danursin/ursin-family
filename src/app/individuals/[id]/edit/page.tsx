"use client";

import IndividualForm from "../../IndividualForm";
import { type IndividualIdentifier } from "@/types";
import useFamily from "@/app/hooks/useFamily";
import useDecodedParam from "@/app/hooks/useDecodedParam";

export default function EditIndividualPage() {
    const id = useDecodedParam<IndividualIdentifier>("id");
    const { getIndividual } = useFamily();
    const individual = getIndividual(id);

    return <IndividualForm mode="edit" initial={individual} />;
}
