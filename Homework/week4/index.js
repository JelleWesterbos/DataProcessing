// select the svg container first
const svg = d3.select('svg')
  // .append('svg')
  // .attr('width', 600)
  // .attr('height', 600);



d3.json("plastic.json").then(function(data) {
    console.log(data); // this is your data

    // Create margins
    const margin = {top: 20, right: 20, bottom: 100, left: 100};
    const graphWidth = 600 - margin.left - margin.right;
    const graphHeight = 600 - margin.top - margin.bottom;
    const graph = svg.append('g')
      .attr('width', graphWidth)
      .attr('height', graphHeight)
      // use template string
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const xAxisGroup = graph.append('g')
      .attr('transform', `translate(0, ${graphHeight})`);
    const yAxisGroup = graph.append('g');
      // .attr('transform', `translate(${margin.left},${margin.top})`)



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
    console.log(min);
    console.log(max);
    console.log(extent);

    // add data to bars (rects)
    const rects = graph.selectAll('rect')
      .data(data);

    rects.attr('width', x.bandwidth)
      .attr("height", d => graphHeight - y(d.Amount))
      .attr('fill', 'blue')
      .attr('x', d => x(d.Entity))
      .attr('y', d => y(d.Amount));

    // append the other rects to the svg
    rects.enter()
      .append('rect')
      .attr('width', x.bandwidth)
      .attr("height", d => graphHeight - y(d.Amount))
      .attr('fill', 'blue')
      .attr('x', d => x(d.Entity))
      .attr('y', d => y(d.Amount));

    graph.selectAll('rect')
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);

    // create and call axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y)
      .ticks(6)
      .tickFormat(d => d+ ' tonnes');

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // rotate text of x axis
    xAxisGroup.selectAll('text')
      .attr('transform', 'rotate(-40)')
      .attr('text-anchor', 'end');
    })

// event handlers

const handleMouseOver = (d, i , n) => {
  console.log(n[i])
  d3.select(n[i])
    .transition().duration(300)
    .attr('fill', '#ff0000');
};

const handleMouseOut = (d, i , n) => {
  d3.select(n[i])
  .transition().duration(300)
  .attr('fill', colour(d.data.Entity));
};
