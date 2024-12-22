const width = window.innerWidth;
const height = window.innerHeight * 0.8;

const svg = d3.select("#whiteboard")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const nodes = [
    { id: "Result 1", group: 1, description: "This is the description for Result 1" },
    { id: "Result 2", group: 2, description: "This is the description for Result 2" },
    { id: "Result 3", group: 1, description: "This is the description for Result 3" }
];

const links = [
    { source: "Result 1", target: "Result 2" },
    { source: "Result 2", target: "Result 3" }
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
