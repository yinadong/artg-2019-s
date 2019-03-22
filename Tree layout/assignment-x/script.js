const data = d3.csv('../../data/nyc_permits.csv', parse); //JS Promise
const m = {t:50, r:50, b:50, l:50};

data.then(function(rows){

  console.log(rows);

  const permitsByBorough = d3.nest()
    .key(function(d){return d.job_type})
    .key(function(d){return d.borough})
    .entries(rows); //this is an array

  const rootNode = d3.hierarchy({
    key:'root',
    values:permitsByBorough
  }, function(d){ return d.values });

  console.log(rootNode);

  const rootNodeByCost = rootNode.sum(function(d){return d.cost_estimate});
  //const rootNodeByCount = rootNode.count();

  //Partition layout
  const partitionDiv = d3.select('#partition').node(); //a DOM node =/= selection
  const W = partitionDiv.clientWidth;
  const H = partitionDiv.clientHeight;
  const w = W - m.l - m.r;
  const h = H - m.t - m.b;

  const plot = d3.select('#partition')
    .append('svg')
    .attr('width', W)
    .attr('height', H)
    .append('g')
    .attr('class', 'nodes')
    .attr('transform', `translate(${m.l}, ${m.r})`);


  const partition = d3.partition() //
    .size([w, h]);

  const dataTransformed = partition(rootNode);
  console.log(rootNode);

  draw(dataTransformed, plot);

  d3.select('#cost-vs-sqft').on('click', function(){
    rootNode.sum(function(d){return d.cost_estimate});
    const dataTransformed = partition(rootNode);
    draw(dataTransformed, plot);
  })
  d3.select('#per-sqft-vs-borough').on('click', function(){
    rootNode.count();
    const dataTransformed = partition(rootNode);
    draw(dataTransformed, plot);
  })
})

//Will be called X times
function draw(data, plot){
  //Draw/update DOM nodes based on data
  //i.e. enter exit update

  const rectNodes = plot.selectAll('.node')
    .data(
      data
        .descendants()
        .filter(function(d){
          return d.depth < 3
        }),
      function(d){return d.data.key}
    ); //UPDATE

  //ENTER
  const rectNodesEnter = rectNodes.enter()
    .append('rect')
    .attr('class', 'node');

  rectNodes.merge(rectNodesEnter)
    .transition()
    .attr('x', function(d){return d.x0})
    .attr('y', function(d){return d.y0})
    .attr('width', function(d){return d.x1-d.x0})
    .attr('height', function(d){return d.y1-d.y0})
    .style('fill', function(d){
      switch(d.depth){
        case 1: return 'red';
        case 2: return 'blue';
        case 0: return 'green'
      }
    })
    .style('stroke', 'black')
    .style('stroke-width', '1px');

  const labelNodes = plot.selectAll('text')
    .data(
      data
        .descendants()
        .filter(function(d){
          return d.depth < 3
        })
    );
  console.log(labelNodes);

  const labelNodesEnter = labelNodes.enter()
    .append('text');

  labelNodes.merge(labelNodesEnter)
    .text(function(d){return d.data.key})
    .attr('text-anchor','middle')
    .transition()
    .attr('x', function(d){ return (d.x0 + d.x1)/2 })
    .attr('y', function(d){ return (d.y0 + d.y1)/2 })
}

function parse(d){
  return {
    applicant_business_name:d.applicant_business_name,
    borough:d.borough,
    community_board:d.community_board,
    cost_estimate:+d.cost_estimate, //convert string to number
    enlargement:d.enlargement_flag_yes_no === "true"?true:false, //convert string to boolean
    address: `${d.job_location_house_number} ${d.job_location_street_name}`,
    job_number:+d.job_number,
    job_type:d.job_type,
    job_type2:d.job_type2,
    permit_type:d.permit_type,
    permit_issuance_date:new Date(d.permit_issuance_date),
    square_footage:+d.square_footage,
    cost_per_sqft: +d.square_footage > 0 ? (+d.cost_estimate /+d.square_footage):0
  }
}