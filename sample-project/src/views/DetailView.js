import { nest, select } from 'd3';
import LineChart from './LineChart';

export default function(_){

	let w = 200;
	let h = 160;

	function module(data, countryCode, asOrigin = false){

		// Perform data transformation
		// Reduce data to only the part concerned with a particular country
		const filteredData = data.filter(d => {
			if(asOrigin){
				return d.origin_code === countryCode
			}else{
				return d.dest_code === countryCode
			}
		});

		const originDestination = nest()
			.key(d => {
				return asOrigin?d.dest_code:d.origin_code
			})
			.entries(filteredData);

		// Build DOM
		const subCharts = select(_)
			.selectAll('.line-chart')
			.data(originDestination, d => d.key);
		const subChartsEnter = subCharts.enter()
			.append('div')
			.attr('class', 'line-chart');
		subCharts.exit().remove();

		subCharts.merge(subChartsEnter)
			.style('width', `${w}px`)
			.style('height', `${h}px`)
			.style('float','left')
			.each(function(d){
				const lineChart = LineChart(this)
					.width(w)
					.height(h);
				lineChart(d.values);
			});

	}

	return module;

}