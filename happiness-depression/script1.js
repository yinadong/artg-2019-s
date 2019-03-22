
const W = d3.select('.chart').node().clientWidth;
const H = d3.select('.chart').node().clientHeight;
const margin = {t:32, r:16, b:64, l:64};
const w = W - margin.l - margin.r;
const h = H - margin.t - margin.b;

const plot = d3.select('.chart')
	.append('svg')
		.attr('width', W)
		.attr('height', H)
	.append('g')
		.attr('class','plot')
		.attr('transform', `translate(${margin.l}, ${margin.t})`);

const axisXNode = plot.append('g').attr('class','axis-x axis');
const axisYNode = plot.append('g').attr('class','axis-y axis');

const HappinessPromise = d3.csv('../data/happiness/happiness.csv', parseHappiness)
	.then(data => data.reduce((acc,v) => acc.concat(v), []));
const Substance_MentalPromise = d3.csv('../data/happiness/prevalence-by-mental-and-substance-use-disorder.csv', parseSubstance_Mental)
	//.then(data => new Map(data));
const DepressionbyGDPPromise = d3.csv('../data/happiness/share-with-depression-by-gdp-pc.csv', parseDepressionbyGDP);
const DepressionbyGenderPromise = d3.csv('../data/happiness/share-with-mental-or-substance-disorders-males-vs-females.csv', parseDepressionbyGender);

Promise.all([
		HappinessPromise,
		Substance_MentalPromise,
		DepressionbyGDPPromise,
		DepressionbyGenderPromise

	])
	.then(([Happiness, Substance_Mental, DepressionbyGDP, DepressionbyGender]) => {
    
    const happiness_tmp = d3.nest()
            .key(d => d.Year)
            .key(d => d.Countrycode)
            .entries(Happiness);

   // console.log(happiness_tmp);

    const happinessBy2008 = happiness_tmp
			.filter(function(d){return d.key === "2008"})[0]
			.values;
	//console.log(happinessBy2008);
    
    const happiness = happinessBy2008.map(a => {
			return [a.key, a.values]
		});

	const happinessMap = new Map(happiness);
	console.log(happinessMap);

   const Depression_tmp = d3.nest()
      .key(d => d.Year)
      .key(d => d.Countrycode)
      .entries(DepressionbyGDP);
     
     //console.log(Depression_tmp) ; 

     const DepressionBy2008 = Depression_tmp
			.filter(function(d){return d.key === "2008"})[0]
			.values;

    console.log(DepressionBy2008);

    const DepressionbyGDPAugmented = DepressionBy2008.map(d => {
		const happinessvalue = happinessMap.get(d.key)
		console.log(happinessvalue);
		//console.log(d)

		if(happinessvalue){
			//console.log(happinessvalue);

			//console.log(happinessvalue.value)
				d.values.happinessvalue = happinessvalue.filter(obj => {
					return obj.value //object array
				})
				console.log(d.values.happinessvalue);
			}
    return d //Array.prototype.push.apply([0], [1]);
           //d: Array.from(d.values()),
			
   });
   console.log(DepressionbyGDPAugmented);
   drawScatter(DepressionbyGDPAugmented, plot);
})

	function drawScatter(data, selection){
	//When we receive data, we can perform one additional transformation to make life easier for us
	//Data discovery
	console.log(data[0].values[0].happinessvalue)//have to convert o flat data
	
	
	const happinessExtent = d3.extent(data, function(d){ return d.values.happiness});
	const depressionExtent = d3.extent(data, function(d){ return d.values.depressive});
	const gdpExtent = d3.extent(data, function(d){ return d.values.GDP});
    console.log(happinessExtent);
    console.log(depressionExtent);
	//Use the extent to set scales
	const scaleX = d3.scaleLog().domain(gdpExtent).range([0,w]);
	const scaleY = d3.scaleLog().domain(depressionExtent).range([h,0]);
	const scaleSize = d3.scaleSqrt().domain(happinessExtent).range([2,50]);

	//enter, exit, update...
	//UPDATE
	const nodes = plot.selectAll('.node')
		.data(data, function(d){return d.values.CountryCode});

	//ENTER
	const nodesEnter = nodes.enter()
		.append('g')
		.attr('class', 'node');
	nodesEnter.append('circle');
	nodesEnter.append('text');

	//ENTER + UPDATE
	nodes.merge(nodesEnter)
		.transition()
		.attr('transform', function(d){

			//console.log("1",d['GDP per capita (constant 2010 US$)']);
			//console.log("2",d['Mortality rate, infant (per 1,000 live births)']);
			const x = scaleX(d.values.GDP);
			const y = scaleY(d.values.depressive);
			return `translate(${x}, ${y})`;
		});
	nodes.merge(nodesEnter)
		.select('circle')
		.transition()
		.attr('r', function(d){
			const r = scaleSize(d['Population, total']);
			return r;
		})
		.style('fill-opacity', 0.3)
		.style('stroke', '#333')
		.style('stroke-width','2px')
		.style('fill', "grey")
	
	nodes.merge(nodesEnter)
		.select('text')
		.text(function(d){
			return d.values.countryCode;
		})
		.attr('text-anchor','middle')
		.style('fill', '#666')
		.style('font-size', '10px');

	//EXIT
	nodes.exit().remove();

	//Axes
	const axisX = d3.axisBottom()
		.scale(scaleX)
		.tickSize(-h);
	const axisY = d3.axisLeft()
		.scale(scaleY)
		.tickSize(-w);
	axisXNode.attr('transform',`translate(0, ${h})`)
		.transition()
		.call(axisX);
	axisYNode
		.transition()
		.call(axisY);

}




//Utility functions for parsing metadata, migration data, and country code
function parseHappiness(d){

		const happiness = {};
		happiness.Countryname = d['Entity'];
		happiness.Countrycode = d['Code'];
		happiness.Year = d['Year'];
		happiness.value = d['World Happiness Report 2016 (Cantril Ladder (0=worst; 10=best))'];

		return happiness
	}


function parseSubstance_Mental(d){
	const Substance = {};
		Substance.Countryname = d['Entity'];
		Substance.Countrycode = d['Code'];
		Substance.Year = d['Year'];
		Substance.Schizophrenia = d['Schizophrenia (%)'];
		Substance.Bipolar= d['Bipolar disorder (%)'];
		Substance.Eating = d['Eating disorders (%)'];
		Substance.Anxiety = d['Anxiety disorders (%)'];
		Substance.Drug = d['Drug use disorders (%)'];
		Substance.Depression = d['Depression (%)'];
		Substance.Alcohol = d['Alcohol use disorders (%)'];

		return Substance
}

function parseDepressionbyGDP(d){

	const Depression = {};
		Depression.Countryname = d['Entity'];
		Depression.Countrycode = d['Code'];
		Depression.Year = d['Year'];
		Depression.depressive = d['Prevalence of depressive disorders (%)'];
		Depression.GDP = d['GDP per capita (in constant 2011 international-$) (Rate)'];
	
	return Depression
}

function parseDepressionbyGender(d){

	const DepressionGender = {};
		DepressionGender.Countryname = d['Entity'];
		DepressionGender.Countrycode = d['Code'];
		DepressionGender.Year = d['Year'];
		DepressionGender.depressive = d['Share of males (%)'];
		DepressionGender.GDP = d['Share of females (%)'];
		DepressionGender.TotalPopulation = d['Total population (Gapminder)'];
	
	return DepressionGender
}