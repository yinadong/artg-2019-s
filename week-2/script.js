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

		//Convert metadata to a map
		const metadata_tmp = metadata.map(a => {
			return [a.iso_num, a]
		});
		const metadataMap = new Map(metadata_tmp);

		const migrationAugmented = migration.map(d => {

			const origin_code = countryCode.get(d.origin_name);
			const dest_code = countryCode.get(d.dest_name);

			d.origin_code = origin_code;
			d.dest_code = dest_code;

			//Take the 3-digit code, get metadata record
			const origin_metadata = metadataMap.get(origin_code);
			const dest_metadata = metadataMap.get(dest_code);

			// if(!origin_metadata){
			// 	console.log(`lookup failed for ` + d.origin_name + ' ' + d.origin_code);
			// }
			// if(!dest_metadata){
			// 	console.log(`lookup failed for ${d.origin_name} ${d.origin_code}`)
			// }
			if(origin_metadata){
				d.origin_subregion = origin_metadata.subregion;
			}
			if(dest_metadata){
				d.dest_subregion = dest_metadata.subregion;
			}

			return d;
		});
		
		console.log(migrationAugmented);

	})


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
		d.Code.padStart(3, '0')
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