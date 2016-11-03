
function TernaryPlot(selector, userOptions) {

	d3.selectAll(".d3-tip").remove();
	
	var plot = {
		dataset : data
	};

	var options = {
		width : 700,
		height : 500,
		side : 700,
		margin : {
			top : 50,
			left : 50,
			bottom : 50,
			right : 50
		},
		axisLabels : [ "A", "B", "C" ],
		axisTicks : [ 0, 20, 40, 60, 80, 100 ],
		tickLabelMargin : 10,
		axisLabelMargin : 40
	}

	for ( var o in userOptions) {
		options[o] = userOptions[o];
	}

	var svg = d3.select(selector).append("svg").attr("width", options.width)
			.attr("height", options.height).attr("class", "centerPlot");

	var axes = svg.append("g").attr("class", "axes");

	var w = options.side;
	var h = Math.sqrt(options.side * options.side - (options.side / 2)
			* (options.side / 2));

	var corners = [ [ options.margin.left, h + options.margin.top ], // A
	[ w + options.margin.left, h + options.margin.top ], // B
	[ (w / 2) + options.margin.left, options.margin.top ] // C
	];

	// axis names
	axes
			.selectAll(".axis-title")
			.data(options.axisLabels)
			.enter()
			.append("g")
			.attr("class", "axis-title")
			.attr(
					"transform",
					function(d, i) {
						return "translate(" + corners[i][0] + ","
								+ corners[i][1] + ")";
					})
			.append("text")
			.text(function(d) {
				return d;
			})
			.attr("text-anchor", function(d, i) {
				if (i === 0)
					return "end";
				if (i === 2)
					return "middle";
				return "start";
			})
			.attr(
					'transform',
					function(d, i) {
						var theta = 0;
						if (i === 0)
							theta = 120;
						if (i === 1)
							theta = 60;
						if (i === 2)
							theta = -90;

						var x = options.axisLabelMargin
								* Math.cos(theta * 0.0174532925), y = options.axisLabelMargin
								* Math.sin(theta * 0.0174532925);
						return 'translate(' + x + ',' + y + ')'
					});

	// ticks
	var n = options.axisTicks.length;
	if (options.minorAxisTicks) {
		options.minorAxisTicks.forEach(function(v) {
			var coord1 = coord([ v, 0, 100 - v ]);
			var coord2 = coord([ v, 100 - v, 0 ]);
			var coord3 = coord([ 0, 100 - v, v ]);
			var coord4 = coord([ 100 - v, 0, v ]);

			axes.append("line").attr(lineAttributes(coord1, coord2)).classed(
					'a-axis minor-tick', true);

			axes.append("line").attr(lineAttributes(coord2, coord3)).classed(
					'b-axis minor-tick', true);

			axes.append("line").attr(lineAttributes(coord3, coord4)).classed(
					'c-axis minor-tick', true);
		});
	}

	options.axisTicks
			.forEach(function(v) {
				var coord1 = coord([ v, 0, 100 - v ]);
				var coord2 = coord([ v, 100 - v, 0 ]);
				var coord3 = coord([ 0, 100 - v, v ]);
				var coord4 = coord([ 100 - v, 0, v ]);

				axes.append("line").attr(lineAttributes(coord1, coord2))
						.classed('a-axis tick', true);

				axes.append("line").attr(lineAttributes(coord2, coord3))
						.classed('b-axis tick', true);

				axes.append("line").attr(lineAttributes(coord3, coord4))
						.classed('c-axis tick', true);

				// tick labels
				axes.append('g').attr('transform', function(d) {
					return 'translate(' + coord1[0] + ',' + coord1[1] + ')'
				}).append("text").attr('transform', 'rotate(60)').attr(
						'text-anchor', 'end').attr('x',
						-options.tickLabelMargin).text(function(d) {
					return v;
				}).classed('a-axis tick-text', true);

				axes.append('g').attr('transform', function(d) {
					return 'translate(' + coord2[0] + ',' + coord2[1] + ')'
				}).append("text").attr('transform', 'rotate(-60)').attr(
						'text-anchor', 'end').attr('x',
						-options.tickLabelMargin).text(function(d) {
					return (100 - v);
				}).classed('b-axis tick-text', true);

				axes.append('g').attr('transform', function(d) {
					return 'translate(' + coord3[0] + ',' + coord3[1] + ')'
				}).append("text").text(function(d) {
					return v;
				}).attr('x', options.tickLabelMargin).classed(
						'c-axis tick-text', true);

			})

	function lineAttributes(p1, p2) {
		return {
			x1 : p1[0],
			y1 : p1[1],
			x2 : p2[0],
			y2 : p2[1]
		};
	}

	function coord(arr) {
		var a = arr[0], b = arr[1], c = arr[2];
		var sum, pos = [ 0, 0 ];
		sum = a + b + c;
		if (sum !== 0) {
			a /= sum;
			b /= sum;
			c /= sum;
			pos[0] = corners[0][0] * a + corners[1][0] * b + corners[2][0] * c;
			pos[1] = corners[0][1] * a + corners[1][1] * b + corners[2][1] * c;
		}
		return pos;
	}

	function scale(p, factor) {
		return [ p[0] * factor, p[1] * factor ];
	}

	var tip = d3.tip().attr("class", "d3-tip").offset([ -10, 0 ]).html(
			function(d) {
				//console.log("TIP!")
				return "<table><tr><td><b>User:</b></td><td>"+d.owner+"</td></tr>" 
					+"<tr><td><b>Assigned:</b></td><td>"+d.status.Assigned+"</td></tr>" 
					+"<tr><td><b>Accepted:</b></td><td>"+d.status.Accepted+"</td></tr>" 
					+"<tr><td><b>Completed:</b></td><td>"+d.status.Completed+"</td></tr></table>";		
			});

	svg.call(tip);

	plot.data = function(data, accessor, bindBy) { // bindBy is the dataset
													// property used as an id
													// for the join
		plot.dataset = data;

		var circles = svg.selectAll("circle").data(data.map(function(d) {
			return {
				owner : d.ownerName,
				taskCount : d.taskCount,
				status : d.status,
				coord : coord(accessor(d))
			};
		}), function(d, i) {
			if (bindBy) {
				return plot.dataset[i][bindBy];
			}
			return i;
		});

		circles.enter().append("circle");

		circles.attr("class", "userCircle").on("mouseover", tip.show).on(
				"mouseout", tip.hide);

		circles.transition().attr("cx", function(d) {
			return d.coord[0];
		}).attr("cy", function(d) {
			return d.coord[1];
		}).attr("r", 6);

		return this;
	}

	plot.getPosition = coord;
	plot.getTripple = function(x, y) {
		// TODO, get percentages for a give x, y
	}

	return plot;
}

function PlotTernaryData(data, selector, plotOptions) {

	var tp = TernaryPlot(selector, plotOptions);

	for ( var i in data) {
		// console.log(data);
		// console.log(data[i]);
		// console.log(data[i].status);
		// console.log(data[i].status.Assigned);
		data[i].tasksAssignedPercent = data[i].status.Assigned
				/ data[i].status.Total;
		data[i].tasksAcceptedPercent = data[i].status.Accepted
				/ data[i].status.Total;
		data[i].tasksCompletedPercent = data[i].status.Completed
				/ data[i].status.Total;
	}

	tp.data(data, function(d) {
		return [ d.tasksAssignedPercent, d.tasksAcceptedPercent,
				d.tasksCompletedPercent ]
	}, "ownerName");
}

/**
 * RANDOMIZE DATA SECTION
 */

function RandomInt(min, max) {
	return parseInt(Math.random() * ((max - min) + 1) + min);
}

function RandomTernaryData(d) {
	for (var i = 0; i < 50; i++) {
		var tAs = RandomInt(0, 20);
		var tAc = RandomInt(0, 20);
		var tCo = RandomInt(0, 20);
		var total = tAs + tAc + tCo;

		d.push({
			owner : "user" + (i + 1),
			taskCount : total,
			status : {
				assigned : tAs,
				accepted : tAc,
				completed : tCo,
				total : total
			}
		});
	}
	return d;
}

/**
 * END RANDOMIZE DATA SECTION
 */

var data = [];

/**
 * data = { owner: string, taskCount: int, status: { assigned: int, accepted:
 * int, complete: int, total: int }
 */

var plotOptions = {
	side : 400,
	margin : {
		top : 70,
		left : 150,
		bottom : 150,
		right : 150
	},
	axisLabels : [ 'Assigned', 'Accepted', 'Completed' ],
	axisTicks : d3.range(0, 101, 20),
	minorAxisTicks : d3.range(0, 101, 5)
};

// randomize the data
// RandomTernaryData(data);

// PlotTernaryData(data, "#plot", plotOptions);

