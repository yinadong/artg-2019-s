//Dispatch
const dispatch = d3.dispatch('update:force');

//dat.gui library for displaying UI
const gui = new dat.gui.GUI();
const obj = {
	useForceX: true,
	useForceY: true,
	useForceManyBody: true,
	forceManyBodyStrength: -1,
	useForceCollide: true,
	forceCollideRadius: 8,
	useForceLink: true
}
const f1 = gui.addFolder('Force X');
f1.add(obj, 'useForceX').onChange(() => dispatch.call('update:force', null, obj));
const f2 = gui.addFolder('Force Y');
f2.add(obj, 'useForceY').onChange(() => dispatch.call('update:force', null, obj));
const f3 = gui.addFolder('Force Many Body');
f3.add(obj, 'useForceManyBody').onChange(() => dispatch.call('update:force', null, obj));
f3.add(obj, 'forceManyBodyStrength').min(-30).max(5).onChange(() => dispatch.call('update:force', null, obj));
const f4 = gui.addFolder('Force Collide');
f4.add(obj, 'useForceCollide').onChange(() => dispatch.call('update:force', null, obj));
f4.add(obj, 'forceCollideRadius').min(0).max(20).onChange(() => dispatch.call('update:force', null, obj));
const f5 = gui.addFolder('Force Link');
f5.add(obj, 'useForceLink').onChange(() => dispatch.call('update:force', null, obj));

//Prepare DOM canvas
const w = d3.select('.plot').node().clientWidth;
const h = d3.select('.plot').node().clientHeight;
const plot1 = d3.select('#plot-1').append('svg').attr('width',w).attr('height',h);

//Import data
const migrationDataPromise = d3.csv('../../data/un-migration/Table 1-Table 1.csv', parseMigrationData)
	.then(data => data.reduce((acc,v) => acc.concat(v), []));

//Converts origin destination flows to nodes and links
function generateNetwork(data, year){
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
