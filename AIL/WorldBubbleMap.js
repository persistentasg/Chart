var projection;
var svg;
var scaleFactor;
function buildBubbleMap(data, id) {

	var madData = "world-countries.json";
	var w = 900;
	var h = 400;
	var path, center, scale, bounds, hscale, vscale, offset, xy;
	d3.json(madData, function(error, collection) {
		if(error){
			console.log(error.response);
		}
		// create a first guess for the projection
		center = d3.geo.centroid(collection)
		scale = 100;
		offset = [ w / 2, h / 2 ];
		projection = d3.geo.equirectangular().scale(scale).center(center)
				.translate(offset);

		// create the path
		path = d3.geo.path().projection(projection);

		// using the path determine the bounds of the current map and use
		// these to determine better values for the scale and translation
		bounds = path.bounds(collection);
		hscale = 0.95 * scale * w / (bounds[1][0] - bounds[0][0]);
		vscale = 0.95 * scale * h / (bounds[1][1] - bounds[0][1]);
		scale = (hscale < vscale) ? hscale : vscale;
		offset = [ w - (bounds[0][0] + bounds[1][0]) / 2,
				h - (bounds[0][1] + bounds[1][1]) / 2 ];

		// new projection
		projection = d3.geo.equirectangular()
					.center(center)
					.scale(scale)
					.translate(offset);

		path = path.projection(projection);

		var xy = projection = d3.geo.equirectangular()
					.center(center)
					.scale(scale)
					.translate(offset);


		svg = d3.select(id)
					.insert("svg:svg")
					.attr("width", w)
					.attr("height", h);

		var states = svg.append("svg:g").attr("id", "states");

		var circles = svg.append("svg:g").attr("id", "dots");

		var labels = svg.append("svg:g").attr("id", "labels");

		d3.json(madData, function(collection) {
				states.selectAll("path")
						.data(collection.features)
						.enter()
						.append("svg:path")
						.attr("d", path)
						.on("mouseover", function(d) {
							d3.select(this)
								.style("fill", "#6C0")
								.append("svg:title")
								.text(d.properties.name);
						})
						.on("mouseout", function(d) {
							d3.select(this).style("fill", "#ccc");
						})
		});
				scalefactor = 100;
				updateWorldBubbles(data);
		});
}

function mapUS(data, id){
	
	var mapData = "united-states.json";
	var w = 900;
	var h = 400;
	var path, center, scale, bounds, hscale, vscale, offset, xy;
	var rotate = [96, 0];
	d3.json(mapData, function(error, collection) {
		if(error){
			console.log(error.response);
		}
		// create a first guess for the projection
		center = [-.6, 38.7];
		scale = 900;
		offset = [ w / 2, h / 2 ];
		
		projection = d3.geo.albersUsa()
	    .scale(scale)
	    .translate([w / 2, h / 2])
	    .precision(.1);
		
//		projection = d3.geo.albers()
//	    .rotate(rotate)
//	    .center(center)
//	    .parallels([40.5, 45.5])
//	    .scale(scale)
//	    .translate([w / 2, h / 2])
//	    .precision(.1);

		// create the path
		path = d3.geo.path().projection(projection);

		// using the path determine the bounds of the current map and use
		// these to determine better values for the scale and translation
		bounds = path.bounds(collection);
		hscale = 0.95 * scale * w / (bounds[1][0] - bounds[0][0]);
		vscale = 0.95 * scale * h / (bounds[1][1] - bounds[0][1]);
		scale = (hscale < vscale) ? hscale : vscale;
		offset = [ w - (bounds[0][0] + bounds[1][0]) / 2,
				h - (bounds[0][1] + bounds[1][1]) / 2 ];

		svg = d3.select(id)
					.insert("svg:svg")
					.attr("width", w)
					.attr("height", h);

		var states = svg.append("svg:g").attr("id", "states");

		var circles = svg.append("svg:g").attr("id", "dots");

		var labels = svg.append("svg:g").attr("id", "labels");

		d3.json(mapData, function(collection) {
				states.selectAll("path")
						.data(collection.features)
						.enter()
						.append("svg:path")
						.attr("d", path)
						.on("mouseover", function(d) {
							d3.select(this)
								.style("fill", "#6C0")
								.append("svg:title")
								.text(d.properties.name);
						})
						.on("mouseout", function(d) {
							d3.select(this).style("fill", "#ccc");
						})
		});
				scalefactor = 50;
				updateWorldBubbles(data);
		});
}

function updateWorldBubbles(data){
	
	var xy = projection;
	
	var circles = svg.select("#dots")
				.selectAll(".dot")
				.data(data);

	var labels = svg.select("#labels")
				.selectAll(".label")
				.data(data);

	circles.enter()
				.append("svg:circle")
				.attr("class", "dot")
				.attr("fill", "steelblue")
				.attr("cx", function(d, i) {return xy([ +d["longitude"], +d["latitude"] ])[0];})
				.attr("cy", function(d, i) {return xy([ +d["longitude"], +d["latitude"] ])[1];})
				.attr("r", function(d) {return Math.sqrt((+d["count"]) * scalefactor);})
				.attr("title", function(d) {return d["countryName"] + ": " + d["count"];})
				.on("mouseover", function(d) {d3.select(this).style("fill", "#FC0");})
				.on("mouseout", function(d) {d3.select(this).style("fill", "steelblue");});
	circles.transition()
				.attr("title", function(d) {return d["countryName"] + ": " + d["count"];})
				.attr("r", function(d) {return Math.sqrt((+d["count"]) * scalefactor);});
	
	circles.exit().transition().remove();
	

	labels.enter()
				.append("svg:text")
				.attr("class", "label")
				.attr("x", function(d, i) {return xy([ +d["longitude"], +d["latitude"] ])[0];})
				.attr("y", function(d, i) {return xy([ +d["longitude"], +d["latitude"] ])[1];})
				.attr("dy", "0.3em").attr("text-anchor", "middle").text(function(d) {return d["count"];});
	
	labels.transition()
				.attr("dy", "0.3em").attr("text-anchor", "middle").text(function(d) {return d["count"];});
	
	labels.exit().transition().remove();
	
}
