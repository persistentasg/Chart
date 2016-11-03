var needle;

function gaugeChart(id, count) {

	d3.select(id).selectAll("*").remove();

	var barWidth, chart, chartInset, degToRad, repaintGauge, height, margin, numSections, padRad, percToDeg, percToRad, percent, radius, sectionIndx, svg, totalPercent, width;

	width = 50;

	percent = count / 1000;
	numSections = 1;
	sectionPerc = 1 / numSections / 2;
	padRad = 0.025;
	chartInset = 10;

	// Orientation of gauge:
	totalPercent = .75;

	el = d3.select(id);

	margin = {
		top : 0,
		right : 0,
		bottom : 40,
		left : 0
	};

	width = el[0][0].offsetWidth - margin.left - margin.right;
	height = width;
	radius = Math.min(width, height) / 2;
	barWidth = 30 * width / 300;

	/*
	 * Utility methods
	 */
	percToDeg = function(perc) {
		return perc * 360;
	};

	percToRad = function(perc) {
		return degToRad(percToDeg(perc));
	};

	degToRad = function(deg) {
		return deg * Math.PI / 180;
	};

	test = el.select(".gauge");
	if (!test.empty()) {
		//console.log("Not Empty!");
		svg = el.select('.gChart');
		chart = svg.append('g').attr('class', "gChart")
					.attr('transform', "translate(" + ((width + margin.left) / 2) + ", " + ((height + margin.top) / 2) + ")");
		chart.append('path').attr('class', "arc chart-filled");
		chart.append('path').attr('class', "arc chart-empty");
		arc2 = d3.svg.arc().outerRadius(radius - chartInset)
					.innerRadius(radius - chartInset - barWidth);
		arc1 = d3.svg.arc().outerRadius(radius - chartInset)
					.innerRadius(radius - chartInset - barWidth);

	} else {
		// Create SVG element
		svg = el.append('svg').attr('class', "gauge")
					.attr('width', width + margin.left + margin.right)
					.attr('height',(height / 2 + margin.top + margin.bottom));

		// Add layer for the panel
		chart = svg.append('g').attr('class', "gChart")
					.attr('transform', "translate(" + ((width + margin.left) / 2) + ", " + ((height + margin.top) / 2) + ")");
		chart.append('path').attr('class', "arc chart-filled");
		chart.append('path').attr('class', "arc chart-empty");

		arc2 = d3.svg.arc().outerRadius(radius - chartInset)
					.innerRadius(radius - chartInset - barWidth)
		arc1 = d3.svg.arc().outerRadius(radius - chartInset)
					.innerRadius(radius - chartInset - barWidth)

		text = svg.append('g')
					.attr('transform', "translate(" + ((width + margin.left) - 75) + ", " + ((height + margin.top) / 2 + 25) + ")");
		// text.append('text').text("30-day max 412");
	}
	repaintGauge = function(perc) {
		var next_start = totalPercent;
		arcStartRad = percToRad(next_start);
		arcEndRad = arcStartRad + percToRad(perc / 2);
		next_start += perc / 2;

		arc1.startAngle(arcStartRad).endAngle(arcEndRad);

		arcStartRad = percToRad(next_start);
		arcEndRad = arcStartRad + percToRad((1 - perc) / 2);

		arc2.startAngle(arcStartRad + padRad).endAngle(arcEndRad);

		chart.select(".chart-filled").attr('d', arc1);
		chart.select(".chart-empty").attr('d', arc2);

	}

	var Needle = (function() {

		/**
		 * Helper function that returns the `d` value for moving the needle
		 */
		var recalcPointerPos = function(perc) {
			var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
			thetaRad = percToRad(perc / 2);
			centerX = 0;
			centerY = 0;
			topX = centerX - this.len * Math.cos(thetaRad);
			topY = centerY - this.len * Math.sin(thetaRad);
			leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
			leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
			rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
			rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);
			return "M " + leftX + " " + leftY + " L " + topX + " " + topY
					+ " L " + rightX + " " + rightY;
		};

		function Needle(el) {
			this.el = el;
			this.len = width / 3;
			this.radius = this.len / 6;
		}

		Needle.prototype.render = function() {
			this.el.append('circle')
						.attr('class', 'needle-center')
						.attr('cx', 0)
						.attr('cy', 0)
						.attr('r', this.radius);
			return this.el.append('path')
						.attr('class', 'needle')
						.attr('d', recalcPointerPos.call(this, 0));
		};

		Needle.prototype.moveTo = function(perc) {
			var self, oldValue = this.perc || 0;

			this.perc = perc;
			self = this;

			// Reset pointer position
			this.el.transition()
						.delay(0)
						.ease('quad')
						.duration(0)
						.select('.needle')
						.tween('reset-progress', function() {
						return function(percentOfPercent) {
							var progress = (1 - percentOfPercent) * oldValue;

							repaintGauge(progress);
							return d3.select(this).attr('d',
									recalcPointerPos.call(self, progress));
							};
						});

			this.el.transition()
						.delay(300)
						.duration(0)
						.select('.needle')
						.tween('progress', function() {
								return function(percentOfPercent) {
									var progress = percentOfPercent * perc;

									repaintGauge(progress);
									return d3.select(this).attr('d', recalcPointerPos.call(self, progress));
								};
							});
						};
		return Needle;
	})();

	needle = new Needle(chart);
	needle.render();
	needle.moveTo(percent);
}
