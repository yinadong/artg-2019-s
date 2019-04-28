//You'll show messages in the console using console.log
console.log("Week-1 part-3: data structures");

//Let's start with an array of objects, representing a selection of US cities
const data = [
  {"city":"seattle", "state":"WA", "population":652405, "land_area":83.9},
  {"city":"new york", "state":"NY", "population":8405837, "land_area":302.6},
  {"city":"boston", "state":"MA", "population":645966, "land_area":48.3},
  {"city":"kansas city", "state":"MO", "population":467007, "land_area":315}
];

//Complete the following exercises by following the prompts

//#1
//Using array.forEach, print out (using console.log) the names of the 4 cities, followed by their population.
//The message should have the following sample format
//"seattle, WA has a population of 652405"
data.forEach(function(d){ 
	var a = d.city
	    b = d.state

  console.log(d.city+ ',' + b + 'has a population of'+ d.population );
});


//#2
//Using array.forEach to sum up the populations of the 4 cities
//and print out the average population of the 4 cities
    sum = 0;
data.forEach(function(d){
	value = d.population
	sum += value
	console.log(sum);
	console.log('average population' + sum/d.land_area);
 });
//#3
//Sort these 4 cities in terms of land area, from highest to lowest
//And print out the name of the city with the largest land area
//Hint: use array.sort
data.sort((a, b) =>
	{return (b.land_area - a.land_area)}
	)
console.log(data[0]);
//#4
//Using array.map, compute the population density of these 4 cities (population divided by area)
//add population density as a property to each object, and return the array
const density = data.map( d => d.population/d.land_area);
console.log(density);
//#5
//Using array.filter, return a subset of the cities with a population <1 million
data.filter(d => d.population < 1000000);