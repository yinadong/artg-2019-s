import { csv } from 'd3';

import {
	parseMetadata,
	parseCountryCode,
	parseMigrationData
} from './utils';

export const metadataPromise = csv('./data/country-metadata.csv', parseMetadata);

//Import and flatten migration dataset
const migration = csv(
		'./data/un-migration/Table 1-Table 1.csv', 
		parseMigrationData
	)
	.then(data => data.reduce((acc,v) => acc.concat(v), []));

//Import country code lookup (from country name, look up 3-digit code)
const countryCode = csv(
		'./data/un-migration/ANNEX-Table 1.csv',
		parseCountryCode
	)
	.then(data => new Map(data));

//Combine migration data and countryCode
export const combinedMigrationDataPromise = Promise.all([
		migration,
		countryCode
	])
	.then(([m, c]) => {
		//combine "m" with 3 digit codes
		return m.map(flow => ({
			origin_code: c.get(flow.origin_name),
			dest_code: c.get(flow.dest_name),
			...flow
		}))
	})

