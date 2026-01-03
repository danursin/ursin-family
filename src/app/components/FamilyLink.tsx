import { Button, SxProps } from "@mui/material";

import { FamilyIdentifier } from "@/types";
import Link from "next/link";
import useFamily from "../hooks/useFamily";

const FamilyLink: React.FC<{ id: FamilyIdentifier; text?: string | undefined; sx?: SxProps | undefined }> = ({ id, text, sx }) => {
    const { getIndividual, getFamily } = useFamily();
    const { HUSB, WIFE } = getFamily(id);
    const husband = HUSB && getIndividual(HUSB);
    const wife = WIFE && getIndividual(WIFE);
    return (
        <Button component={Link} href={`/families/${encodeURIComponent(id)}/edit`} size="small" variant="text" sx={sx}>
            {text ? (
                text
            ) : (
                <>
                    {husband && wife && husband.NAME + " and " + wife.NAME}
                    {husband && !wife && husband.NAME}
                    {!husband && wife && wife.NAME}
                </>
            )}
        </Button>
    );
};

export default FamilyLink;
