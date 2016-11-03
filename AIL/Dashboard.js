// function for pie chart and bar chart relations
function dashboard(barId, pieId, legendId, fData, isGroup) {

	var isFirst = true;
	var firstType;
	var isInit = true;
	d3.select(barId).selectAll("*").remove();
	d3.select(pieId).selectAll("*").remove();
	d3.select(legendId).selectAll("*").remove();

	var tooltip = d3.selectAll(".d3-tip")
		.style("opacity", 0);


	var barColor = 'steelblue';
	function segColor(c) {
		return {
			Assigned : "#e08214",
			Accepted : "#807dba",
			Completed : "#41ab5d"			
		}[c];
	}

	// function to handle histogram.
	function histoGram(fD) {
		var hG = {}, hGDim = {
			t : 20,
			r : 20,
			b : 120,
			l : 20
		};
		hGDim.w = 450 - hGDim.l - hGDim.r, hGDim.h = 400 - hGDim.t - hGDim.b;

		// create svg for histogram.
		var hGsvg = d3.select(barId).append("svg")
				.attr("width", hGDim.w + hGDim.l + hGDim.r)
				.attr("height", hGDim.h + hGDim.t + hGDim.b)
				.append("g")
				.attr("transform", "translate(" + 0 + "," + hGDim.t + ")");

		// create function for x-axis mapping.
		var x = d3.scale.ordinal().rangeRoundBands([ 0, hGDim.w], 0.1).domain(
				fD.map(function(d) {return d.name;}));

		var labelPos = hGDim.h + 25;

		// Add x-axis to the histogram svg.
		hGsvg.append("g").attr("class", "x axis")
				.attr("transform", "translate(0," + hGDim.h + ")")
				.call(d3.svg.axis().scale(x).orient("bottom"))
				.selectAll("text")
				.attr("class", "nameLabel")
				.attr("y", 0)
				.attr("x", 10)
				.attr("dy", "1em")
				.attr("transform", "rotate(90)")
				.style("font-weight", "bold")
				.style("text-anchor", "start");
		
		var y = d3.scale.linear()
				.range([ hGDim.h, 0 ])
				.domain([ 0, d3.max(fD, function(d) {return d.status;}) ]);
		
		// Add y-axis to the histogram svg.
		hGsvg.append("g").attr("class", "y axis").call(d3.svg.axis().scale(y).ticks(8).orient("left"));

		// Create bars for histogram to contain rectangles and status labels.
		var bars = hGsvg.selectAll(".bar")
				.data(fD)
				.enter()
				.append("g")
				.attr("class", "bar");

		// create the rectangles.
		bars.append("rect")
				.attr("x", function(d) {return x(d.name);})
				.attr("y", function(d) {return y(d.status);})
				.attr("width", x.rangeBand())
				.attr("height", function(d) {return hGDim.h - y(d.status);})
				.attr('fill', barColor)
				.on("mouseover", mouseover)
				.on("mouseout", mouseout)
				.on("click", function(d){
					var selection  = fData.totalList.filter(function(s){
						return s.ownerName == d[0];
						})
					//console.log("Selection: "+selection);
					if(selection.length != 0){
						createDrillDownTable("#drillDownChart", selection);
					}
				});

		// Create the statusuency labels above the rectangles.
		bars.append("text")
				.text(function(d) {return d3.format(",")(d.status)})
				.attr("x", function(d) {return x(d.name) + x.rangeBand() / 2;})
				.attr("y", function(d) {return y(d.status) - 5;})
				.attr("class", "font10")
				.attr("text-anchor", "middle");

		if (isGroup == 'true') {
			document.getElementById("pieTitle").innerText = "Task Breakdown for All Groups";
		} else {
			document.getElementById("pieTitle").innerText = "Task Breakdown for All Users";
		}

		function mouseover(d) { // utility function to be called on mouseover.
        	
		    var tipHtml = "<strong>Name: </strong><span>"+d[0]+"</span>";
		    showTooltip(this, tipHtml, false);

			// filter for selected state.
			var st = fData.totalList.filter(function(s) {
				return s.ownerName == d[0];
			})[0];
			var nD;
			if(st.length != 0){
				nD = [ 'Assigned', 'Accepted', 'Completed' ]
				.map(function(s) {
					return {
						type : s,
						status : st.status[s]
					};
				});
			}
					

			// call update functions of pie-chart and legend.
			pC.update(nD);
			leg.update(nD);

			document.getElementById("pieTitle").innerText = "Task Breakdown for "
					+ d[0];
		}

		function mouseout(d) { // utility function to be called on mouseout.
        	hideTooltip(this);

			// reset the pie-chart and legend.
			pC.update(tF);
			leg.update(tF);
			if (isGroup == 'true') {
				document.getElementById("pieTitle").innerText = "Task Breakdown for All Groups";
			} else {
				document.getElementById("pieTitle").innerText = "Task Breakdown for All Users";
			}
		}
	

		// create function to update the bars. This will be used by pie-chart.
		hG.update = function(nD, color) {

			// update the domain of the y-axis map to reflect change in
			// statusuencies.
			y.domain([ 0, d3.max(nD, function(d) {return d[1];}) ]);

			// update X labels
			x.domain(nD.map(function(d) {return d[0];}))

			var lables = hGsvg.selectAll(".nameLabel")
						.data(nD)
						.transition()
						.duration(500)
						.text(function(d) {return d[0];});
         
			// Attach the new data to the bars.
			var bars = hGsvg.selectAll(".bar").data(nD);

			// transition the height and color of rectangles.
			bars.select("rect").transition()
						.duration(500)
						.attr("y",function(d) {return y(d[1]);})
						.attr("x", function(d) {return x(d[0]);})
						.attr("width", x.rangeBand())
						.attr("height", function(d) {return hGDim.h - y(d[1]);})
						.attr("fill", color);

			// transition the statusuency labels location and change value.
			bars.select("text").transition()
						.duration(500)
						.text(function(d) {return d3.format(",")(d[1])})
						.attr("y", function(d) {return y(d[1]) - 5;});
		}
		return hG;
	}

	// function to handle pieChart.
	function pieChart(pD) {
		var pC = {}, pieDim = {
			w : 400,
			h : 300
		};
		pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

		// create svg for pie chart.
		var piesvg = d3.select(pieId).append("svg")
					.attr("width", pieDim.w)
					.attr("height", pieDim.h)
					.append("g")
					.attr("transform", "translate(" + ((pieDim.w) / 2) + "," + (pieDim.h) / 2 + ")");

		// create 2 different groups (1 for pie slices and 1 for labels).
		piesvg.append("g").attr("class", "slices");

		// create function to draw the arcs of the pie slices.
		var arc = d3.svg.arc().outerRadius(pieDim.r * 0.8).innerRadius(0);

		// define the radius of the arcs after you mouse over them.
		var arcOver = d3.svg.arc().outerRadius(pieDim.r * 0.9);

		// create a function to compute the pie slice angles.
		var pie = d3.layout.pie().sort(null)
					.value(function(d) {return d.status;});

		// Draw the pie slices.
		var slice = piesvg.select(".slices").selectAll("slice").data(pie(pD));

		// Create the slices
		slice.enter().insert("path").attr("class", "slice")
					.attr("d", arc)
					.each(function(d) {	
						this._current = d;
						//console.log("fData.totalList: "+JSON.stringify(fData.totalList));
						if(isFirst && d.data.status != 0){
							firstType = d.data.type;
							d3.select(this).attr("stroke", "white")
							.transition()
							.duration(250)
							.attr("d", arcOver)
							.attr("stroke-width", 3)
							.attr("id", "firstPie");
							isFirst=false;
						}
					})
					.style("fill", function(d) {return segColor(d.data.type);})
					.on("mouseover", mouseover)
					.on("mouseout", mouseout);

		pC.update = function(nD) {
			// update pie
			piesvg.select(".slices").selectAll("path")
					.data(pie(nD))
					.transition()
					.duration(500)
					.attrTween("d", arcTween);

		}


		// Utility function to be called on mouseover a pie slice.
		function mouseover(d) {
			var type = d.data.type;
			// console.log("Status: " + type);
			switch (type) {

			case 'Completed':
				// call the update function of histogram with new data.
				hG.update(fData.completedList.map(function(v) {
					return [ v.ownerName, v.status[d.data.type] ];
				}), segColor(d.data.type));
				break;

			case 'Assigned':
				// call the update function of histogram with new data.
				hG.update(fData.assignedList.map(function(v) {
					return [ v.ownerName, v.status[d.data.type] ];
				}), segColor(d.data.type));
				break;

			case 'Accepted':
				// call the update function of histogram with new data.
				hG.update(fData.acceptedList.map(function(v) {
					return [ v.ownerName, v.status[d.data.type] ];
				}), segColor(d.data.type));
				break;

			default:
				// call the update function of histogram with new data.
				hG.update(fData.totalList.map(function(v) {
					return [ v.ownerName, v.status[d.data.type] ];
				}), segColor(d.data.type));
			}
			d3.select("#firstPie").transition().duration(250).attr("d", arc).attr("stroke", "none");

			// animate a selected slice
			d3.select(this).attr("stroke", "white")
						.transition()
						.duration(250)
						.attr("d", arcOver)
						.attr("stroke-width", 3);

			document.getElementById("hgTitle").innerText = d.data.type + " Tasks";
		}
		// Utility function to be called on mouseout a pie slice.
		function mouseout(d) {
			// call the update function of histogram with all data.
			hG.update(fData.totalList.map(function(v) {
				return [ v.ownerName, v.status.Total ];
			}), barColor);

			// deselect the slice
			d3.select(this).transition().duration(250).attr("d", arc).attr("stroke", "none");

			document.getElementById("hgTitle").innerText = "Total Tasks";
		}
		// Animating the pie-slice requiring a custom function which specifies
		// how the intermediate paths should be drawn.
		function arcTween(a) {
			var i = d3.interpolate(this._current, a);
			this._current = i(0);
			return function(t) {
				return arc(i(t));
			};
		}
		return pC;
	}

	// function to handle legend.
	function legend(lD) {
		var leg = {};

		// create table for legend.
		var legend = d3.select(legendId).append("table")
				.attr('class', 'legend');

		// create one row per segment.
		var tr = legend.append("tbody").selectAll("tr")
					.data(lD)
					.enter()
					.append("tr");

		// create the first column for each segment.
		tr.append("td").append("svg")
					.attr("width", '16')
					.attr("height", '16')
					.append("rect")
					.attr("width", '16')
					.attr("height", '16')
					.attr("fill", function(d) {	return segColor(d.type);});

		function mouseover(d) {
			d3.select(pieId).attr("stroke", "white")
					.transition()
					.duration(500)
					.attr("d", arcOver)
					.attr("stroke-width", 3);
		}

		function mouseout(d) {
			d3.select(pieId)
					.transition()
					.duration(500)
					.attr("d", arc)
					.attr("stroke", "none");
		}

		// create the second column for each segment.
		tr.append("td").text(function(d) {
			return d.type;
		});

		// create the third column for each segment.
		tr.append("td").attr("class", 'legendFreq').text(function(d) {
			return d3.format(",")(d.status);
		});

		// create the fourth column for each segment.
		tr.append("td").attr("class", 'legendPerc').text(function(d) {
			return getLegend(d, lD);
		});

		// Utility function to be used to update the legend.
		leg.update = function(nD) {
			// update the data attached to the row elements.
			var l = legend.select("tbody").selectAll("tr").data(nD);

			// update the statusuencies.
			l.select(".legendFreq").text(function(d) {
				return d3.format(",")(d.status);
			});

			// update the percentage column.
			l.select(".legendPerc").text(function(d) {
				return getLegend(d, nD);
			});
		}

		function getLegend(d, aD) { // Utility function to compute percentage.
			return d3.format("%")(d.status / d3.sum(aD.map(function(v) {
				return v.status;
			})));
		}

		return leg;
	}

	// calculate total statusuency by segment for all state.
	var tF = [ 'Assigned', 'Accepted', 'Completed' ].map(function(d) {
		return {
			type : d,
			status : d3.sum(fData.totalList.map(function(t) {
				return t.status[d];
			}))
		};
	});

	// calculate total statusuency by state for all segment.
	var sF = fData.totalList.map(function(d) {
		//console.log(d);
		return { name: d.ownerName, status: d.status.Total};
	});

			var hG = histoGram(sF), // create the histogram.
	        pC = pieChart(tF), // create the pie-chart.
	        leg = legend(tF); // create the legend.
		
		switch (firstType) {
	
		case 'Completed':
			// call the update function of histogram with new data.
			hG.update(fData.completedList.map(function(v) {
				return [ v.ownerName, v.status[firstType] ];
			}), segColor(firstType));
			break;
	
		case 'Assigned':
			// call the update function of histogram with new data.
			hG.update(fData.assignedList.map(function(v) {
				return [ v.ownerName, v.status[firstType] ];
			}), segColor(firstType));
			break;
	
		case 'Accepted':
			// call the update function of histogram with new data.
			hG.update(fData.acceptedList.map(function(v) {
				return [ v.ownerName, v.status[firstType] ];
			}), segColor(firstType));
			break;
		}
		document.getElementById("hgTitle").innerText = firstType + " Tasks";
};