//;(function () {
//  'use strict';

  var reposData = null;

  function key(d) {
    return d.lang;
  }

  // UI
  //

  // d3.js like jQuery!
  d3.selectAll('.sort-by button').on('click', function () {
    // event is under d3.event
    d3.event
      .currentTarget
      .parentNode
      .querySelector('.btn-primary')
      .classList
      .remove('btn-primary');

    d3.event
      .currentTarget
      .classList.add('btn-primary');
    sort(this.dataset.type);
  });

  // Chart
  //

  var width = 940,
    height = 500,
    margin = { top: 40, left: 0, right: 60, bottom: 80 };

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width - margin.left - margin.right], 0.2, 0);

  var y = d3.scale.linear()
    .range([height - margin.bottom, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(10)
    .outerTickSize(0)
    .orient('bottom');

  var yAxis = d3.svg.axis()
    .scale(y)
    .outerTickSize(0)
    .tickSize(width - margin.left - margin.right, 0, 0)
    .tickFormat(d3.format('f'))
    .orient('right');

  function drawXAxis(call) {
    var g = svg.insert('g', '.chart')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (height - margin.bottom) + ')');

    if (call) {
      g.call(xAxis);
      g.selectAll('text')
        .attr('transform', 'rotate(20)');
    }
  }

  function drawYAxis(call) {
    var g = svg.insert('g', '.chart')
      .attr('class', 'y axis');

    if (call) {
      g.call(yAxis);
    }
  }

  var svg = d3.select('.area').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // put on the foreground
  var chart = svg.append('g').attr('class', 'chart');

  function redraw() {
    x.domain(reposData.map(function (d) { return d.lang; }));
    y.domain([0, d3.max(reposData, function (d) { return d.repos; })]);

    svg.select('.x.axis').remove();
    drawXAxis(true);

    svg.select('.y.axis').remove();
    drawYAxis(true);

    var newChart = chart
      .selectAll('.bar')
      .data(reposData, function (d) { return d.lang; });

    var bar = newChart
      .enter()
      .append('g')
      .attr('class', 'bar')
      .attr('transform', function (d) {
        return 'translate(' + x(d.lang) + ',' + y(d.repos) + ')';
      });

    bar
      .append('rect')
      .attr('width', x.rangeBand())
      .attr('height', function (d) { return height - margin.bottom - y(d.repos); });

    bar
      .append('text')
      .attr('y', -5)
      .text(function (d) {
        return d.repos;
      });

    newChart
      .transition()
      .duration(1000)
      .attr('transform', function (d) {
        return 'translate(' + x(d.lang) + ',' + y(d.repos) + ')';
      })
      .attr('height', function (d) { return height - margin.bottom - y(d.repos); });

    newChart
      .exit()
      .remove();
  }

  function sort(type) {
    switch (type) {
      case 'NUM':
        reposData = reposData.sort(function (a, b) { return d3.descending(a.repos, b.repos); });
        break;

      case 'LEX':
        reposData = reposData.sort(function (a, b) {
          var l1 = a.lang.toLowerCase();
          var l2 = b.lang.toLowerCase();
          return l1 === l2 ? 0 : (l1 < l2 ? -1 : 1);
        });
        break;

      case 'RAN':
        reposData = d3.shuffle(reposData);
        break;
    }

    redraw();
  }

  d3.csv('data/data.csv', function (err, data) {
    if (err) {
      throw err;
    }

    data.forEach(function (d) {
      d.repos = +d.repos;
    });

    // cache data
    reposData = data.slice(0, 15);

    redraw();
  });
//}());
