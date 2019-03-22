//create d3 axis "generator" function
const axisX  // __function B
     = d3.axisBottom();  
       .scale(scale)
       .tickValue(...)
       .tickFormate(...)
       .tickSize(...);

d3.select(...).call(axisX)
axisX(d3.select(...));





function Rangeslider(){   //factory function

	//default values, per factory 
	let color = '#ccc';
	let sliderValues = [];
	let W = 600;
	let H = 100;
	let margin = {l:20, r:20};

	//after calll event, dispatch call the other function scope 
	const internalDispatch = d3.dispatch('slider')



	const scaleX = 

	function exports(container){    //product function is inner scope 
	 //build the dom element correspanding to the sldier
	 
     const dragBehavior = d3.drag()
        .on('start', function(){
         console.log("Drag start")
         handle.attr('fill', 'red');
        })
        .on('end', function(){})
        .on('drag', function(){})


     container.style('width', ``)

     
     const svg = container.selectAll('svg')
          .data([1]);
     let svgEnter = svg.enter()
         .append("svg");

     let sliderInner = svgEnter.append('g')
          .attr('class', 'range-slider-inner')

     svg.merge(svgEnter)

     sliderInner = svg.merge(svgEnter)
     sliderInner.select()
     .attr();
     sliderInner.select()
     .attr( )


	
     

	}

	
	exports.color = function(_){
		if (!_){
			return color; //'get'
		}
		color = _; //'set'
		return this;
	}

	exports.values = function(event, callback){
      if(!_){
      	sliderValues = 
      	return this;
      }
		

	}

	return exports;

}

const slider1 = Rangeslider();
                .color('#333') //slider1
                .values([1,2,3,4,5])//slider1 Arrayproduce 
                //.on(event, eventCallbackFunction)
                .on('slider', value => console.log(value));//callback function 

console.log(slider1)

slider1(
	d3.select('.slider-container')
)
//d3.select('.slider-container').call(slider1)

const sliderValue = scaleX.invert(currentX);
internalDispatch.call('slide', null, sliderValue);

