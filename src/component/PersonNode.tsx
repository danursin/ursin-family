import { Person } from "../types";
import React from "react";

interface PersonNodeProps {
    person: Person;
}

const buildName = (person: Person): string => {
    const { first, middle, last, maiden } = person;
    const name = `${last}, ${first} ${middle}${maiden ? `, née ${maiden}` : ""}`;
    return name;
};

const PersonNode: React.FC<PersonNodeProps> = (props: PersonNodeProps) => {
    const { person } = props;
    const { id, father, mother, children } = person;
    const name = buildName(person);
    return (
        <details key={id}>
            <summary>{name}</summary>
            <p>I am some detail about {name}</p>
            {!!father && <h3>Father: {buildName(father)}</h3>}
            {!!mother && <h3>Mother: {buildName(mother)}</h3>}
            {!!children?.length && (
                <>
                    <h3>Children</h3>
                    {children.map((child) => (
                        <PersonNode key={child.id} person={child} />
                    ))}
                </>
            )}
        </details>
    );
};

export default PersonNode;
