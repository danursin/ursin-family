import { useParams } from "next/navigation";

const useDecodedParam = <T>(param: string): T => {
    const params = useParams();
    const val = params[param];
    if (!val) {
        throw new Error(`No parameter ${param} found in params`);
    }
    return decodeURIComponent(val as string) as T;
};

export default useDecodedParam;
