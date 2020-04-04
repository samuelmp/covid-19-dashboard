
import Papa from 'papaparse';
import { format, parse } from 'date-fns';


export const requestData = (callback) => {

  const rawDataObj = {
    spain: false,
    global_deaths: false
  };

  Papa.parse("https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/nacional_covid19.csv", {
    download: true,
    complete: function(results) {
      console.log("Parsing Spain results...");
      rawDataObj.spain = results.data;
      transformData(rawDataObj, callback);
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

  if(rawDataObj.spain && rawDataObj.global_deaths && rawDataObj.spain.length > 1 && rawDataObj.global_deaths.length > 1  ) {

    rawDataObj = handleRawData(rawDataObj);
    const chartData = {
      spain: false,
      global_deaths: false,
    }
    const spainResults = transformSpainResults(rawDataObj.spain);
    chartData.spain = {
      spainSeries: spainResults.series,
      spainSeriesNew: spainResults.seriesNew,
      spainCatergories: spainResults.categories,
    };

    chartData.global_deaths = transformGlobalResults(rawDataObj.global_deaths);

    callback(chartData);
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


const transformSpainResults = results => {

  const categories = [];
  const series = [];
  let seriesNew = [];
  results.forEach((line, index) => {
    if(index === 0) {
      series.push(
        {name: line[1],data: []},
        {name: line[2],data: []},
        {name: line[3],data: []}
      );

      seriesNew.push(
        {name: line[1],data: []},
        {name: line[2],data: []},
        {name: line[3],data: [], yAxis: 1}
      );

    } else if(line[0] && parseInt(line[3])  > 1 ) {
      categories.push(line[0].replace("2020-", ""));
      series[0].data.push(line[1] ? parseInt(line[1]) : 0);
      series[1].data.push(line[2] ? parseInt(line[2]) : 0);
      series[2].data.push(line[3] ? parseInt(line[3]) : 0);


      const lastDataSerie0 = (series[0].data.length > 1 && series[0].data[series[0].data.length-2]) || 0;
      const lastDataSerie1 = (series[1].data.length > 1 && series[1].data[series[1].data.length-2]) || 0;
      const lastDataSerie2 = (series[2].data.length > 1 && series[2].data[series[2].data.length-2]) || 0;

      seriesNew[0].data.push(line[1] ? parseInt(line[1]) - lastDataSerie0 : 0);
      seriesNew[1].data.push(line[2] ? parseInt(line[2]) - lastDataSerie1 : 0);
      seriesNew[2].data.push(line[3] ? parseInt(line[3]) - lastDataSerie2 : 0);
    }
  });
  return {categories, series, seriesNew};
};


const transformGlobalResults = results => {
  const countries = ["Italy", "Spain", "Germany", "France", "United Kingdom", "Hubei"]
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
      const growthData = [];
      let start = false;

      for(let i=5; i<line.length; i++) {
        if(!start) {
          start = line[i] >= 50;
        }
        if(line[1] === 'Spain' || line[1] === 'Italy' || line[1] === 'Germany' || line[1] === 'France') {
          // if(i === 54) {
          //   const fix = (parseInt(line[i+1])-parseInt(line[i])) / 2;
          //   line[i] = parseInt(line[i]) + fix;
          // }
          start && growthData.push(Math.round(((parseInt(line[i])-parseInt(line[i-1])) / parseInt(line[i-1])) * 100));
        }
        start && incrementData.push(line[i]-line[i-1]);
        start && cumulativeData.push(line[i]-0);
      }
      const isSerieVisible = serieName !== "China";
      cumulativeData.length > 0 && cumulativeSeries.push({name: serieName, data: cumulativeData, visible: isSerieVisible});
      incrementData.length > 0 && incrementSeries.push({name: serieName, data: incrementData, visible: isSerieVisible});
      growthData.length > 0 && growthSeries.push({name: serieName, data: growthData, visible: isSerieVisible});
    }
  });
  return {cumulativeSeries, incrementSeries, growthSeries}

}
