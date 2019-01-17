import './style.css';
import {
	metadataPromise,
	combinedMigrationDataPromise
} from './data';
import DetailView from './views/DetailView';

// Create modules
const detailView = DetailView(document.querySelector('.detail-view'));

// Import data
// Once data is imported, propagate data to modules
Promise.all([metadataPromise, combinedMigrationDataPromise])
	.then(([metadata, migrationData]) => {
		console.log('Data:import complete');

		console.log(metadata);
		console.log(migrationData);

		detailView(migrationData, "250", true);
	})

