/* Record interaction with UI elements */
const dispatch = d3.dispatch('ui-event');

//Log UI interactions
dispatch.on('ui-event', (target, type, value) => {
	console.log(target);
	console.log(type);
	console.log(value);
});

//Button interactions
d3.selectAll('.btn').on('click', function(){
	dispatch.call(
		'ui-event',
		null,
		'button',
		d3.event.type,
		d3.event.value
	);
});

//Text <input> interactions
const textInputs = d3.selectAll('input').filter(function(){ return this.type === 'text' });
textInputs
	.on('change', function(){
		dispatch.call(
			'ui-event',
			null,
			'text input',
			d3.event.type,
			d3.event.value || this.value
		);
	});

//<select> interactions
d3.select('select')
	.on('change', function(){
		dispatch.call(
			'ui-event',
			null,
			'select',
			d3.event.type,
			d3.event.value || this.value
		);
	});

