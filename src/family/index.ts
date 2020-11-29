import { Person } from "../types";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const family: Person[] = require("./family.json");

let minLevel = 0;
let maxLevel = 0;
const assignLevels = (person: Person, level: number): void => {
    if (person.level !== undefined) {
        return;
    }
    if (level < minLevel) {
        minLevel = level;
    }
    if (level > maxLevel) {
        maxLevel = level;
    }
    person.level = level;
    if (person.fatherId) {
        const father = family.find((f) => f.id === person.fatherId);
        if (!father) {
            throw new Error(`Father with id ${person.father} not for person ${person.id}`);
        }
        person.father = father;
        assignLevels(father, level - 1);
    }

    if (person.motherId) {
        const mother = family.find((f) => f.id === person.motherId);
        if (!mother) {
            throw new Error(`Mother with id ${person.mother} not for person ${person.id}`);
        }
        person.mother = mother;
        assignLevels(mother, level - 1);
    }

    person.children = [];
    if (person.childrenIds) {
        for (const id of person.childrenIds) {
            const child = family.find((f) => f.id === id);
            if (!child) {
                throw new Error(`Child with id ${id} not for person ${person.id}`);
            }
            person.children.push(child);
            assignLevels(child, level + 1);
        }
    }
};

assignLevels(family[0], 0);

const levelOffset = minLevel - maxLevel;
family.forEach((person) => {
    if (person.level === undefined) {
        throw new Error(`Person with id ${person.id} was not assigned a level`);
    }
    person.level -= levelOffset;
});

export default family;
