
import Papa from 'papaparse';
import { format, parse, getTime } from 'date-fns';
import cloneDeep from 'lodash.clonedeep';

const countriesData = {};

const typeTemplate = {
  acum: [],
  acum_avg: [],
  abs: [],
  abs_avg: [],
  growth: [],
  growth_avg: [],
  score: 0,
  scoreInc: 0,
  scoreTrend: 0,
};

const countryTemplate = {
  color: "#FFF",
  confirmed: cloneDeep(typeTemplate),
  recovered: cloneDeep(typeTemplate),
  deaths: cloneDeep(typeTemplate),
  updateDate: 0,
  beginDatetime: 0,
  beginIndex: 0
}



export const requestData = (callback) => {

  const rawDataObj = {
    spain: false,
    global_deaths: false
  };

  // Spain parsin data
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
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
  , {
    download: true,
    complete: function(results) {
      console.log("Parsing Global results...");
      rawDataObj.global_deaths = results.data;

      Papa.parse(
        "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"
      , {
        download: true,
        complete: function(results) {
          console.log("Parsing Global results...");
          rawDataObj.global_confirmed = results.data;

          Papa.parse(
            "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv"
          , {
            download: true,
            complete: function(results) {
              console.log("Parsing Global results...");
              rawDataObj.global_recovered = results.data;

              window.$.get({url: "https://api.github.com/repos/CSSEGISandData/COVID-19/commits?path=csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv",
                success: data => {
                  if(data && data[0] && data[0].commit && data[0].commit.author) {
                    rawDataObj.global_date = data[0].commit.author.date;
                  }
                  transformData(rawDataObj, callback);
                },
                error: () => {
                  rawDataObj.global_date = false;
                  transformData(rawDataObj, callback);
                }
              });
              //

            },
            error: function(err, file, inputElem, reason) {
              console.log(err);
            },
          });
        },
        error: function(err, file, inputElem, reason) {
          console.log(err);
        },
      });

    },
    error: function(err, file, inputElem, reason) {
      console.log(err);
    },
  });


};

const transformData = (rawDataObj, callback) => {

  if( rawDataObj.spain &&
      rawDataObj.global_deaths &&
      rawDataObj.global_confirmed &&
      rawDataObj.global_recovered &&
      rawDataObj.spain_dates &&
      rawDataObj.global_date &&
      rawDataObj.spain.length > 1 &&
      rawDataObj.global_deaths.length > 1 &&
      rawDataObj.global_confirmed.length > 1 &&
      rawDataObj.global_recovered.length > 1
  ) {

    rawDataObj = handleRawData(rawDataObj);
    const chartData = {
      global_deaths: false,
    }
    transformSpainResults(rawDataObj.spain, rawDataObj.spain_dates);
    transformGlobalResults(rawDataObj.global_deaths, rawDataObj.global_confirmed, rawDataObj.global_recovered, rawDataObj.global_date);

    callback(chartData, countriesData);
  }
}

const handleRawData = (rawDataObj) => {

  const firstSpainDateData = format(new Date(parse(rawDataObj.spain[1][0], "yyyy-MM-dd", new Date())), "M/dd/yy");
  const lastSpainDateData = format(new Date(parse(rawDataObj.spain[rawDataObj.spain.length-1][0], "yyyy-MM-dd", new Date())), "M/dd/yy");

  const global_headers = rawDataObj.global_deaths[0];

  const firstDataIndex = global_headers.indexOf(firstSpainDateData);
  // Fix for death Spain Data
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
  // Fix for confirmed Spain Data
  rawDataObj.global_confirmed.forEach(item => {
    if(item[0] === "" && item[1] === "Spain") {
      for (let i = 1; i < rawDataObj.spain.length; i++) {
        const element = rawDataObj.spain[i];
        if(element && element.length > 0 && element[0]) {
          const globalDateIndex = firstDataIndex  + i - 1;
          item[globalDateIndex] = element[1] || "0";
        }
      }
    }
  });
  // Fix for recovered Spain Data
  rawDataObj.global_recovered.forEach(item => {
    if(item[0] === "" && item[1] === "Spain") {
      for (let i = 1; i < rawDataObj.spain.length; i++) {
        const element = rawDataObj.spain[i];
        if(element && element.length > 0 && element[0]) {
          const globalDateIndex = firstDataIndex  + i - 1;
          item[globalDateIndex] = element[2] || "0";
        }
      }
    }
  });

  rawDataObj.global_deaths[0].slice(-1)!==lastSpainDateData && rawDataObj.global_deaths[0].push(lastSpainDateData);
  rawDataObj.global_confirmed[0].slice(-1)!==lastSpainDateData && rawDataObj.global_confirmed[0].push(lastSpainDateData);
  rawDataObj.global_recovered[0].slice(-1)!==lastSpainDateData && rawDataObj.global_recovered[0].push(lastSpainDateData);

  return rawDataObj;
};


const transformSpainResults = (results, dates) => {

  const spainData = addNewCountryData("Spain");

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

/**
 * Adds new country object to the global list of objects
 * @param {*} countryId the key for the country
 */
const addNewCountryData = (countryId) => {
  if(!countriesData[countryId]) {
    countriesData[countryId] = cloneDeep(countryTemplate);
  }
  return getCountryData(countryId);
};

/**
 * Returns the object related with the country id parameter
 * @param {*} countryId
 */
const getCountryData = (countryId) => {
  return countriesData[countryId];
};

/**
 * Resolve and returns the scores for de data object parameter
 * @param {*} dataObj
 */
const getScores = (dataObj) => {
  const scoreSlice = dataObj.acum.slice(-1);
  const score = (scoreSlice.length > 0 && scoreSlice[0][1]) || 0;
  const scoreIncSlice = dataObj.abs.slice(-1);
  const scoreInc =(scoreIncSlice.length > 0 && scoreIncSlice[0][1]) || 0;
  const scoreTrendSlice = dataObj.abs.slice(-2);
  const scoreTrend = scoreInc - ((scoreTrendSlice.length > 0 && scoreTrendSlice[0][1]) || 0);
  return {score, scoreInc, scoreTrend};
}

/**
 * Resolve the average value for the array for seven positions of the array parameter
 * @param {*} serie
 * @param {*} index
 */
const getAverageData = (serie, index) => {
  const l = serie.length;
  const data4Avg = serie.slice(l >= 7 ? index-7 : 0, index).map(item => item[1]);
  const avg = arrayAverage(data4Avg);
  return avg >= 0 ? avg : 0;
}

/**
 * Returns the average value for an array parameter
 * @param {*} array
 */
const arrayAverage = (array) => {
  var sum = 0;
  for( let i = 0; i < array.length; i++ ) {
      sum += parseInt( array[i], 10 );
  }
  return Math.round((array.length > 0 && sum/array.length) || 0);
}


const transformGlobalResults = (global_deaths, global_confirmed, global_recovered, global_date) => {

  resolveGlobalData(global_deaths, "deaths", global_date);
  resolveGlobalData(global_confirmed, "confirmed", global_date);
  resolveGlobalData(global_recovered, "recovered", global_date);
};

const resolveGlobalData = (globalData, type, updateDate) => {

  const countries = ["Italy", "Spain", "Germany", "France", "United Kingdom", "Hubei", "US"];
  const headers = globalData[0];

  globalData.forEach((line, index) => {

    if(line[0] === "" || countries.indexOf(line[0]) >= 0 ) {

      const countryData = addNewCountryData(line[1]);
      resetArrays(countryData[type]);


      if(!countryData.updateDate) {
        if(updateDate) {
          countryData.updateDate = new Date(updateDate);
        } else {
          countryData.updateDate = new Date(getTime(parse(headers[headers.length-1], "M/dd/yy", new Date())))
        }

      }

      for(let index = 5; index < line.length; index++) {
        const timestamp = getTime(parse(headers[index], "M/dd/yy", new Date()));
        const data = line[index];

        const acumData = (data && parseInt(data)) || 0;
        const lastAcumData = (index > 5 && parseInt(line[index-1])) || 0;
        const absData = (acumData && (acumData - lastAcumData) ) || 0;
        countryData[type].acum.push([timestamp, acumData]);
        countryData[type].acum_avg.push([timestamp, getAverageData(countryData[type].acum, countryData[type].acum.length-1)]);
        countryData[type].abs.push([timestamp, absData]);
        countryData[type].abs_avg.push([timestamp, getAverageData(countryData[type].abs, countryData[type].abs.length-1)]);

        countryData[type].growth.push([timestamp, (countryData[type].acum.length > 1 ? (countryData[type].acum[countryData[type].acum.length-1][1] - countryData[type].acum[countryData[type].acum.length-2][1]) / countryData[type].acum[countryData[type].acum.length-2][1] : 0) * 100]);
        // countryData[type].growth_avg.push([timestamp, countryData[type].abs_avg.length > 1 ? (countryData[type].abs_avg[countryData[type].abs_avg.length-1][1] - countryData[type].abs_avg[countryData[type].abs_avg.length-2][1]) / countryData[type].abs_avg[countryData[type].abs_avg.length-2][1] : 0 ]);
        countryData[type].growth_avg.push([timestamp, getAverageData(countryData[type].growth, countryData[type].growth.length-1)]);
        if(!countryData.beginDatetime && type === "confirmed" && acumData >= 500) {
          countryData.beginDatetime = timestamp;
          countryData.beginIndex = countryData[type].acum.length-1;
        }
      }
      countryData[type] = { ...countryData[type],  ...getScores(countryData[type])};
    }
  });

};

const resetArrays = (data) => {
  data.acum = [];
  data.acum_avg = [];
  data.abs = [];
  data.abs_avg = [];
  data.growth = [];
  data.growth_avg = [];
}
