import { Button, SxProps } from "@mui/material";

import { FamilyIdentifier } from "@/types";
import Link from "next/link";
import useFamily from "../hooks/useFamily";

const FamilyLink: React.FC<{ id: FamilyIdentifier; text?: string | undefined; sx?: SxProps | undefined }> = ({ id, text, sx }) => {
    const { getFamilyName } = useFamily();
    return (
        <Button component={Link} href={`/families/${encodeURIComponent(id)}/edit`} size="small" variant="text" sx={sx}>
            {text ?? getFamilyName(id)}
        </Button>
    );
};

export default FamilyLink;
