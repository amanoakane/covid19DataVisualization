import './style.css';
import { useState, useMemo } from 'react';
import { scaleSqrt, max, scaleBand, scaleLinear, format, timeFormat, scaleTime, extent, scaleOrdinal } from 'd3';
import { useWorldAtlas } from './useWorldAtlas';
import { Marks } from './Marks';
import { useData } from './useData';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { BarChart } from './BarChart';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { AxisBottomLine } from './AxisBottomLine';
import { AxisLeftLine } from './AxisLeftLine';
import { LineChart } from './LineChart';
import { ColorLegend } from './ColorLegend';
import { useTotalData } from './useTotalData';

const width = 960;
const height = 500;
const options = ["new_cases", "new_deaths", "total_cases", "total_deaths"]
const color = {"new_cases":"#E3BA22", "new_deaths":"#BD2D28", "total_cases":"#BD8F22", "total_deaths":"#B37055"}
const sortByAttribute = attr => {
  const compare = (a, b) => {
    if ( a[attr] > b[attr] ){
      return -1;
    }
    if ( a[attr] < b[attr] ){
      return 1;
    }
    return 0;
  }
  return compare
}

function App() {
  const initialRAttribute = 'total_cases';
  const [rAttribute, setRAttribute] = useState(initialRAttribute);
  const rValue = d => d[rAttribute];

  const worldAtlas = useWorldAtlas();
  let data = useData();
  const totalData = useTotalData();
  const [hoveredValue, setHoveredValue] = useState(null);

  if (!worldAtlas || !data || !totalData) {
    return <pre>Loading Data...</pre>;
  }

  //for barchart
  data = data.sort(sortByAttribute(rAttribute)).slice(1,16)
  const yValue = d => d.location;
  const tooltipFormat = tickValue => format('.4s')(tickValue).replace('G', 'B');
  const xAxisTickFormat = tickValue => format('.2s')(tickValue).replace('G', 'B');
  const margin = { top: 50, right: 200, bottom: 100, left: 240 };
  const xAxisLabelOffset = 50;
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;
  

  const yScale = scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .paddingInner(0.15);

  const xScale = scaleLinear()
    .domain([0, max(data, rValue)])
    .range([0, innerWidth]);

  //for map
  const maxRadius = 30;

  const sizeScale = scaleSqrt()
    .domain([0, max(worldAtlas.covid_data, rValue)])
    .range([0, maxRadius]);


  //for line chart
  const yAxisLabelOffset = 70;
  const fadeOpacity = 0.2;

  const lineChartxValue = d => d['date'];
  const xAxisLabel = '';

  const lineChartyValue = d => d[rAttribute];
  const yAxisLabel = `Number of ${rAttribute.replace("_", " ")}`;

  const colorValue = d => d['location'];
  const colorLegendLabel = 'Countries';

  const filteredData = totalData.filter(d => hoveredValue === colorValue(d));

  const circleRadius = 1.5;

  const lineChartxAxisTickFormat = timeFormat("%m/%d/%Y");

  const lineChartxScale = scaleTime()
    .domain(extent(totalData, lineChartxValue))
    .range([0, innerWidth])
    .nice();

  const lineChartyScale = scaleLinear()
    .domain(extent(totalData, lineChartyValue))
    .range([innerHeight,0]);

  const colorScale = scaleOrdinal()
    .domain(totalData.map(colorValue))
    .range(['#E6842A', '#137B80', '#8E6C8A', '#9A517E','#BD2D28', '#42A5B3', '#D15A86','#B0CBDB', '#193556']);


  
  return (
    
    <>
      <div className="dropdown-label"><span>Show by: </span><Dropdown options={options} value={rAttribute} 
      onChange={({ value }) => setRAttribute(value)}/>
      </div>
      <svg className="map" width={width} height={height}>
        <Marks
          worldAtlas={worldAtlas}
          sizeScale={sizeScale}
          rValue={rValue}
          rAttribute={rAttribute}
          color={color}
        />
      </svg>
      <svg className="bar" width={740} height={500}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <AxisBottom
          xScale={xScale}
          innerHeight={innerHeight}
          tickFormat={xAxisTickFormat}
        />
        <AxisLeft yScale={yScale} />
        <text
          className="axis-label"
          x={innerWidth / 2}
          y={innerHeight + xAxisLabelOffset}
          textAnchor="middle"
        >
          {`Number of ${rAttribute.replace("_", " ")}`} 
        </text>
        <BarChart
          data={data}
          xScale={xScale}
          yScale={yScale}
          xValue={rValue}
          yValue={yValue}
          tooltipFormat={tooltipFormat}
          color={color}
          rAttribute={rAttribute}
        />
      </g>
    </svg>

    <svg className="line" width={width} height={height}>
    <g transform={`translate(${margin.left},${margin.top})`}>
        <AxisBottomLine
          xScale={lineChartxScale}
          innerHeight={innerHeight}
          tickFormat={lineChartxAxisTickFormat}
          tickOffset={5}
        />
        <text
          className="axis-label"
          textAnchor="middle"
          transform={`translate(${-yAxisLabelOffset},${innerHeight /
            2}) rotate(-90)`}
        >
          {yAxisLabel}
        </text>
        <AxisLeftLine yScale={lineChartyScale} innerWidth={innerWidth} tickOffset={5} tickFormat={xAxisTickFormat}/>
        <text
          className="axis-label"
          x={innerWidth / 2}
          y={innerHeight + xAxisLabelOffset}
          textAnchor="middle"
        >
          {xAxisLabel}
        </text>
        <g transform={`translate(${innerWidth + 60}, 60)`}>
          <text x={35} y={-25} className="axis-label" textAnchor="middle">
            {colorLegendLabel}
          </text>
          <ColorLegend
            tickSpacing={18}
            tickSize={10}
            tickTextOffset={12}
            tickSize={circleRadius}
            colorScale={colorScale}
            onHover={setHoveredValue}
            hoveredValue={hoveredValue}
            fadeOpacity={fadeOpacity}
          />
        </g>
        <g opacity={hoveredValue ? fadeOpacity : 1}>
          <LineChart
            data={totalData}
            xScale={lineChartxScale}
            xValue={lineChartxValue}
            yScale={lineChartyScale}
            yValue={lineChartyValue}
            colorScale={colorScale}
            colorValue={colorValue}
            tooltipFormat={xAxisTickFormat}
            circleRadius={circleRadius}
          />
        </g>
        <LineChart
          data={filteredData}
          xScale={lineChartxScale}
          xValue={lineChartxValue}
          yScale={lineChartyScale}
          yValue={lineChartyValue}
          colorScale={colorScale}
          colorValue={colorValue}
          tooltipFormat={xAxisTickFormat}
          circleRadius={circleRadius}
        />
      </g>
    </svg>
    </>
  );
}
export default App;
