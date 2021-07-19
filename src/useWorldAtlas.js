import { useState, useEffect } from 'react';
import { json, csv } from 'd3';
import { feature, mesh } from 'topojson';

const jsonUrl = 'https://gist.githubusercontent.com/amanoakane/2638259e81cc3af0a666beec5a64920c/raw/map.json';

const COVID_DATA =
    'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.csv';

const location_data = 'https://gist.githubusercontent.com/amanoakane/6e558d8298c0a44a2005fd6316f9d027/raw/countries_covid.csv';    

const row = d => {
  d['new_cases'] = +d['new_cases'];
  d['new_deaths'] = +d['new_deaths'];
  d['total_cases'] = +d['total_cases'];
  d['total_deaths'] = +d['total_deaths'];
  return d;
};
const row2 = d => {
  d.latitude = +d.latitude;
  d.longitude = +d.longitude;
  return d;
}

export const useWorldAtlas = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    
    Promise.all([csv(COVID_DATA,row),json(jsonUrl),csv(location_data, row2)]).then(([data,topology,locat_data]) => {
    const { countries, land } = topology.objects;
      
    const rowByName = data.reduce((accumulator, d) => {
                                // accumulator[d['country']] = d;
                                // return accumulator;
                                return {[d.location]: d, ...accumulator}
                                }, {}) //rowByName is a object

    const combinedDta = locat_data.reduce((accumulator, d)=>{
      return [ {...rowByName[d.name], "latitude":d.latitude, "longitude": d.longitude}, ...accumulator]
      //return [ {[d.name]:{...rowByName[d.name], "latitude":d.latitude, "longitude": d.longitude}}, ...accumulator]
    },[])
    
    const countries2 = feature(topology, countries);
    countries2.features.forEach(d => {
      Object.assign(d.properties, rowByName[d.properties.name]);
    });
    
      
    setData({
      countriesArr: countries2,
      land: feature(topology, land),
      interiors: mesh(topology, countries, (a, b) => a !== b),
      covid_data: combinedDta
    });
    


  	})    
    
  }, []);

  return data;
};
