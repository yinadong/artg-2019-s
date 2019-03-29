const data = d3.csv('../../data/personalloan/loan2007.csv', parse); //JS Promise
const margin = {t:50, r:50, b:50, l:50};

data.then(function(data){

  //console.log(data);
  const personalloanbystate = d3.nest()
    //.key(d => d.issue_d)
    .key(d => d.state)
    .key(d => d.purpose)
    .entries(data); //this is an array
  console.log(personalloanbystate);
    
  const rootNode = d3.hierarchy({
    key:'root',
    values:personalloanbystate}, 
    function(d){return d.values });
  const rootNodeByCount = rootNode.count();
  //console.log(rootNode);
  renderPartition(rootNode, document.getElementById('partition'));
  //renderForcelayout(rootNode, document.getElementById('forcelayout'));
})

function renderPartition(rootNode, rootDOM){
  console.log(rootNode)

  const W = rootDOM.clientWidth;
  const H = rootDOM.clientHeight;
  const w = W - margin.l - margin.r;
  const h = H - margin.t - margin.b;

  const plot = d3.select(rootDOM)
    .append('svg')
    .attr('width', W)
    .attr('height', H)
    .append('g')
    .attr('class','plot')
    .attr('transform', `translate(${margin.l}, ${margin.t})`);

  console.log(rootDOM);

  console.group('Partition');

  const partitionTransform = d3.partition()
    .size([w, h])
    .padding(0);

  const nodesData = partitionTransform(rootNode).descendants();

 //Draw nodes
  const nodes = plot.selectAll('.node')
    .data(nodesData);
  
  const nodesEnter = nodes.enter()
    .append('g')
    .attr('class','node');
  nodesEnter.append('rect');
  nodesEnter.append('text');

  nodesEnter.merge(nodes)
    .attr('transform', function(d){
      return `translate(${d.x0}, ${d.y0})`
    })
    .select('rect')
    .attr('width', function(d){ return d.x1 - d.x0})
    .attr('height', function(d){ return d.y1 - d.y0})
    .style('fill', function(d){
      switch(d.depth){
        //case 4: return 'lightblue'
        case 3: return 'lightblue';
        case 2: return '#69a2db';
        case 1: return '#83dbd5';//#1b6ec1
        case 0: return '#d2d5d8';
      }
    })
    .style('stroke', 'white')
    .style('stroke-width','0.2px');

    nodesEnter.merge(nodes)
    .filter(function(d){ return d.depth < 3})
    .select('text')
    .text(function(d){ return `${d.data.key}: ${d.data.values.length}`})
    .attr('dx', 5)
    .attr('dy', 15)

  console.groupEnd();

}     

function parse(d){
  return {
    applicant_id:d.id,
    state:d.addr_state,
    loan_amnt:+d.loan_amnt,
    term:d.term,
    dti:+d.dti,
    annual_income:+d.annual_inc,
    grade:d.grade,
    year:+d.year,
    issue_d:new Date(d.issue_d),
    int_rate:d.int_rate, 
    revol_util:d.revol_util,
    purpose:d.purpose,
    //enlargement:d.enlargement_flag_yes_no === "true"?true:false, //convert string to boolean
    verification:d.verification_status // === "Verified"?Verified:Not Verified, //convert string to boolean
   // emp_title:`{d.emp_title,}`
   // emp_length:d.emp_length
  }
}
