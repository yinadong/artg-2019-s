console.log("Week 11: geographical representation part I");

//Full list of projections here:
//https://github.com/d3/d3-geo-projection

//Examples of mapping projects here
//http://bl.ocks.org/palewire/d2906de347a160f38bc0b7ca57721328

const lngLatBoston = [-71.0589, 42.3601];

d3.json('./countries.geojson')
	.then(function(data){

		console.log(data);
	
		renderCylindricalProjection(data, document.getElementById('chart-1'));
		//renderAzimuthalMap(data, document.getElementById('chart-2'));
		//renderConicalProjection(data, document.getElementById('chart-3'));
		renderCollection(data, document.getElementById('chart-4'));

	});

function renderCylindricalProjection(geo, dom){
	console.log('Render world map in cylindrical projection');

	//Append DOM
	const w = dom.clientWidth;
	const h = dom.clientHeight;
	const plot = d3.select(dom).append('svg')
		.attr('width', w)
		.attr('height', h);

	//Create a projection function
	const projection = d3.geoMercator()
		.center(lngLatBoston) //project the geometry cneter to svg(scrren) center
		.translate([w/2, h/2])
		//.precision(0)
		.scale(200)  //scale how much percentange area in the canvas
		//.clipAngle(45)

	const xy = projection(lngLatBoston);
	console.log(xy);

	plot.append('circle')  //located boston
	    .datum(projection(lngLatBoston))// one to one
	    .attr('cx', function(d){return d[0]})
	    .attr('cy', function(d){return d[1]})
	    .attr('r', 10)
	    .style('fill','red');

	const pathGenerator = d3.geoPath(projection);

	plot.append('path')
	   .datum(geo)
	   .attr('d', function(d){return pathGenerator(d)});

	const graticules = d3.geoGraticule(); //lat and long

	plot.append('path')
	  .datum(graticules)
	  .attr('d', function(d){return pathGenerator(d)})
	  .style('stroke-opacity', .2)
	  .style('stroke-width', '1px')
	  .style('fill', 'none');
}



function renderAzimuthalMap(geo, dom){
	console.log('Render world map in azimuthal projection');

	//Append DOM
	const w = dom.clientWidth;
	const h = dom.clientHeight;
	const plot = d3.select(dom).append('svg')
		.attr('width', w)
		.attr('height', h);

	//Create a projection function
	const projection = d3.geoOrthographic()
		.translate([w/2, h/2])
		.precision(0)
		.rotate([-lngLatBoston[0],-lngLatBoston[1],0])

	console.group('Azimuthal projection properties');
	console.log(`Scale: ${projection.scale()}`)
	console.log(`Center: ${projection.center()}`)
	console.log(`Translate: ${projection.translate()}`);
	console.groupEnd();

	//Create a geoPath generator
	const pathGenerator = d3.geoPath(projection);

	//Render geo path
	plot.append('path')
		.datum(geo)
		.attr('d', pathGenerator);

	//Render a single point
	plot.append('circle')
		.datum(lngLatBoston)
		.attr('cx', function(d){ return projection(lngLatBoston)[0] })
		.attr('cy', function(d){ return projection(lnglatBoston)[1] })
		.attr('r', 6)
		.style('stroke','black')
		.style('stroke-width', '2px')
		.style('fill', 'yellow');

	//Create a graticules generator
	const graticules = d3.geoGraticule()

	//Render graticules
	plot.append('path')
		.attr('class', 'graticules')
		.datum(graticules)
		.attr('d', pathGenerator)
		.style('stroke','#333')
		.style('stroke-opacity', .2)
		.style('stroke-width','1px')
		.style('fill','none')

}

function renderConicalProjection(geo, dom){

}

function renderCollection(geo, dom){
	console.log('Render world map in cylindrical projection with different data binding');

	//Append DOM
	const w = dom.clientWidth;
	const h = dom.clientHeight;
	const plot = d3.select(dom).append('svg')
		.attr('width', w)
		.attr('height', h);
	
	const projection = d3.geoMercator()
	     .translate ([w/2, h/2])
	     .scale(150)
	     //.fitExtent([0,0], [w,h], geo);
	const pathGenerator = d3.geoPath(projection);
	
	console.log(geo.features);

	plot.selectAll('path')
	 .data(geo.features, function(d){return d.properties.ISO_A3 })
	    //.attr('d', function{return pathGenerator(d)})
	 .enter()
	 .append('path')
	 .attr('d', pathGenerator)
	 .style('fill', function(d,i){
	   return `rgb(${i},${255-i},255)`
	 })
	 .on('mousecenter', function(d,i){
	  d3.select(this)//this is the DOM node
	    .style('stroke','black')
	    .style('stroke-width', '1px');
	 })
	 .on('mouseleave', function(d,i){
	 d3.select(this)
	   .style('stroke','black')
	   .style('stroke-width', '0px');
	 })
    //.on('click', function(){
    //})r

}

