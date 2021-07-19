export const AxisBottomLine = ({ xScale, innerHeight, tickFormat, tickOffset = 3 }) =>
  xScale.ticks().map(tickValue => (
    <g
      className="tick"
      key={tickValue}
      transform={`translate(${xScale(tickValue)},0)`}
    >
      <line y2={innerHeight} />
      <text style={{ textAnchor: 'middle' }} dy=".71em" y={innerHeight + tickOffset} transform={`translate(160,30) rotate(20)`} >
        {tickFormat(tickValue)}
      </text>
    </g>
  ));
