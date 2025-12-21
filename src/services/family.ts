import * as crypto from "node:crypto";

import type { Family, GedcomData, Individual, User } from "../types/index.js";

const S_DAN_URSIN: User = {
    _id: `@U_$${crypto.randomUUID()}@`,
    NAME: "Dan Ursin"
};

const I_DAN_URSIN: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Daniel Joseph /Ursin/",
    GIVN: "Daniel Joseph",
    SURN: "Ursin",
    BIRT: "1987-02-21",
    SEX: "M"
};

const I_ERIN_URSIN: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Erin Marie /Ursin/",
    GIVN: "Erin Marie",
    SURN: "Ursin",
    BIRT: "1986-12-05",
    SEX: "F"
};

const I_ELEANOR_URSIN: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Eleanor Rose /Ursin/",
    GIVN: "Eleanor Rose",
    SURN: "Ursin",
    BIRT: "2017-08-22",
    SEX: "F"
};

const I_CLAIRE_URSIN: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Claire Marie /Ursin/",
    GIVN: "Claire Marie",
    SURN: "Ursin",
    BIRT: "2019-03-27",
    SEX: "F"
};

const I_ROBERT_URSIN: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Robert Donald /Ursin/",
    GIVN: "Robert Donald",
    SURN: "Ursin",
    BIRT: "2021-12-10",
    SEX: "M"
};

const I_THERESA_URSIN: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Theresa Lynn /Ursin/",
    GIVN: "Theresa Lynn",
    SURN: "Ursin",
    BIRT: "1956-08-30",
    SEX: "F"
};

const I_STEVEN_URSIN: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Steven Allen /Ursin/",
    GIVN: "Steven Allen",
    SURN: "Ursin",
    BIRT: "1957-03-23",
    SEX: "M"
};

const I_MICHAEL_URSIN: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Michael Steven /Ursin/",
    GIVN: "Michael Steven",
    SURN: "Ursin",
    BIRT: "1984-01-01",
    SEX: "M"
};

const I_REBECCA_URSIN: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Rebecca Lynn /Ursin/",
    GIVN: "Rebecca Lynn",
    SURN: "Ursin",
    BIRT: "1992-11-17",
    SEX: "F"
};

const I_DONALD_URSIN: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Donald Joseph /Ursin/",
    SURN: "Ursin",
    GIVN: "Donald Joseph"
};

const I_JOYCE_URSIN: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Joyce /Ursin/",
    SURN: "Ursin",
    GIVN: "Joyce"
};

const I_KELLY_SHARRATT: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Kelly Lynn /Sharratt/",
    GIVN: "Kelly Lynn",
    SURN: "Sharratt",
    BIRT: "1989-01-09",
    SEX: "F"
};

const I_CHRISTINE_SHARRATT: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Christine /Sharratt/",
    GIVN: "Christine",
    SURN: "Sharratt",
    SEX: "F"
};

const I_KEN_SHARRATT: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Ken /Sharratt/",
    GIVN: "Ken",
    SURN: "Sharratt",
    SEX: "M"
};

const I_THOMAS_RALENKOTTER: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Thomas /Ralenkotter/",
    GIVN: "Thomas",
    SURN: "Ralenkotter"
};

const I_GERALDINE_PILGRIM: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Geraldine /Pilgrim/",
    GIVN: "Geraldine",
    SURN: "Pilgrim"
};

const I_TODD_RALENKOTTER: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Todd /Ralenkotter/",
    GIVN: "Todd",
    SURN: "Ralenkotter"
};

const I_TONY_RALENKOTTER: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Tony /Ralenkotter/",
    GIVN: "Tony",
    SURN: "Ralenkotter"
};

const I_ANNE_RALENKOTTER: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Anne /Ralenkotter/",
    GIVN: "Anne",
    SURN: "Ralenkotter"
};

const I_MARIA_RALENKOTTER: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Maria /Ralenkotter/",
    GIVN: "Maria",
    SURN: "Ralenkotter"
};

const I_JULIA_RALENKOTTER: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Julia /Ralenkotter/",
    GIVN: "Julia",
    SURN: "Ralenkotter"
};

const I_GARY_PILGRIM: Individual = {
    _id: `@I_${crypto.randomUUID()}@`,
    NAME: "Gary /Pilgrim/",
    GIVN: "Gary",
    SURN: "Pilgrim"
};

const F_THOMAS_GERALDINE_RALENKOTTER: Family = {
    _id: `@F_${crypto.randomUUID()}@`,
    HUSB: I_THOMAS_RALENKOTTER,
    WIFE: I_GERALDINE_PILGRIM,
    CHIL: [I_TODD_RALENKOTTER, I_TONY_RALENKOTTER, I_THERESA_URSIN]
};

const F_GARY_GERALINE_PILGRIM: Family = {
    _id: `@F_${crypto.randomUUID()}@`,
    HUSB: I_GARY_PILGRIM,
    WIFE: I_GERALDINE_PILGRIM
};

const F_TONY_ANNE_RALENKOTTER: Family = {
    _id: `@F_${crypto.randomUUID()}@`,
    HUSB: I_TONY_RALENKOTTER,
    WIFE: I_ANNE_RALENKOTTER,
    CHIL: [I_MARIA_RALENKOTTER, I_JULIA_RALENKOTTER]
};

const F_KEN_CHRISTINE_SHARRATT: Family = {
    _id: `@F_${crypto.randomUUID()}@`,
    HUSB: I_KEN_SHARRATT,
    WIFE: I_CHRISTINE_SHARRATT,
    CHIL: [I_KELLY_SHARRATT, I_ERIN_URSIN]
};

const F_DAN_ERIN_URSIN: Family = {
    _id: `@F_${crypto.randomUUID()}@`,
    HUSB: I_DAN_URSIN,
    WIFE: I_ERIN_URSIN,
    MARR: "2014-09-13",
    CHIL: [I_ELEANOR_URSIN, I_CLAIRE_URSIN, I_ROBERT_URSIN]
};

const F_STEVEN_THERESA_URSIN: Family = {
    _id: `@F_${crypto.randomUUID()}@`,
    HUSB: I_STEVEN_URSIN,
    WIFE: I_THERESA_URSIN,
    CHIL: [I_DAN_URSIN, I_MICHAEL_URSIN, I_REBECCA_URSIN]
};

const F_DONALD_JOYCE_URSIN: Family = {
    _id: `@F_${crypto.randomUUID()}@`,
    HUSB: I_DONALD_URSIN,
    WIFE: I_JOYCE_URSIN,
    CHIL: [I_STEVEN_URSIN]
};

const gedcomData: GedcomData = {
    header: {
        SOUR: "ursin-family",
        NAME: "ursin-family",
        AUTH: "Dan Ursin",
        SUBM: S_DAN_URSIN,
        GEDC: {
            VERS: "5.5.1",
            FORM: "LINEAGE-LINKED"
        },
        CHAR: "UTF-8"
    },
    individuals: [
        I_DAN_URSIN,
        I_ERIN_URSIN,
        I_ELEANOR_URSIN,
        I_CLAIRE_URSIN,
        I_ROBERT_URSIN,
        I_THERESA_URSIN,
        I_STEVEN_URSIN,
        I_CHRISTINE_SHARRATT,
        I_KEN_SHARRATT,
        I_KELLY_SHARRATT,
        I_MICHAEL_URSIN,
        I_REBECCA_URSIN,
        I_DONALD_URSIN,
        I_JOYCE_URSIN,
        I_THOMAS_RALENKOTTER,
        I_ANNE_RALENKOTTER,
        I_GERALDINE_PILGRIM,
        I_TODD_RALENKOTTER,
        I_TONY_RALENKOTTER,
        I_MARIA_RALENKOTTER,
        I_JULIA_RALENKOTTER,
        I_GARY_PILGRIM
    ],
    families: [
        F_DAN_ERIN_URSIN,
        F_STEVEN_THERESA_URSIN,
        F_KEN_CHRISTINE_SHARRATT,
        F_DONALD_JOYCE_URSIN,
        F_GARY_GERALINE_PILGRIM,
        F_THOMAS_GERALDINE_RALENKOTTER,
        F_TONY_ANNE_RALENKOTTER
    ],
    trailer: "TRLR"
};

export default gedcomData;
