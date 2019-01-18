const migrationDataPromise = d3.csv('../data/un-migration/Table 1-Table 1.csv', parseMigrationData)
	.then(data => data.reduce((acc,v) => acc.concat(v), []));
const countryCodePromise = d3.csv('../data/un-migration/ANNEX-Table 1.csv', parseCountryCode)
	.then(data => new Map(data));
const metadataPromise = d3.csv('../data/country-metadata.csv', parseMetadata);

Promise.all([
		migrationDataPromise,
		countryCodePromise,
		metadataPromise
	])
	.then(([migration, countryCode, metadata]) => {

		const years = d3.nest()
			.key(d => d.year)
			.entries(migration) // array of 8 elements, for each element, {key:"1990", values:[...]}
			.map(a => {
				return {
					key: a.key,
					total: d3.sum(a.values, function(d){return d.value})
				}
			});

		const origins = d3.nest()
			.key(d => d.origin_name)
			.entries(migration)
			.map(a => {
				return a.key
			})

		//Reduce/filter dataset down to those records originating from the US
		const migrationFromUS = migration
			.filter(d => { return d.origin_name === 'United States of America' })
			.filter(d => d.dest_name === 'Japan')
			.filter(d => d.year === 1995)

		console.log(migrationFromUS[0]);

	})



/* 
 * DATA DISCOVERY
 */

// Convert metadata into a map, with ISO_num as the key
// Then console.log the metadata map and observe its structure

// console.log countryCode map and observe its structure

// For the migration dataset, how many years does it cover? How many origin countries? How many destination countries?

// Let's filter this the migration dataset
// How many people from the U.S. lived in Japan in the year 1995?

// How many people from the U.S. lived abroad in the year 1995?

// How many people from the U.S. lived aborad in all the years in the dataset?

// How many people from abroad lived in the U.S. in all the years in the dataset?

/* 
 * DATA TRANSFORMATION
 */
// Join the migration dataset with countryCode

// Further join the dataset with region and subregion

// Nest/group data by subregion, and produce time-series data for each subregion



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
	const year = +d.Year
	
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