
var Papa = require('papaparse');

export const listSpainResults = (callback) => {
  Papa.parse("https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/nacional_covid19.csv", {
    download: true,
    complete: function(results, file) {
      console.log("Parsing Spain results...");

      const categories = [];
      const series = [];
      results.data.forEach((line, index) => {
        if(index === 0) {
          series.push(
            {name: line[1],data: [], 
              fillColor: {
              stops: [
                  [0, 'rgba(102, 207, 239, 1)'],
                  [1, 'rgba(102, 207, 239, .1)']
                ]
              }, lineColor: 'rgba(102, 207, 239, .8)',
              color: 'rgba(102, 207, 239, .8)'
            },
            {name: line[2],data: [], fillColor: {
              stops: [
                  [0, 'rgba(166, 226, 46, 1)'],
                  [1, 'rgba(166, 226, 46, .1)']
                ]
              }, lineColor: 'rgba(166, 226, 46, .8)',
              color: 'rgba(166, 226, 46, .8)'},
            {name: line[3],data: [], fillColor: {
              stops: [
                
                  [0, 'rgba(231, 76, 60, .9)'],
                  [1, 'rgba(231, 76, 60, .1)']
                ]
              }, lineColor: 'rgba(231, 76, 60, .8)',
              color: 'rgba(231, 76, 60, .8)'}
            );
        } else if(line[0] && parseInt(line[3])  > 1 ) {
          categories.push(line[0]);
          series[0].data.push(line[1] ? parseInt(line[1]) : 0);
          series[1].data.push(line[2] ? parseInt(line[2]) : 0);
          series[2].data.push(line[3] ? parseInt(line[3]) : 0);
        }
      });
      callback({categories, series});
    },
    error: function(err, file, inputElem, reason) {
      console.error(err);
    },
  });
};
