let gedcomData: string | undefined;

const cache = {
    get: () => gedcomData,
    put: (data: string) => (gedcomData = data)
};

export default cache;
