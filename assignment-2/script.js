const migrationDataPromise = d3.csv('../data/un-migration/Table 1-Table 1.csv', parseMigrationData)
	.then(data => data.reduce((acc,v) => acc.concat(v), []));
const countryCodePromise = d3.csv('../data/un-migration/ANNEX-Table 1.csv', parseCountryCode)
	.then(data => new Map(data));
const metadataPromise = d3.csv('../data/country-metadata.csv', parseMetadata);


//Import all data via parallel promises
Promise.all([
		migrationDataPromise,
		countryCodePromise,
		metadataPromise
	]).then(([migration, countryCode, metadata]) => {

		//DATA MANIPULATION
		//Convert metadata to a metadata map
		const metadata_tmp = metadata.map(d => {
				return [d.iso_num, d]
			});
		//console.log(metadata_tmp);
		//console.log(countryCode.get("Other North"));
		const metadataMap = new Map(metadata_tmp);
		console.log(metadataMap);

		//Let's pick a year, say 2000, and filter the migration data
		const migration_2000 = migration.filter(d => d.year === 2000);
		console.log(migration_2000);

		//YOUR CODE HERE
		//Nest/group migration_2000 by origin_country
		//Then sum up the total value, using either nest.rollup or array.map
		let migration_origin_by_country = d3.nest() //COMPLETE HERE
		                 .key( d => d.origin_name)
		                 // .key( d => d.dest_name)
		                 .rollup(values => d3.sum(values, d => d.value))
		                 .entries(migration_2000);
		console.log(migration_origin_by_country);

		//YOUR CODE HERE
		//Then, join the transformed migration data to the lngLat values in the metadata
		const migrationAugment = migration_2000.map(d => {
			const origin_code = countryCode.get(d.origin_name);
			const dest_code = countryCode.get(d.dest_name);

			d.origin_code = origin_code;
			d.dest_code = dest_code;

			//Take the 3-digit code, get metadata record
			const origin_metadata = metadataMap.get(origin_code);
			const dest_metadata = metadataMap.get(dest_code);

			if(origin_metadata){
				d.origin_subregion = origin_metadata.subregion;
				d.origin_lngLat = origin_metadata.lngLat;
			}
			if(dest_metadata){
				d.dest_subregion = dest_metadata.subregion;
				d.dest_lngLat = dest_metadata.lngLat;
			}

			return d;

		});
       console.log(migrationAugment);

		let migration_origin_totals = d3.nest() //COMPLETE HERE
		                 .key( d => d.origin_name)
		                 // .key( d => d.dest_name)
		                 // .rollup(values => d3.sum(values, d => d.value))
		                 .entries(migrationAugment);
		//REPRESENT
		
		migration_origin_totals.forEach(function(d) {
			let total = 0;
			d.values.forEach(function(dd) {
				total += dd.value;
			});
			d.total = total;
		});

		console.log(migration_origin_totals);
		
		drawCartogram(
			d3.select('.cartogram').node(), 
			migration_origin_totals
		);
		
	})

//YOUR CODE HERE
//Complete the drawCartogram function
//Some of the functions related to geographic representation have already been implemented, so feel free to use them
function drawCartogram(rootDom, data){

	console.log(data);

	//measure the width and height of the rootDom element
	const w = rootDom.clientWidth;
	const h = rootDom.clientHeight;

	//projection function: takes [lng, lat] pair and returns [x, y] coordinates
	const projection = d3.geoMercator()
		.translate([w/2, h/2])
		.scale(180);

	//Scaling function for the size of the cartogram symbols
	//Assuming the symbols are circles, we use a square root scale
	const scaleSize = d3.scaleSqrt().domain([0,1000000]).range([5,50]);

	//Complete the rest of the code here
	//Build the DOM structure using enter / exit / update
	const plot = d3.select(rootDom)
		.append('svg')
		.attr('width', w)
		.attr('height', h)
		.append('g');

	const nodes = plot.selectAll('.node')
		.data(data, d => d.key);
	const nodesEnter = nodes.enter().append('g')
		.attr('class', 'node');
	nodesEnter.append('circle');
	nodesEnter.append('text').attr('text-anchor', 'middle');

	nodes.merge(nodesEnter)
		.filter(d => d.values[0].lngLat)
		.attr('transform', d => {
			const xy = projection(d.lngLat);
			return `translate(${xy[0]}, ${xy[1]})`;
		})
	nodes.merge(nodesEnter)
		.select('circle')
		.attr('r', d => scaleSize(d.value))
		.style('fill-opacity', .03)
		.style('stroke', '#000')
		.style('stroke-width', '1px')
		.style('stroke-opacity', .2)
	nodes.merge(nodesEnter)
		.select('text')
		.attr('y', d => -scaleSize(d.value))
		.filter(d => d.value > 1000000)
		.text(d => d.name_display)
		.style('font-family', 'sans-serif')
		.style('font-size', '10px')

}

//Utility functions for parsing metadata, migration data, and country code
function parseMetadata(d){
	return {
		iso_a3: d.ISO_A3,
		iso_num: d.ISO_num,
		developed_or_developing: d.developed_or_developing,
		region: d.region,
		subregion: d.subregion,
		name_formal: d.name_formal,
		name_display: d.name_display,
		lngLat: [+d.lng, +d.lat]
	}
}

function parseCountryCode(d){
	return [
		d['Region, subregion, country or area'],
		d.Code
	]
}

function parseMigrationData(d){
	if(+d.Code >= 900) return;

	const migrationFlows = [];
	const dest_name = d['Major area, region, country or area of destination'];
	const year = +d.Year // '1997' - 1997 '1979-10-01'
	
	delete d.Year;
	delete d['Sort order'];
	delete d['Major area, region, country or area of destination'];
	delete d.Notes;
	delete d.Code;
	delete d['Type of data (a)'];
	delete d.Total;

	for(let key in d){
		const origin_name = key;
		const value = d[key];

		if(value !== '..'){
			migrationFlows.push({
				origin_name,
				dest_name,
				year,
				value: +value.replace(/,/g, '')
			})
		}
	}

	return migrationFlows;
}