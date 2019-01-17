import { select, line, area, extent, max, scaleLinear, axisBottom, axisLeft } from 'd3';

export default function LineChart(_){

	let w = 300;
	let h = 200;
	let m = {t:32, r:16, b:32, l:32};
	let lineGenerator = line();
	let areaGenerator = area();
	let axisXGenerator = axisBottom();
	let axisYGenerator = axisLeft();

	// Internal variables
	function module(data){

		const innerW = w - m.l - m.r;
		const innerH = h - m.t - m.b;

		//Data discovery
		const xDomain = extent(data, d => d.year);
		const yDomain = [0, max(data, d => d.value)];
		const xScale = scaleLinear().domain(xDomain).range([0, innerW]);
		const yScale = scaleLinear().domain(yDomain).range([innerH, 0]);

		//Set up path generators
		lineGenerator.x(d => xScale(d.year)).y(d => yScale(d.value));
		areaGenerator.x(d => xScale(d.year)).y0(innerH).y1(d => yScale(d.value));
		axisXGenerator.scale(xScale);
		axisYGenerator.scale(yScale);

		//Build/update DOM
		let svg = select(_)
			.selectAll('svg')
			.data([1]);

		//Append enter elements
		let svgEnter = svg.enter().append('svg')
			.merge(svg);
		let plot = svgEnter.append('g')
			.attr('class','graph')
			.attr('transform', `translate(${m.l}, ${m.t})`);
		plot.append('path').attr('class','line')
			.style('fill','none')
			.style('stroke-width','2px')
			.style('stroke', '#333');
		plot.append('path').attr('class','area')
			.style('fill-opacity', 0.1);
		let axisX = svgEnter.append('g')
			.attr('class','axis axis-x')
			.attr('transform', `translate(${m.l}, ${m.t + innerH})`);
		let axisY = svgEnter.append('g')
			.attr('class','axis axis-y')
			.attr('transform', `translate(${m.l}, ${m.t})`);

		//Update update + enter elements
		svgEnter.merge(svg)
			.attr('width', w)
			.attr('height', h)
		svgEnter.merge(svg)
			.select('.line')
			.transition()
			.attr('d', lineGenerator(data))
		svgEnter.merge(svg)
			.select('.area')
			.transition()
			.attr('d', areaGenerator(data))
		svgEnter.merge(svg)
			.select('.axis-x')
			.transition()
			.call(axisXGenerator)
		svgEnter.merge(svg)
			.select('.axis-y')
			.transition()
			.call(axisYGenerator)

	}

	module.width = function(_){
		w = _;
		return this;
	}

	module.height = function(_){
		h = _;
		return this;
	}

	return module

}