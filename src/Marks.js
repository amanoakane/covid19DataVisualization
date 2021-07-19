import { geoNaturalEarth1, geoPath, geoGraticule, format } from 'd3';
const projection = geoNaturalEarth1();
const path = geoPath(projection);
const graticule = geoGraticule();

export const Marks = ({
  worldAtlas: { countriesArr, land, interiors, covid_data },
  sizeScale,
  rValue,
  rAttribute,
  color
}) => (
  
  <g className="marks">
    <path className="sphere" d={path({ type: 'Sphere' })} />
    <path className="graticules" d={path(graticule())} />
    {land.features.map(feature => (
      <path className="land" d={path(feature)} />
    ))}
    {countriesArr.features.map((country, i) => (
      <path className="country" d={path(country)} key={i}>
        <title>{country.properties.name}: {format(".2s")(rValue(country.properties))}</title>
      </path>
    ))}

    <path className="interiors" d={path(interiors)}></path>   
    {covid_data.map(d => {
      const [x, y] = projection([d.longitude, d.latitude]);
      return <circle cx={x} cy={y} r={sizeScale(rValue(d))} fill={color[rAttribute]}>
        <title>{d.location}: {format(".2s")(rValue(d))}</title>
      </circle>;
    })}
  </g>
);
                       
                       
                       
                       
                       
