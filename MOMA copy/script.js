
//Prepare DOM canvas
//const margin = {t:50, r:50, b:50, l:50};
/*const depthScale = d3.scaleOrdinal()
	.domain([0,1,2,3,4])
	.range([null, 'red', '#03afeb', 'yellow', 'green']);*/

/*const tooltip = d3.select("body")
  .append('div')
  .attr('class','tooltip')
  .style('position', 'absolute')
  .style('width', '180px')
  .style('min-height', '50px')
  .style('background', '#f9f2f2')
  .style('color', 'black')
  .style('padding', '15px')
  .style('opacity', 0.5);
tooltip.append('p').attr('class', 'key');
//tooltip.append('p').attr('class', 'value')

function enableTooltip(selection){
  selection
    .on('mouseenter', function(d){
      const xy = d3.mouse(d3.select("body").node());
      tooltip
        .style('left', xy[0]+'px')
        .style('top', xy[1] + 20 +'px')
        .transition()
        .style('opacity', 1);
      tooltip
        .select('.key')
        .html(d.data.name);
    })
    .on('mouseleave', function(d){
      tooltip
        .style('opacity',0);
    });
}*/

//Import data
const momaDataPromise = d3.csv('../../data/moma/Artworks1940.csv', parseMomaData)
	.then(data => data.reduce((acc,v) => acc.concat(v), []));

	console.log(momaDataPromise);

momaDataPromise.then(data => {
	//const {nodesData, linksData} = generateNetwork(data, 1990);

    const momaData = d3.nest()
              .key( d => d.nationality)
              .key( d => d.medium)
              .key( d => d.gender)
              .key( d => d.artist)
              .entries(data);
    console.log(momaData);

  const americanData = momaData
        .filter(d => d.key === "American")[0]
        .values;
  console.log(americanData);



	/*const migrationDatatmp = data.map(d => {
				return [d.artist,d]
			});
	const migrationData2 = new Map(migrationDatatmp);
	console.log(migrationData2);*/
	
	const rootNode = d3.hierarchy({
    key:'root',
    values:americanData }, 
  function(d){ return d.values });

  console.log(rootNode);
    const links = rootNode.links();
    const nodes = rootNode.descendants();

    console.log(links);
    console.log(nodes);

    const svg = d3.select("body")
    	.append("svg")
    	.attr("width",1500)
    	.attr("height",2000);

    const link = svg.selectAll(".link")
    	.data(links)
    	.enter()
    	.append("line")
    		.attr("class","link")
    		.attr("stroke","#7a7979")
    		.attr("stroke-width",0.2);

 
    const node = svg.selectAll(".node")
    	.data(nodes)
    	.enter()
      //.call(enableTooltip)
    	.append("circle")
    		.attr("class","node")
    		.attr("r",2)
    		.attr("fill", function(d) { 
    			switch(d.depth){
                  case 4: return '#B49ED8';
                  case 3: return '#EF5BA2'; //#ce894e
                  case 2: return '#1C6BEA';
                  case 1: return '#E59935'; //#ef983b
                  //case 1: return '#7BC97B';
                  case 0: return 'black';
               }
    		})
      /*.on("mouseover", function() {    
            tooltip.style("display", null);
          })  */
      .on("mouseout", function() {   
            tooltip.style("display", "none");
        })
      .on("mouseover", function(d) { 
           //.filter(function(d){ return !d.children})
           const xPos = d3.mouse(this)[0] - 15;
           const yPos = d3.mouse(this)[1] - 55;

           console.log(xPos);
           console.log(yPos);

           tooltip.attr("transfrom", "translate(" + xPos + "," + yPos, + ")");
           tooltip.select("text").text(d.data.name + " : " + d.value); 
          }); 

       const tooltip = svg.append("g")
                .attr("class", "tooltip") 
                .style("display", "none");

        tooltip.append("text")
                .attr("x", 15)
                .attr("dy", "1.2em") 
                .style("font-size", "1.25em")  
                .attr("font-wright", "bold");

        /* .on("mouseover", function(d) {   
            div.transition()    
                .duration(200)    
                .style("opacity", .9);    
            div .html(formatTime(d.key) + "<br/>"  + d.value)  
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY - 28) + "px");  
            })          
        .on("mouseout", function(d) {   
            div.transition()    
                .duration(500)    
                .style("opacity", 0); 
        });*/


    const simulation = d3.forceSimulation()
    	.force('link', d3.forceLink().links(links).distance(25).strength(1))
    	.force("charge", d3.forceManyBody().strength(-45))
    	.force("center", d3.forceCenter(500,500))
    	.force("x", d3.forceX().x(500).strength(0.6))
    	.force("y", d3.forceY().y(500).strength(0.6))
    	.force("collide", d3.forceCollide(function(d) { 
        return d.type === 'character' ? 5 : 1; } 
    ).iterations(5)) 
    	.alpha(1.5)
    //.force("y", d3.forceY(height/2).strength(0.2)) 
    //.force("x", d3.forceY(height/2).strength(0)) 
    //.force("center", d3.forceCenter(width / 2, height / 2));
    	

    simulation.nodes(nodes)
    	.on("tick",ticked);



    function ticked() {
    	link.attr("x1", function(d) { return d.source.x; })
    		.attr("x2", function(d) { return d.target.x; })
    		.attr("y1", function(d) { return d.source.y; })
    		.attr("y2", function(d) { return d.target.y; });

    	node.attr("cx", function(d) { return d.x; })
    		.attr("cy", function(d) { return d.y; });
    }
   
    // Toggle children on click.
 /*function dragsubject() {
  return simulation.find(d3.event.x - 1500 / 2, d3.event.y - 2000 / 2);
}

function dragstarted() {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d3.event.subject.fx = d3.event.subject.x;
  d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
  d3.event.subject.fx = d3.event.x;
  d3.event.subject.fy = d3.event.y;
}

function dragended() {
  if (!d3.event.active) simulation.alphaTarget(0);
  d3.event.subject.fx = null;
  d3.event.subject.fy = null;
}*/

});






function parseMomaData(d){
	//if(+d.Code >= 900) return; FOR each 

	//const migrationFlows = [];
	const moma = {};
	moma.title = d['Title'];
	moma.date = new Date(d['DateAcquired']);
	moma.nationality = d['Nationality'].replace('(','').replace(')','');
	moma.gender = d['Gender'].replace('(','').replace(')',''); // replace: 2 ('') (','')
    moma.artist = d['Artist'];
    moma.medium = d ['Classification'];
	
	delete d['Title'];
	delete d['DateAcquired'];
	delete d['Nationality']
	delete d['Gender'];
	delete d['Artist'];
	delete d['Classification'];
	delete d['Medium']
	delete d['Dimensions']
	delete d['CreditLine']
	delete d['URL']
	delete d['Height (cm)']
	delete d['Width (cm)'] 

	return moma;
}
