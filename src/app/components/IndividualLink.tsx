import { Button, SxProps } from "@mui/material";

import { IndividualIdentifier } from "@/types";
import Link from "next/link";
import useFamily from "../hooks/useFamily";

const IndividualLink: React.FC<{ id: IndividualIdentifier; text?: string | undefined; sx?: SxProps }> = ({ id, text, sx }) => {
    const { getIndividualName } = useFamily();
    return (
        <Button component={Link} href={`/individuals/${encodeURIComponent(id)}/edit`} size="small" variant="text" sx={sx}>
            {text ?? getIndividualName(id)}
        </Button>
    );
};

export default IndividualLink;
