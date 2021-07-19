import React from "react";
export const ColorLegend = React.memo(({
    colorScale,
    tickSpacing = 15,
    tickSize = 10,
    tickTextOffset = 20,
    onHover,
    hoveredValue,
    fadeOpacity
  }) =>
    colorScale.domain().map((domainValue, i) => (
      <g
        className="tickC"
        transform={`translate(0,${i * tickSpacing})`}
        onMouseEnter={() => {
          onHover(domainValue);
        }}
        onMouseOut={() => {
          onHover(null);
        }}
        opacity={hoveredValue && domainValue !== hoveredValue ? fadeOpacity : 1}
      >
        <circle fill={colorScale(domainValue)} r={tickSize+2} />
        <text x={tickTextOffset} dy=".32em">
          {domainValue}
        </text>
      </g>
    )));
  