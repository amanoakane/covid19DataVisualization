export const BarChart = ({
    data,
    xScale,
    yScale,
    xValue,
    yValue,
    tooltipFormat,
    color,
    rAttribute
  }) =>
    data.map(d => (
      <rect transform={`translate(0,0)`}
        className="barChart"
        key={yValue(d)}
        x={0}
        y={yScale(yValue(d))}
        width={xScale(xValue(d))}
        height={yScale.bandwidth()}
        fill={color[rAttribute]}
      >
        <title>{tooltipFormat(xValue(d))}</title>
      </rect>
    ));
  