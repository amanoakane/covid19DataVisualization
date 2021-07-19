import React from "react";
export let LineChart = React.memo(({
  data,
  xScale,
  xValue,
  yScale,
  yValue,
  colorScale,
  colorValue,
  tooltipFormat,
  circleRadius
}) =>
(
  <g className="line">
    {
      data.map(d => (
      <circle
        className="line"
        cx={xScale(xValue(d))}
        cy={yScale(yValue(d))}
        fill={colorScale(colorValue(d))}
        r={circleRadius}
      >
        <title>{tooltipFormat(yValue(d))}</title>
      </circle>
      ))
    }
  </g>
));