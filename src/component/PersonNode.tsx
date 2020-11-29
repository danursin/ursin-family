import { Person } from "../types";
import React from "react";

interface PersonNodeProps {
    person: Person;
}

const PersonNode: React.FC<PersonNodeProps> = (props: PersonNodeProps) => {
    const { person } = props;
    return (
        <div className="person">
            {person.last} {person.first}
        </div>
    );
};

export default PersonNode;
