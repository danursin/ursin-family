import { Button, SxProps } from "@mui/material";

import { IndividualIdentifier } from "@/types";
import Link from "next/link";
import useFamily from "../hooks/useFamily";

const IndividualLink: React.FC<{ id: IndividualIdentifier; text?: string | undefined; sx?: SxProps }> = ({ id, text, sx }) => {
    const { getIndividual } = useFamily();
    const individual = getIndividual(id);
    return (
        <Button component={Link} href={`/individuals/${encodeURIComponent(id)}/edit`} size="small" variant="text" sx={sx}>
            {text ?? individual.NAME}
        </Button>
    );
};

export default IndividualLink;
