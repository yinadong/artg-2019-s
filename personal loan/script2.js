
//Import data
const data = d3.csv('../../data/personalloan/LoanStats3a.csv', parse); //JS Promise

data.then(function(data){

/*const loandata_tmp = data.map(a => {
      return [a.year, a]
    });
 console.log(loandata_tmp);

 const loandataMap = new Map(loandata_tmp);
    console.log(loandataMap);

const loandataMapFiltered = loandataMap.get(d => d.key === "2011", d);
console.log(loandataMapFiltered);*/
const personalloanbystate1 = d3.nest()
    //.key(d => d.issue_d)
    .key(d => d.state)
    .key(d => d.year)
    //.key(d => d.dti)//d3.(sum(values, d => d.dti)/d.values.length);
    .entries(data); //this is an array
  console.log(personalloanbystate1);

const personalloanbystate = d3.nest()
    //.key(d => d.issue_d)
    .key(d => d.state)
    .key(d => d.year)
    .rollup(values => d3.mean(values, d => d.dti))//d3.sum(values, d => d.dti))//
    .entries(data); //this is an array
  console.log(personalloanbystate);

d3.select('.container')
      .selectAll('.chart4') //0 
      .data(personalloanbystate)
      .enter()
      .append('div')
      .attr('class','linechart')
      .each(function(d){
        console.group()
        console.log(this);
        console.log(d);
        console.groupEnd();

        lineChart(
          d.values, //array of 7
          this
        );
      })

});

function lineChart(data, rootDOM){

  //data
  //[{}, {}, {}...]x7

  const W = rootDOM.clientWidth;
  const H = rootDOM.clientHeight;
  const margin = {t:32, r:32, b:64, l:64};
  const innerWidth = W - margin.l - margin.r;
  const innerHeight = H - margin.t - margin.b;

  const scaleX = d3.scaleLinear().domain([1985,2020]).range([0, innerWidth]);
  const scaleY = d3.scaleLinear().domain([0, 250000]).range([innerHeight, 0]);

  //take array of xy values, and produce a shape attribute for <path> element
  const lineGenerator = d3.line()
    .x(d => scaleX(+d.key))
    .y(d => scaleY(d.value)); //function
  const areaGenerator = d3.area()
    .x(d => scaleX(+d.key))
    .y0(innerHeight)
    .y1(d => scaleY(d.value));

  const axisX = d3.axisBottom()
    .scale(scaleX)
    .tickFormat(function(value){ return "'"+String(value).slice(-2)})

  const axisY = d3.axisLeft()
    .scale(scaleY)
    .tickSize(-innerWidth)
    .ticks(3)

  const svg = d3.select(rootDOM)
    .append('svg')
    .attr('width', W)
    .attr('height', H);
  const plot = svg.append('g')
    .attr('class','plot')
    .attr('transform', `translate(${margin.l}, ${margin.t})`);

  plot.append('path')
    .attr('class','line')
    .datum(data)
    //some visual shape i.e. geometry, "d"
    .attr('d', data => lineGenerator(data))
    .style('fill','none')
    .style('stroke','#333')
    .style('stroke-width','2px')

  plot.append('path')
    .attr('class','area')
    .datum(data)
    .attr('d', data => areaGenerator(data))
    .style('fill-opacity',0.03)

  plot.append('g')
    .attr('class','axis axis-x')
    .attr('transform',`translate(0, ${innerHeight})`)
    .call(axisX)

  plot.append('g')
    .attr('class','axis axis-y')
    .call(axisY);

}







function drawScatter(data, selection){
  //When we receive data, we can perform one additional transformation to make life easier for us
  console.log(loanBy2011)

  const loan = data.map(function(d){
    const datum = {};
    datum.country = d.key;
    datum.loan_amnt = d.values[0].loan_amnt;
    datum.annual_income = d.values[0].annual_income;
    datum.issue_d = d.values[0].issue_d;
    datum.purpose = d.values[0].purpose
    return datum;
  });

  console.log(countries);

  //The rest is a pretty straightforward scatterplot

 

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
