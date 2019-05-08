/*
Name: Jelle Westerbos
Student number: 10755470

This program visualizes a bar chart with data loaded from a JSON file.
*/

// Create body variable
const body = d3.select("body");

// select the svg container
const svg = d3.select('svg')

// Give information
body.append("h1").text("Surface plastic mass per ocean, 2013")
  .style("color", "black")
  .style("font-family", "Verdana");
d3.select("p").style("color", "black").style("font-family", "Verdana");
body.append("p").text("Jelle Westerbos");
body.append("p").text("Student number: 10755470");
body.append("p").text("Click description below for data source");
body.append("p").text("Quantity of plastic waste floating at the ocean " +
                    "surface within each of the world's ocean or marine " +
                    "basins. This is measured in terms of the mass of " +
                    "particles ranging from small microplastics to " +
                    "macroplastics. It includes only plastics within " +
                    "surface waters (and not at depth or on the seafloor).")
                    .on("click", function() { window.open("https://ourworldindata.org/plastic-pollution"); });

// Load JSON file
d3.json("plastic.json").then(function(data) {

    // Create margins
    const margin = {top: 20, right: 20, bottom: 100, left: 100};
    const graphWidth = 600 - margin.left - margin.right;
    const graphHeight = 600 - margin.top - margin.bottom;
    const graph = svg.append('g')
      .attr('width', graphWidth)
      .attr('height', graphHeight)
      // use template string
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create group
    const xAxisGroup = graph.append('g')
      .attr('transform', `translate(0, ${graphHeight})`);
    const yAxisGroup = graph.append('g');

    // Scale
    const y = d3.scaleLinear()
      .domain([0,d3.max(data, d => d.Amount)])
      .range([graphHeight, 0]);

    const x = d3.scaleBand()
      .domain(data.map(item => item.Entity))
      .range([0,500])
      .paddingInner(0.25)
      .paddingOuter(0.25);

    const min = d3.min(data, d => d.Amount);
    const max = d3.max(data, d => d.Amount);
    const extent = d3.extent( data, d => d.Amount);

    // add data to bars (rects)
    const rects = graph.selectAll('rect')
      .data(data);

    rects.attr('width', x.bandwidth)
      .attr("height", d => graphHeight - y(d.Amount))
      .attr('fill', 'blue')
      .attr('x', d => x(d.Entity))
      .attr('y', d => y(d.Amount));

    // Append the other rects to the svg
    rects.enter()
      .append('rect')
      .attr('width', x.bandwidth)
      .attr("height", d => graphHeight - y(d.Amount))
      .attr('fill', 'blue')
      .attr('x', d => x(d.Entity))
      .attr('y', d => y(d.Amount));

    // Add the events
    graph.selectAll('rect')
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)

    // create axes and ticks
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y)
      .ticks(6)
      .tickFormat(d => d+ ' tonnes');

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // rotate text of x axis
    xAxisGroup.selectAll('text')
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end');
    })

// Define div for the tooltip
const div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Event functions
const handleMouseOver = (d, i , n) => {
  d3.select(n[i])
    .transition().duration(150)
    .attr('fill', '#4166f5')
  div.transition().duration(50)
    .style("opacity", 1)
  div.html(d.Amount)
    .style("left", (d3.event.pageX - 50) + "px")
    .style("top", (d3.event.pageY - 50) + "px");
};

const handleMouseOut = (d, i , n) => {
  d3.select(n[i])
    .transition().duration(100)
    .attr('fill', 'blue')
    // Disappears bar value
  div.transition().duration(50)
    .style("opacity", 0);
};
