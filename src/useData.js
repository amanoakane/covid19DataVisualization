import { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl =
  'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.csv';

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const row = d => {
      d['new_cases'] = +d['new_cases'];
      d['new_deaths'] = +d['new_deaths'];
      d['total_cases'] = +d['total_cases'];
      d['total_deaths'] = +d['total_deaths'];
      return d;
    };
    csv(csvUrl, row).then(data => {
      setData(data);
    });
  }, []);
  
  return data;
};