;(function () {
 'use strict';

  var reposData = null;

  function key(d) { return d.lang; }
  function val(d) { return d.repos; }

  var numFormat = d3.format(',d');

  // Chart
  //

  var width = 940,
      height = 500,
      margin = { top: 20, left: 0, right: 65, bottom: 60 };

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width - margin.left - margin.right], .4, .15);

  var y = d3.scale.linear()
    .range([height - margin.bottom, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(12)
    .outerTickSize(0)
    .orient('bottom');

  var yAxis = d3.svg.axis()
    .scale(y)
    .tickSize(width - margin.left - margin.right, 0, 0)
    .tickFormat(d3.format(',d'))
    .orient('right');

  var svg = d3.select('.area').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  d3.csv('data/data.csv', function (err, data) {
    if (err) {
      throw err;
    }

    data.forEach(function (d) {
      d.repos = +d.repos;
    });
    reposData = data.slice(0, 10);

    x.domain(reposData.map(key));
    y.domain([0, d3.max(reposData, val)]);

    svg.append('g')
      .attr('class', 'chart')
      .selectAll('.bar')
      .data(reposData, key)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', function (d) { return x(d.lang); })
      .attr('y', function (d) { return y(d.repos); })
      .attr('width', x.rangeBand())
      .attr('height', function (d) { return height - margin.bottom - y(d.repos); });

    svg.insert('g', '.chart')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
      .call(xAxis);

    svg.insert('g', '.chart')
      .attr('class', 'y axis')
      .call(yAxis);
  });

}());
