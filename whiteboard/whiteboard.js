const width = window.innerWidth;
const height = window.innerHeight * 0.8;

const svg = d3.select("#whiteboard")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const nodes = [
    { id: "H1", group: 1, description: "Narain component in 6D" },
    { id: "H2", group: 1, description: "CHL string in 6D" },
    { id: "H3", group: 1, description: "Z3 triple in 6D" },
    { id: "H4", group: 1, description: "Z4 triple in 6D" },
    { id: "H5", group: 1, description: "Z5 triple in 6D" },
    { id: "H6", group: 1, description: "Z6 triple in 6D" },
    { id: "H7", group: 1, description: "Z7 orbifold in 6D" },
    { id: "H8", group: 1, description: "Z8 triple in 6D" },
    { id: "H2D", group: 1, description: "Z2 OD in 6D" },
    { id: "H6D", group: 1, description: "Z6 OD in 6D" },
    { id: "H10D", group: 1, description: "Z10 OD in 6D" },
    { id: "II2", group: 1, description: "AOA = AOB in 6D" },
    { id: "II3", group: 1, description: "Z3 type II orbifold in 6D" },
    { id: "II4", group: 1, description: "Z4 type II orbifold in 6D" },
    { id: "II6", group: 1, description: "Z6 type II orbifold in 6D" },
    { id: "II5", group: 1, description: "Z5 type II orbifold in 6D" },
    { id: "II8", group: 1, description: "Z8 type II orbifold in 6D" },
    { id: "II10", group: 1, description: "Z10 type II orbifold in 6D" },
    { id: "II12", group: 1, description: "Z12 type II orbifold in 6D" },
    { id: "II2T", group: 1, description: "AOA with DT in 6D" },
    { id: "II3T", group: 1, description: "Z3 type II orbifold with DT in 6D" },
    { id: "II4T", group: 1, description: "Z4 type II orbifold with DT in 6D" },
    { id: "II5T", group: 1, description: "Z5 type II orbifold with DT in 6D" },
    { id: "II8T", group: 1, description: "Z8 type II orbifold with DT in 6D" }
];

const links = [
    { source: "H1", target: "H2" },
    { source: "H1", target: "H3" },
    { source: "H1", target: "H4" },
    { source: "H1", target: "H5" },
    { source: "H1", target: "H6" },
    { source: "H1", target: "H7" },
    { source: "H1", target: "H8" },
    { source: "H1", target: "H2D" },
    { source: "H1", target: "H6D" },
    { source: "H1", target: "H10D" },
    { source: "H1", target: "II2" },
    { source: "H1", target: "II3" },
    { source: "H1", target: "II4" },
    { source: "H1", target: "II6" },
    { source: "H1", target: "II5" },
    { source: "H1", target: "II8" },
    { source: "H1", target: "II10" },
    { source: "H1", target: "II12" },
    { source: "H1", target: "II2T" },
    { source: "H1", target: "II3T" },
    { source: "H1", target: "II4T" },
    { source: "H1", target: "II5T" },
    { source: "H1", target: "II8T" }
];

const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

const link = svg.append("g")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", 2)
    .attr("stroke", "#999");

const node = svg.append("g")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 10)
    .attr("fill", d => d.group === 1 ? "blue" : "green")
    .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded));

node.append("title").text(d => d.id);

simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
});

function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function updateGraph() {
    const link = svg.selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 2)
        .attr("stroke", "#999");

    const node = svg.selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 10)
        .attr("fill", d => d.group === 1 ? "blue" : "green")
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded));

    // Add text bubbles
    const text = svg.selectAll("text")
        .data(nodes)
        .join("text")
        .attr("x", d => d.x + 15) // Position text slightly to the right of the node
        .attr("y", d => d.y)      // Align vertically with the node
        .attr("dy", ".35em")      // Center text vertically
        .text(d => d.description)
        .style("font-size", "12px")
        .style("visibility", "hidden") // Initially hidden
        .attr("fill", "black");

    // Show/hide text on hover
    node.on("mouseover", function (event, d) {
        d3.select(this).attr("r", 12); // Slightly enlarge the node
        text.filter(t => t.id === d.id).style("visibility", "visible");
    }).on("mouseout", function (event, d) {
        d3.select(this).attr("r", 10); // Restore original size
        text.filter(t => t.id === d.id).style("visibility", "hidden");
    });

    // Update simulation
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();
}
