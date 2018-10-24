/*global d3 */
/*global db */
/*global firebase */

//===============Visualization set up===========================//
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 600)
    .attr('height', 600);

const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const graphWidth = 600 - margin.right - margin.left;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left},${margin.top})`);

const xAxisGroup = graph.append('g')
    .attr('transform', `translate(0,${graphHeight})`);
const yAxisGroup = graph.append('g');

const y = d3.scaleLinear()
    .range([graphHeight, 0]);

const x = d3.scaleBand()
    .range([0, 500])
    .paddingInner(0.2)
    .paddingOuter(0.2);

const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y)
    .ticks(3)
    .tickFormat(d => d + ' Orders');

xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')
    .attr('fill', 'green');

//===========================End Set up================================//


//==================Function that draws the chart========================//
const update = (data) => {

    y.domain([0, d3.max(data, d => d.orders)]);
    x.domain(data.map(item => item.name));
    const rects = graph.selectAll('rect').data(data);
    rects.exit().remove();

    rects.attr('width', x.bandwidth)
        .attr('fill', 'orange')
        .attr('x', d => x(d.name))
        .transition().duration(1000)
        .attr('height', d => graphHeight - y(d.orders))
        .attr('y', d => y(d.orders));

    rects.enter()
        .append('rect')
        .attr('width', x.bandwidth)
        .attr('height', 0)
        .attr('fill', 'orange')
        .attr('x', d => x(d.name))
        .attr('y', d => graphHeight)
        .transition().duration(1000)
        .attr('height', d => graphHeight - y(d.orders))
        .attr('y', d => y(d.orders));


    /*
    
    */

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

};
//===========================end Drawing function================//

//=================Fetching data only once==========================//
/*
db.collection('dishes').get().then(res => {

    var data = [];
    res.docs.forEach(doc => data.push(doc.data()));
    //console.log(data);
    update(data);
    
});
*/
//====================================================================//

//===================Listening to data changes in firesbase=================//
var data = [];

db.collection('dishes').onSnapshot(res => {
    res.docChanges().forEach(change => {
        const doc = { ...change.doc.data(), id: change.doc.id };
        //console.log(doc);
        switch (change.type) {
            case "added":
                data.push(doc);
                break;
            case "modified":
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;
            case "removed":
                data = data.filter(item => item.id !== doc.id);
                break;
            default:
                break;
        }
    });
    update(data);
});
