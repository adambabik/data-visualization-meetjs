//;(function () {
//  'use strict';

  var reposData = null;

  function key(d) { return d.lang; }

  function val(d) { return d.repos; }

  var numFormat = d3.format(',d');

  // UI
  //

  d3.selectAll('.sort-by button').on('click', function () {
    this.parentNode
      .querySelector('.btn-primary')
      .classList
      .remove('btn-primary');

    this.classList.add('btn-primary');

    sort(this.dataset.type);
  });

  // Chart
  //

  var width = 960,
      height = 540,
      margin = { top: 40, left: 10, right: 65, bottom: 80 };

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
    .tickFormat(numFormat)
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

  var chart = svg.append('g').attr('class', 'chart');
  var labels = svg.append('g').attr('class', 'labels');

  function redraw() {
    x.domain(reposData.map(key));
    y.domain([0, d3.max(reposData, val)]);

    svg.select('.x.axis').remove();
    drawXAxis(true);

    svg.select('.y.axis').remove();
    drawYAxis(true);

    var bars = chart
      .selectAll('.bar')
      .data(reposData, key);

    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', function (d) { return x(d.lang); })
      .attr('y', function (d) { return y(d.repos); })
      .attr('width', x.rangeBand())
      .attr('height', function (d) { return height - margin.bottom - y(d.repos); });

    bars
      .transition()
      .duration(1000)
      .attr('x', function (d) { return x(d.lang); })
      .attr('y', function (d) { return y(d.repos); })
      .attr('height', function (d) { return height - margin.bottom - y(d.repos); });

    bars
      .exit()
      .remove();

    var texts = labels.selectAll('text').data(reposData, key);

    texts
      .enter()
      .append('text')
      .attr('x', function (d) { return x(d.lang) + x.rangeBand() / 2; })
      .attr('y', function (d) { return y(d.repos); })
      .attr('dy', '-.55em')
      .attr('text-anchor', 'middle')
      .text(function (d) { return numFormat(val(d)); });

    texts
      .transition()
      .duration(1000)
      .attr('x', function (d) { return x(d.lang) + x.rangeBand() / 2; })
      .attr('y', function (d) { return y(d.repos); });

    texts.exit().remove();
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
    reposData = data.slice(0, 10);

    redraw();
  });
//}());
