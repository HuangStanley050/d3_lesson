/* global d3 */
const data = [
    { width: 200, height: 100, fill: "purple" },
    { width: 100, height: 60, fill: "red" },
    { width: 50, height: 30, fill: "blue" }
];
const svg = d3.select('svg');

const recs = svg.selectAll('rect')
    .data(data)
    .attr('width', d => d.width)
    .attr('height', d => d.height)
    .attr('fill', d => d.fill);

recs.enter()
    .append('rect')
    .attr('width', d => d.width)
    .attr('height', d => d.height)
    .attr('fill', d => d.fill);

//console.log(log);
