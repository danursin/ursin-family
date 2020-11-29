import "./style/site.scss";

import React from "react";
import family from "./family";

const App: React.FC = () => {
    return (
        <>
            {family.map((person) => {
                const { id, first, middle, last, maiden } = person;
                const name = `${last}, ${first} ${middle} ${maiden ? `, née ${maiden}` : ""}`;
                return (
                    <details key={id}>
                        <summary>{name}</summary>
                        <p>I am some detail about {name}</p>
                    </details>
                );
            })}
        </>
    );
};

export default App;
