import {memo} from "react";
export const AxisLeftLine = memo(({ yScale, innerWidth, tickOffset = 3 , tickFormat}) =>
  yScale.ticks().map(tickValue => (
    <g className="tick" transform={`translate(0,${yScale(tickValue)})`}>
      <line x2={innerWidth} />
      <text
        key={tickValue}
        style={{ textAnchor: 'end' }}
        x={-tickOffset}
        dy=".32em"
      >
        {tickFormat(tickValue)}
      </text>
    </g>
  )));
