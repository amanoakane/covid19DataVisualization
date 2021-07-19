import { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl =
  'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/jhu/full_data.csv';

export const useTotalData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const row = d => {
      d['date'] = new Date(d['date']);
      d['new_cases'] = +d['new_cases'];
      d['new_deaths'] = +d['new_deaths'];
      d['total_cases'] = +d['total_cases'];
      d['total_deaths'] = +d['total_deaths'];
      return d;
    };
    csv(csvUrl, row).then(data => {
    let filtered = data.filter(d=> ['China', 'Japan','United States','India', 'United Kingdom', 'Brazil','France','Russia','Mexico'].includes(d.location) )
    // filtered = data.map(d => {
    //   return {"date":d['data'], "new_cases":d['new_cases'], "new_deaths": d['new_deaths'], "total_cases": d['total_cases'], "total_deaths": d['total_deaths'] }
    // })
    setData(filtered)
    });
  }, []);
  
  return data;
};