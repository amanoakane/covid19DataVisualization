export const AxisLeft = ({ yScale }) =>
  yScale.domain().map(tickValue => (
    <g className="tick"  transform={`translate(0,${yScale(tickValue) + yScale.bandwidth() / 2})`}>
      <text
        key={tickValue}
        style={{ textAnchor: 'end' }}
        x={-3}
        dy=".32em"
        
      >
        {tickValue}
      </text>
    </g>
  ));
