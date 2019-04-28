console.log('in class slider');

// //create d3 axis "generator" function
// const axisX //--> function B
// 	= d3.axisBottom()
// 		.scale(scale)
// 		.tickValues(...)
// 		.tickFormat(...)
// 		.tickSize(...);
// 	 //function A

// d3.select(...).call(axisX);

// axisX(d3.select(...));

function RangeSlider(){

	//default values, per factory
	let color = '#ccc';
	let sliderValues = [];
	let W = 600;
	let H = 100;
	let margin = {l:20, r:20};
	const internalDispatch = d3.dispatch('slide');

	function exports(container, data){
		//Build the DOM elements corresponding to the slider
		//append track, circle, axis to the root dom element
		
		//drag behavior
		const dragBehavior = d3.drag()
			.on('start', function(){
				handle
					.attr('fill','red')
					.attr('r',12);
			})
			.on('end', function(){
				handle.attr('fill',color)
					.attr('r',8);
			})
			.on('drag', function(){
				let currentX = d3.event.x;
				if(currentX < 0){
					currentX = 0;
				}else if(currentX > w){
					currentX = w;
				}
				handle.attr('cx', currentX);

				const sliderValue = scaleX.invert(currentX);
				internalDispatch.call('slide', null, sliderValue);
			});

		//Set dimensions
		container.style('width', `${W}px`);
		container.style('height', `${H}px`);
		const w = W - margin.l - margin.r;

		//axis
		const scaleX = d3.scaleLinear()
			.range([0,w])
			.domain(d3.extent(sliderValues));
		const axisX = d3.axisBottom()
			.scale(scaleX)
			.tickValues(sliderValues);

		//Appending
		let svg = container.selectAll('svg')
			.data([1]);
		let svgEnter = svg.enter()
			.append('svg');

		//from the enter selection, append all necessary DOM elements
		let sliderInner = svgEnter.append('g')
			.attr('class', 'range-slider-inner');
		sliderInner.append('line').attr('class','track-outer');
		sliderInner.append('line').attr('class','track-inner');
		sliderInner.append('circle').attr('class','drag-handle');
		sliderInner.append('g').attr('class','ticks');

		//Update
		svg.merge(svgEnter)
			.attr('width', W)
			.attr('height', H);
		sliderInner = svg.merge(svgEnter)
			.select('.range-slider-inner')
			.attr('transform', `translate(${margin.l}, ${H/2})`);
		sliderInner.select('.track-outer')
			.attr('stroke',color)
			.attr('stroke-width','8px')
			.attr('stroke-linecap', 'round')
			.attr('x1',w);
		sliderInner.select('.track-inner')
			.attr('stroke','white')
			.attr('stroke-width','2px')
			.attr('stroke-linecap', 'round')
			.attr('x1',w);
		const handle = sliderInner.select('.drag-handle')
			.attr('r',8)
			.attr('fill',color)
			.attr('stroke','white')
			.attr('stroke-width','2px')
			.style('cursor','pointer')
			.call(dragBehavior);
		sliderInner.select('.ticks')
			.call(axisX)
			.select('.domain')
			.style('display','none');

	}

	//Getter/setter function
	exports.color = function(_){
		if(!_){
			return color; //"get"
		}
		color = _; //"set"
		return this;
	}

	exports.values = function(_){
		if(!_){
			return sliderValues;
		}
		sliderValues = _;
		return this;
	}

	exports.on = function(event, callback){

		internalDispatch.on(event, callback);
		return this;
	}

	return exports;

}

//"idiomatic"
const slider1 = RangeSlider()
	.color('#333')
	.values([1,2,3,4])
	.on(
		'slide', value => console.log(value) //"callback function", which is a function
	);

d3.select('.slider-container').call(slider1)

const slider2 = RangeSlider()
	.values([1990,1995,2000])
	.on(
		'slide',
		value => {
			//
		}
	)
