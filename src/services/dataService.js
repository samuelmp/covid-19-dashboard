
import Papa from 'papaparse';
import { format, parse, getTime } from 'date-fns';
import cloneDeep from 'lodash.clonedeep';

const countriesData = {};

const typeTemplate = {
  acum: [],
  abs: [],
  abs_avg: [],
  score: 0,
  scoreInc: 0,
  scoreTrend: 0,
};

const countryTemplate = {
  color: "#FFF",
  cases: cloneDeep(typeTemplate),
  recovered: cloneDeep(typeTemplate),
  deaths: cloneDeep(typeTemplate),
  updateDate: 0,
}



export const requestData = (callback) => {

  const rawDataObj = {
    spain: false,
    global_deaths: false
  };

  Papa.parse("https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/nacional_covid19.csv", {
    download: true,
    skipEmptyLines: true,
    complete: function(results) {
      console.log("Parsing Spain results...");
      rawDataObj.spain = results.data;

      Papa.parse("https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/fechas.md", {
        download: true,
        delimiter: "|",
        skipEmptyLines: true,
        complete: function(datesResults) {

          rawDataObj.spain_dates = datesResults.data;
          transformData(rawDataObj, callback);
        }
      });
    },
    error: function(err, file, inputElem, reason) {
      console.log(err);
    },
  });
  // Global parsin data
  Papa.parse(
    //"https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
  , {
    download: true,
    complete: function(results) {
      console.log("Parsing Global results...");
      rawDataObj.global_deaths = results.data;
      transformData(rawDataObj, callback);
    },
    error: function(err, file, inputElem, reason) {
      console.log(err);
    },
  });

};

const transformData = (rawDataObj, callback) => {

  if(rawDataObj.spain && rawDataObj.global_deaths && rawDataObj.spain.length > 1 && rawDataObj.global_deaths.length > 1 && rawDataObj.spain_dates  ) {

    rawDataObj = handleRawData(rawDataObj);
    const chartData = {
      global_deaths: false,
    }
    transformSpainResults(rawDataObj.spain, rawDataObj.spain_dates);

    chartData.global_deaths = transformGlobalResults(rawDataObj.global_deaths);
    //chartData.global_deaths = transformGlobalResults_2(rawDataObj.global_deaths);

    callback(chartData, countriesData);
  }
}

const handleRawData = (rawDataObj) => {
  console.log("rawDataObj-spain ==========>", rawDataObj.spain);
  console.log("rawDataObj-global_deaths ==========>", rawDataObj.global_deaths);

  const firstSpainDateData = format(new Date(parse(rawDataObj.spain[1][0], "yyyy-MM-dd", new Date())), "M/dd/yy");

  const global_headers = rawDataObj.global_deaths[0];

  const firstDataIndex = global_headers.indexOf(firstSpainDateData);

  rawDataObj.global_deaths.forEach(item => {

    if(item[0] === "" && item[1] === "Spain") {
      for (let i = 1; i < rawDataObj.spain.length; i++) {

        const element = rawDataObj.spain[i];
        if(element && element.length > 0 && element[0]) {
          const globalDateIndex = firstDataIndex  + i - 1;
          item[globalDateIndex] = element[3] || "0";
        }
      }
    }
  });
  return rawDataObj;
};


const transformSpainResults = (results, dates) => {

  const spainData = addNewCountryData("Spain");

  results.forEach((line, index) => {
    if(index > 0) {
      const timestamp = getTime(parse(line[0], "yyyy-MM-dd", new Date()));
      // Casos
      const casesAcum = (line[1] && parseInt(line[1])) || 0;
      const lastCasesAcum = (index > 0 && parseInt(results[index-1][1])) || 0;
      const casesAbs = (casesAcum && (casesAcum - lastCasesAcum) ) || 0;
      spainData.cases.acum.push([timestamp, casesAcum]);
      spainData.cases.abs.push([timestamp, casesAbs]);

      // Recuperados
      const recoveredAcum = (line[2] && parseInt(line[2])) || 0;
      const lastRecoveredAcum = (index > 0 && parseInt(results[index-1][2])) || 0;
      const recoveredAbs = (recoveredAcum && (recoveredAcum - lastRecoveredAcum) ) || 0;
      spainData.recovered.acum.push([timestamp, recoveredAcum]);
      spainData.recovered.abs.push([timestamp, recoveredAbs]);

      // Fallecidos
      const deathsAcum = (line[3] && parseInt(line[3])) || 0;
      const lastDeathsAcum = (index > 0 && parseInt(results[index-1][3])) || 0;
      const deathsAbs = (deathsAcum && (deathsAcum - lastDeathsAcum) ) || 0;
      spainData.deaths.acum.push([timestamp, deathsAcum]);
      spainData.deaths.abs.push([timestamp, deathsAbs]);

      spainData.cases.abs_avg.push([timestamp, getAverageData(spainData.cases.abs, index)]);
      spainData.recovered.abs_avg.push([timestamp, getAverageData(spainData.recovered.abs, index)]);
      spainData.deaths.abs_avg.push([timestamp, getAverageData(spainData.deaths.abs, index)]);
    }
  });

  spainData.cases =     { ...spainData.cases,      ...getScores(spainData.cases)};
  spainData.recovered = { ...spainData.recovered,  ...getScores(spainData.recovered)};
  spainData.deaths =    { ...spainData.deaths,     ...getScores(spainData.deaths)};

  let updateDate = false;
  for (let index = 0; index < dates.length; index++) {
    const line = dates[index];
    if(line[2] && line[2].indexOf("nacional_covid19.csv") >= 0) {
      updateDate = new Date(line[1].trim()).getTime();
      break;
    }
  }
  spainData.updateDate = updateDate;

};

const getScores = (dataObj) => {
  const score = dataObj.acum.slice(-1)[0][1];
  const scoreInc = dataObj.abs.slice(-1)[0][1];
  const scoreTrend = scoreInc - dataObj.abs.slice(-2)[0][1];
  return {score, scoreInc, scoreTrend};
}

const getAverageData = (serie, index) => {
  const l = serie.length;
  const data4Avg = serie.slice(l >= 7 ? index-7 : 0, index).map(item => item[1]);
  const avg = arrayAverage(data4Avg);
  return avg >= 0 ? avg : 0;
}

const arrayAverage = (array) => {
  var sum = 0;
  for( let i = 0; i < array.length; i++ ) {
      sum += parseInt( array[i], 10 );
  }
  return Math.round((array.length > 0 && sum/array.length) || 0);
}

const transformGlobalResults_2 = (results) => {

  // const countries = ["Italy", "Spain", "Germany", "France", "United Kingdom", "Hubei", "US"];
  // const cumulativeSeries = [];
  // const incrementSeries = [];
  // const growthSeries = [];

  // results.forEach((line, index) => {
  // const header = line[0];

  //   if((line[0] === "" && countries.indexOf(line[1]) >= 0) ||
  //       (countries.indexOf(line[0]) >= 0 )
  //   ) {
  //     const serieName = line[1];
  //     const cumulativeData = [];
  //     const incrementData = [];
  //     const growthData = [];
  //     let start = false;

  //     const conuntryData = addNewCountryData(serieName);


  //     for(let i=4; i<line.length; i++) {


  //       const timestamp = getTime(parse(header[i], "M/d/yy", new Date()));

  //       if(!start) {
  //         start = line[i] >= 50;
  //       }
  //       if(line[1] === 'Spain' || line[1] === 'Italy' || line[1] === 'Germany' || line[1] === 'France') {
  //         // if(i === 54) {
  //         //   const fix = (parseInt(line[i+1])-parseInt(line[i])) / 2;
  //         //   line[i] = parseInt(line[i]) + fix;
  //         // }
  //         start && growthData.push(Math.round(((parseInt(line[i])-parseInt(line[i-1])) / parseInt(line[i-1])) * 100));
  //       }
  //       start && incrementData.push([line[i]-line[i-1]);
  //       start && cumulativeData.push(line[i]-0);
  //     }
  //     const isSerieVisible = serieName !== "China";
  //     cumulativeData.length > 0 && cumulativeSeries.push({name: serieName, data: cumulativeData, visible: isSerieVisible});
  //     incrementData.length > 0 && incrementSeries.push({name: serieName, data: incrementData, visible: isSerieVisible});
  //     growthData.length > 0 && growthSeries.push({name: serieName, data: growthData, visible: isSerieVisible});

  // });

}

const transformGlobalResults = results => {
  const countries = ["Italy", "Spain", "Germany", "France", "United Kingdom", "Hubei", "US"];
  const cumulativeSeries = [];
  const incrementSeries = [];
  const growthSeries = [];
  results.forEach((line, index) => {
    if((line[0] === "" && countries.indexOf(line[1]) >= 0) ||
       (countries.indexOf(line[0]) >= 0 )
    ) {
      const serieName = line[1];
      const cumulativeData = [];
      const incrementData = [];
      const growthData_tmp = [];
      const growthData = [];
      let start = false;
      let start2 = false;

      for(let i=5; i<line.length; i++) {



        if(i > 12) {
          var sum = 0;
          var sum2 = 0;
          let values = line.slice(i-7, i);
          let values2 = line.slice(i-8, i-1);
          for( let i = 0; i < values.length; i++ ){
              sum += parseInt( values[i], 10 ); //don't forget to add the base
              sum2 += parseInt( values2[i], 10 );
          }
          var avg = (Math.round(values.length > 0 && sum/values.length) || 0);
          var avg2 = (Math.round(values.length > 0 && sum2/values.length) || 0);
          if(!start2) {
            start2 = avg-avg2 >= 3;
          }
          start2 && incrementData.push((avg-avg2 > 0 && avg-avg2) || 0);
        }
        if(!start) {
          start = line[i] >= 20;
        }
        start && cumulativeData.push(line[i] - 0 || "0");
        if(line[1] === 'Spain' || line[1] === 'Italy' || line[1] === 'Germany' || line[1] === 'France' || line[1] === 'US') {
          start && growthData_tmp.push([0, Math.round(((parseInt(line[i])-parseInt(line[i-1])) / parseInt(line[i-1])) * 100)]);
          start && growthData.push(getAverageData(growthData_tmp, growthData_tmp.length));
        }
      }
      const isSerieVisible = serieName !== "China";
      cumulativeData.length > 0 && cumulativeSeries.push({name: serieName, data: cumulativeData, visible: isSerieVisible});
      incrementData.length > 0 && incrementSeries.push({name: serieName, data: incrementData, visible: isSerieVisible});
      growthData.length > 0 && growthSeries.push({name: serieName, data: growthData, visible: isSerieVisible});
    }
  });
  return {cumulativeSeries, incrementSeries, growthSeries}

}


const addNewCountryData = (countryId) => {
  if(!countriesData[countryId]) {
    countriesData[countryId] = cloneDeep(countryTemplate);
  }
  return getCountryData(countryId);
};

const getCountryData = (countryId) => {
  return countriesData[countryId];
};
