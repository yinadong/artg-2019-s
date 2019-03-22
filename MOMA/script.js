

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

	/*const migrationDatatmp = data.map(d => {
				return [d.artist,d]
			});
	const migrationData2 = new Map(migrationDatatmp);
	console.log(migrationData2);*/
	
	const rootNode = d3.hierarchy({
    key:'root',
    values:momaData
  }, function(d){ return d.values });

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

   const tooltip = svg.append("g")
            .attr("class", "tooltip") 
            .style("display", "none");

    const div = d3.select("#tooltip")
 
   tooltip.append("text")
          .attr("dx", 15)
          .attr("dy", "1.2em") 
          .style("font-size", "1.25em")  
          .attr("font-weight", "bold");

    const node = svg.selectAll(".node")
    	.data(nodes)
    	.enter()
      //.call(enableTooltip)
    	.append("circle")
    		.attr("class","node")
    		.attr("r",2)
    		.attr("fill", function(d) { 
    			switch(d.depth){
                  case 5: return '#B49ED8';
                  case 4: return '#EF5BA2'; //#ce894e
                  case 3: return '#1C6BEA';
                  case 2: return '#E59935'; //#ef983b
                  case 1: return '#7BC97B';
                  case 0: return 'black'
               }
    		})
      
      .on("mouseout", function() {   
            tooltip.style("display", "none");
        })
      .on("mouseover", function(d) { 

           //.filter(function(d){ return !d.children})
           console.log(d3.mouse(this));
           const xPos = d3.mouse(this)[0] - 15;
           const yPos = d3.mouse(this)[1] - 55;

           tooltip.attr("transform", "translate(" + xPos + "," + yPos + ")")
            .style("display","block");

            if(d.depth == 5) {
             tooltip.select("text").text(d.data.title); 

            } else {

             tooltip.select("text").text(d.data.key + " : " + d.data.values.length); 

            }

          }); 



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
    	.force('link', d3.forceLink().links(links).distance(15).strength(1))
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
    	//.aplha(1)


    function ticked() {
    	link.attr("x1", function(d) { return d.source.x; })
    		.attr("x2", function(d) { return d.target.x; })
    		.attr("y1", function(d) { return d.source.y; })
    		.attr("y2", function(d) { return d.target.y; });

    	node.attr("cx", function(d) { return d.x; })
    		.attr("cy", function(d) { return d.y; });
    }
   
    // Toggle children on click.
 /*function click(d) {
  if (d3.event.defaultPrevented) return; // ignore drag
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update();
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