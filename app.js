// ----- Static data (readonly) ----------------------------------------------
const persons = [
    { id: "p1", name: "Theresa Lynn Ursin", gender: "F", dob: "1956-08-30", maiden: "Ralenkotter" },
    { id: "p2", name: "Steven Allen Ursin", gender: "M", dob: "1957-03-23" },
    { id: "p3", name: "Rebecca Lynn Ursin", gender: "F", dob: "1992-11-17" },
    { id: "p4", name: "Michael Steven Ursin", gender: "M", dob: "1984-01-01" },
    { id: "p5", name: "Laura Michelle Ursin", gender: "F", dob: "1985-08-03", maiden: "Hepler" },
    { id: "p6", name: "James Robert Ursin", gender: "M", dob: "2019-02-23" },
    { id: "p7", name: "Erin Marie Ursin", gender: "F", dob: "1986-12-05", maiden: "Sharratt" },
    { id: "p8", name: "Eleanor Rose Ursin", gender: "F", dob: "2017-08-27" },
    { id: "p9", name: "Daniel Joseph Ursin", gender: "M", dob: "1987-02-21" },
    { id: "p10", name: "Claire Marie Ursin", gender: "F", dob: "2019-03-22" },
    { id: "p11", name: "Benjamin Michael Ursin", gender: "M", dob: "2016-04-16" },
    { id: "p12", name: "Robert Donald Ursin", gender: "M", dob: "2021-12-10" },
    { id: "p13", name: "Christine Sharratt", gender: "F", maiden: "Ryan" },
    { id: "p14", name: "Ken Sharratt", gender: "M" },
    { id: "p15", name: "Donald Joseph Ursin", gender: "M" },
    { id: "p16", name: "Joyce Ursin", gender: "F", maiden: "Krogen" },
    { id: "p17", name: "Dixie Rose Ryan", gender: "F", maiden: "Hilliard" },
    { id: "p18", name: "Robert Ryan", gender: "M" },
    { id: "p19", name: "Harrison Powell", gender: "M" },
    { id: "p20", name: "Jackie Hepler", gender: "F" }, // Laura's mother
    { id: "p21", name: "Bob Hepler", gender: "M" }, // Laura's father
    { id: "p22", name: "Katie Hepler", gender: "F" }, // Laura's sister
    { id: "p23", name: "Matt", gender: "M" } // Katie's husband
];

const unions = [
    { id: "u1_2", partners: ["p1", "p2"] }, // Theresa ↔ Steven
    { id: "u4_5", partners: ["p4", "p5"] }, // Michael ↔ Laura
    { id: "u7_9", partners: ["p7", "p9"] }, // Erin ↔ Daniel
    { id: "u13_14", partners: ["p13", "p14"] }, // Christine ↔ Ken (Erin's parents)
    { id: "u15_16", partners: ["p15", "p16"] }, // Donald ↔ Joyce (Steven's parents)
    { id: "u17_18", partners: ["p17", "p18"] }, // Dixie ↔ Robert (Christine's parents)
    { id: "u3_19", partners: ["p3", "p19"] }, // Rebecca ↔ Harrison
    { id: "u20_21", partners: ["p20", "p21"] }, // Jackie ↔ Bob Hepler
    { id: "u22_23", partners: ["p22", "p23"] } // Katie ↔ Matt
];

const parentChild = [
    { from: "u1_2", to: "p3", kind: "bio" }, // Theresa + Steven → Rebecca
    { from: "u1_2", to: "p4", kind: "bio" }, // Theresa + Steven → Michael
    { from: "u1_2", to: "p9", kind: "bio" }, // Theresa + Steven → Daniel
    { from: "u4_5", to: "p6", kind: "bio" }, // Michael + Laura → James
    { from: "u4_5", to: "p11", kind: "bio" }, // Michael + Laura → Benjamin
    { from: "u7_9", to: "p8", kind: "bio" }, // Erin + Daniel → Eleanor
    { from: "u7_9", to: "p10", kind: "bio" }, // Erin + Daniel → Claire
    { from: "u7_9", to: "p12", kind: "bio" }, // Erin + Daniel → Robert
    { from: "u13_14", to: "p7", kind: "bio" }, // Christine + Ken → Erin
    { from: "u15_16", to: "p2", kind: "bio" }, // Donald + Joyce → Steven
    { from: "u17_18", to: "p13", kind: "bio" }, // Dixie + Robert → Christine
    { from: "u20_21", to: "p5", kind: "bio" }, // Jackie + Bob → Laura
    { from: "u20_21", to: "p22", kind: "bio" } // Jackie + Bob → Katie
];

// ========== HYBRID FORCE RENDER (readonly, zoom/pan) =======================

// 0) Select SVG + zoom layer, measure size safely
const svg = d3.select("#chart");
if (svg.empty()) {
    console.error('SVG #chart not found. Ensure index.html has <svg id="chart">.');
}

let g = d3.select("#zoom-layer");
if (g.empty()) {
    // create if missing
    g = svg.append("g").attr("id", "zoom-layer");
}

// measure
function measure() {
    const n = svg.node();
    if (!n) return { w: 800, h: 600 };
    // Try client box, then viewBox, then fallback
    const r = n.getBoundingClientRect();
    let w = Math.max(1, r.width || n.clientWidth || n.viewBox?.baseVal?.width || 800);
    let h = Math.max(1, r.height || n.clientHeight || n.viewBox?.baseVal?.height || 600);
    return { w, h };
}
let { w: width, h: height } = measure();

// 1) Quick validation (warns, doesn’t stop render)
(function validate() {
    const personIds = new Set(persons.map((p) => p.id));
    const unionIds = new Set(unions.map((u) => u.id));
    const errs = [];

    for (const u of unions) {
        for (const pid of u.partners || []) {
            if (!personIds.has(pid)) errs.push(`Union ${u.id} has missing partner ${pid}`);
        }
    }
    for (const e of parentChild) {
        if (!unionIds.has(e.from)) errs.push(`ParentChild missing union: ${e.from}`);
        if (!personIds.has(e.to)) errs.push(`ParentChild missing child person: ${e.to}`);
        if (!["bio", "adopted", "step"].includes(e.kind)) errs.push(`ParentChild bad kind: ${e.kind} (${e.from}→${e.to})`);
    }
    if (errs.length) console.warn("Data validation warnings:\n" + errs.join("\n"));
})();

// 2) Build indexes
const U = new Map(unions.map((u) => [u.id, u]));

const childrenOfUnion = new Map();
for (const e of parentChild) {
    const list = childrenOfUnion.get(e.from) || [];
    list.push({ child: e.to, kind: e.kind });
    childrenOfUnion.set(e.from, list);
}

// 3) Assign “soft” generations (for X gravity)
const isChild = new Set(parentChild.map((x) => x.to));
const personGen = new Map();
// roots
for (const p of persons) if (!isChild.has(p.id)) personGen.set(p.id, 0);

let changed = true,
    guard = 0;
while (changed && guard++ < 40) {
    changed = false;
    // align spouses to max among them
    for (const u of unions) {
        const gens = u.partners.map((pid) => personGen.get(pid)).filter((g) => g !== undefined);
        if (!gens.length) continue;
        const gmax = Math.max(...gens);
        for (const pid of u.partners) {
            if (personGen.get(pid) === undefined || personGen.get(pid) < gmax) {
                personGen.set(pid, gmax);
                changed = true;
            }
        }
    }
    // parents -> child = max(parent gens)+1
    for (const [uid, kids] of childrenOfUnion.entries()) {
        const partners = U.get(uid)?.partners || [];
        const pg = partners.map((pid) => personGen.get(pid)).filter((g) => g !== undefined);
        if (!pg.length) continue;
        const base = Math.max(...pg) + 1;
        for (const { child } of kids) {
            if ((personGen.get(child) ?? -1) < base) {
                personGen.set(child, base);
                changed = true;
            }
        }
    }
}
// default any unknowns to 0
for (const p of persons) if (personGen.get(p.id) === undefined) personGen.set(p.id, 0);

// 4) Prepare nodes/links
const nodes = [
    ...persons.map((p) => ({ id: p.id, type: "person", label: p.name })),
    ...unions.map((u) => ({ id: u.id, type: "union", partners: u.partners.slice() }))
];

const links = [
    // union ↔ partners (marriage/union tethers)
    ...unions.flatMap((u) =>
        (u.partners || []).map((pid) => ({
            source: u.id,
            target: pid,
            kind: "marriage"
        }))
    ),

    // union → child
    ...parentChild.map((e) => ({ source: e.from, target: e.to, kind: e.kind }))
];

// 5) Clear and (re)build layers
g.selectAll("*").remove();
const linkLayer = g.append("g").attr("stroke-width", 1.8).attr("fill", "none");
const nodeLayer = g.append("g");
const labelLayer = g.append("g");

// 6) Draw links
const link = linkLayer
    .selectAll("line")
    .data(links, (d) => `${d.source}->${d.target}:${d.kind}`)
    .join("line")
    .attr("class", (d) => `link ${d.kind}`)
    .attr("marker-end", (d) => (d.kind === "marriage" ? null : "url(#arrow)"));

// 7) Draw nodes (readonly)
const node = nodeLayer
    .selectAll("g.node")
    .data(nodes, (d) => d.id)
    .join((enter) => {
        const ng = enter.append("g").attr("class", (d) => `node ${d.type}`);
        ng.each(function (d) {
            const sel = d3.select(this);
            if (d.type === "person") sel.append("circle").attr("r", 16);
            else sel.append("rect").attr("x", -6).attr("y", -6).attr("width", 12).attr("height", 12).attr("transform", "rotate(45)");
        });
        return ng;
    });

const label = labelLayer
    .selectAll("text.label")
    .data(nodes.filter((n) => n.type === "person"))
    .join("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("dy", 28)
    .text((d) => d.label);

// Titles
node.append("title").text((d) => (d.type === "person" ? `${d.label} (${d.id})` : `Union ${d.id}`));

// 8) Zoom/pan (rebind to preserve existing handlers)
const zoom = d3
    .zoom()
    .scaleExtent([0.3, 3])
    .on("zoom", (ev) => g.attr("transform", ev.transform));
svg.call(zoom);

// 9) Forces: soft generation gravity on X, loose Y
const bandX = 180;
const genIndex = (d) =>
    d.type === "person"
        ? personGen.get(d.id) ?? 0
        : (() => {
              const u = U.get(d.id);
              const gs = (u?.partners || []).map((pid) => personGen.get(pid) ?? 0);
              return gs.length ? d3.mean(gs) + 0.25 : 0;
          })();

const simulation = d3
    .forceSimulation(nodes)
    .force(
        "link",
        d3
            .forceLink(links)
            .id((d) => d.id)
            .distance((l) => (l.kind === "marriage" ? 35 : 110))
            .strength((l) => (l.kind === "marriage" ? 0.8 : 0.3))
    )
    .force(
        "charge",
        d3.forceManyBody().strength((d) => (d.type === "union" ? -60 : -140))
    )
    .force("x", d3.forceX((d) => 80 + genIndex(d) * bandX).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.02))
    .force(
        "collision",
        d3
            .forceCollide()
            .radius((d) => (d.type === "person" ? 24 : 14))
            .iterations(2)
    )
    .on("tick", ticked)
    .on("end", () => simulation.stop());

function ticked() {
    link.attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
    node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    label.attr("x", (d) => d.x).attr("y", (d) => d.y + 28);
}

// 10) Auto-fit once
setTimeout(() => {
    const bbox = g.node()?.getBBox?.();
    if (!bbox || !isFinite(bbox.width) || !isFinite(bbox.height)) return;
    const margin = 40;
    const scale = Math.min((width - margin * 2) / Math.max(bbox.width, 1), (height - margin * 2) / Math.max(bbox.height, 1), 1.5);
    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;
    const t = d3.zoomIdentity.translate(width / 2 - scale * cx, height / 2 - scale * cy).scale(scale);
    svg.transition().duration(600).call(zoom.transform, t);
}, 800);
