import * as d3 from "d3";

import { HierarchyPointNode, TreeLayout } from "d3";
import React, { useEffect, useRef } from "react";

import { Person } from "../types";
import family from "../family";

interface Datum {
    name: string;
    value?: number;
    children?: Datum[];
}

const buildName = (person: Person): string => {
    const { first, middle, last, maiden } = person;
    const name = `${last}, ${first} ${middle}${maiden ? `, née ${maiden}` : ""}`;
    return name;
};

const hierarchyHelper = (person: Person): Datum => {
    const children = person.children?.map(hierarchyHelper);
    const datum: Datum = {
        name: buildName(person),
        value: person.id,
        children
    };
    return datum;
};

const assembleFamilyData = (family: Person[]): Datum => {
    const children = family.filter((f) => f.level === 0).map(hierarchyHelper);
    const root: Datum = {
        name: "Distant Ancestor",
        children
    };
    return root;
};

const FamilyTree: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svgNode = svgRef.current;
        if (!svgNode) {
            throw new Error("svg not yet captured");
        }

        const json = assembleFamilyData(family);
        const width = 954; //document.body.clientWidth;

        let dx = 10;
        let dy = -1;

        const buildTree = (data: Datum): d3.HierarchyPointNode<Datum> => {
            const root = d3.hierarchy<Datum>(data);
            dx = 10;
            dy = width / (root.height + 1);
            return d3.tree<Datum>().nodeSize([dx, dy])(root);
        };

        const root = buildTree(json);

        let x0 = Infinity;
        let x1 = -x0;

        root.each((d) => {
            if (d.x > x1) {
                x1 = d.x;
            }
            if (d.x < x0) {
                x0 = d.x;
            }
        });

        const svg = d3.select(svgNode).attr("viewBox", [0, 0, width, x1 - x0 + dx * 2].join());

        const g = svg
            .append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("transform", `translate(${dy / 3},${dx - x0})`);

        const link = g
            .append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(root.links())
            .join("path")
            .attr(
                "d",
                d3
                    .linkHorizontal<unknown, HierarchyPointNode<Datum>>()
                    .x((d) => d.y)
                    .y((d) => d.x)
            );

        const node = g
            .append("g")
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .selectAll("g")
            .data(root.descendants())
            .join("g")
            .attr("transform", (d) => `translate(${d.y},${d.x})`);

        node.append("circle")
            .attr("fill", (d) => (d.children ? "#555" : "#999"))
            .attr("r", 2.5);

        node.append("text")
            .attr("dy", "0.31em")
            .attr("x", (d) => (d.children ? -6 : 6))
            .attr("text-anchor", (d) => (d.children ? "end" : "start"))
            .text((d) => d.data.name)
            .clone(true)
            .lower()
            .attr("stroke", "white");
    }, []);

    return <svg ref={svgRef} />;
};

export default FamilyTree;
