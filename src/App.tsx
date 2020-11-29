import "./style/site.scss";

import PersonNode from "./component/PersonNode";
import React from "react";
import family from "./family";

const App: React.FC = () => {
    const levelZeros = family.filter((f) => f.level === 0);
    return (
        <>
            {levelZeros.map((person) => (
                <PersonNode key={person.id} person={person} />
            ))}
        </>
    );
};

export default App;
