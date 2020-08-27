const w = 800;
const h = 400;
const barWidth = w / 275;

const req = new XMLHttpRequest();
req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();
req.onload = function () {
    const json = JSON.parse(req.responseText);
    const tooltip = d3.select("#graph")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

    const svg = d3.select("#graph")
        .append("svg")
        .attr("width", w + 100)
        .attr("height", h + 60);

    var year = json.data.map(i => new Date(i[0]));
    var gdp = json.data.map(i => i[1]);

    const yearScale = d3.scaleTime()
        .domain([d3.min(year), d3.max(year)])
        .range([0, w]);

    const yearAxis = d3.axisBottom().scale(yearScale);


    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -200)
        .attr('y', 80)
        .text('GDP in Billions');


    svg.append('text')
        .attr('x', w / 2 )
        .attr('y', h + 50)
        .text('Year');


    svg.append("g")
        .attr("id", "x-axis")
        .attr('transform', 'translate(60, 410)')
        .call(yearAxis);

    const gdpScale = d3.scaleLinear()
        .domain([0, d3.max(gdp)])
        .range([h, 0]);

    const gdpAxis = d3.axisLeft().scale(gdpScale);

    svg.append("g")
        .attr("id", "y-axis")
        .attr('transform', 'translate(60 ,10)')
        .call(gdpAxis);


    var scaledGDP = [];

    var linearScale = d3.scaleLinear()
        .domain([0, d3.max(gdp)])
        .range([0, h]);

    scaledGDP = gdp.map(item => linearScale(item));

    d3.select('svg').selectAll('rect')
        .data(scaledGDP)
        .enter()
        .append('rect')
        .attr('x', (d, i) => yearScale(year[i]))
        .attr('y', (d, i) => h - d)
        .attr('width', w / 275)
        .attr('height', d => d)
        .attr("fill", "burlywood")
        .attr("class", "bar")
        .attr("data-date", (d, i) => json.data[i][0])
        .attr("data-gdp", (d, i) => gdp[i])
        .attr('transform', 'translate(60, 10)')
        .on('mouseover', function (d, i) {

            tooltip.transition()
                .duration(200)
                .style('opacity', .9);

            tooltip.html(json.data[i][0] + '<br>' + '$' + gdp[i].toFixed(1) + ' Billion')
                .attr('data-date', json.data[i][0])
                .style('left', (i * barWidth) + 30 + 'px')
                .style('top', h - 100 + 'px')
                .style('transform', 'translateX(60px)')
                ;
        })
        .on('mouseout', function (d) {
            tooltip.transition()
                .duration(200)
                .style('opacity', 0);

        });
};