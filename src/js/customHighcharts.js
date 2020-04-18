import Highcharts from 'highcharts';
  const timezone = new Date().getTimezoneOffset();

  // Theme and common settings for highchart
  Highcharts.setOptions({
    global: {
      timezoneOffset: timezone - 60
    },

    "colors": ["#6dbad6", "#A6E22E", "#e74c3c", "#F92672", "#51d8b2" ,"#cd4691",  "#38d4d8", "#6b6be2", "#b94db7", "#3789da", "#0aadbf"],
    //"colors": [ "#6dbad6", "#A6E22E", "#e74c3c", "#F92672", "#665191", "#a05195", "#d45087", "#f95d6a", "#ff7c43", "#ffa600", "#26eeb6", "#1863fd", "#f1c40f",  "#5e83a8", "#f39c12", "#d35400"],
    // "colors": ["#ffa600", "#ff7c43", "#f95d6a", "#d45087", "#a05195", "#665191", "#2f4b7c", "#003f5c"],

    "chart": {
      "backgroundColor": "rgba(0,0,0,0)",//"#06121a",
      "style": {
        "fontFamily": 'Unica One',
        "color": "#A2A39C"
      },
      "marginTop": 30,

    },
    credits: {
      enabled: false
    },
    "title": {
      "style": {
        "color": "#A2A39C"
      },
      "align": "left"
    },
    "subtitle": {
      "style": {
        "color": "#A2A39C"
      },
      "align": "left"
    },
    "legend": {
      "align": "left",
      "verticalAlign": "bottom",
      "itemStyle": {
        "fontWeight": "normal",
        "color": "#A2A39C"
      },
      itemHoverStyle: {
        color: '#F92672'
      },
      itemHiddenStyle: {
        color: 'rgba(255,255,255,.3)'
      },
      x: 0,
      y: 22
    },

    "xAxis": {
      "gridLineDashStyle": "Dot",
      "gridLineWidth": 0,
      "gridLineColor": "red", //"rgba(255,255,255,.3)",
      lineWidth: 0,
      "lineColor": "rgba(255,255,255,.2)",
      "minorGridLineColor": "rgba(255,255,255,.2)",
      "tickColor": "rgba(255,255,255,.2)",
      "tickWidth": 0,
      crosshair: {
        color: "rgba(204,214,235,0.075)",
        width: 18
      },
      labels: {
        formatter:function() {
          if(this.value !== 0) {
              return this.value;
          }
        }
      }
    },
    "yAxis": {
      "gridLineDashStyle": "Dot",
      "gridLineWidth": 1,
      "gridLineColor": "rgba(255,255,255,.2)",
      "lineColor": "red",//"rgba(255,255,255,.3)",
      "minorGridLineColor": "rgba(255,255,255,.2)",
      "tickColor": "rgba(255,255,255,.2)",
      "tickWidth": 0,
      labels: {
        align: 'left',
        x: 2,
        y: -6,
        // formatter:function(){
        //   if(this.value !== 0){
        //       return this.value;
        //   }
        // }
      }
    },
    plotOptions: {
      area: {
        stacking: 'normal',
        lineWidth: 0,
        marker: {
          enabled: false
        }
      },
      series: {
        fillColor: {
          linearGradient: {x1: 0, y1: 0, x2: .8, y2: .9},
        },
        marker: {
          fillColor: 'rgba(235,235,235,1)',
          // fillColor: "rgba(24,41,53, 1)",
          lineWidth: 2,
          lineColor: null, // inherit from series
          symbol: "circle",
          radius: 4,
          enabled: false
        }
      },
    },
    tooltip: {
      split: false,
      crosshairs: true,
      shared: true,
      style: {color: "#A2A39C"},
      xDateFormat: '%e %B %Y',
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'left',
            verticalAlign: 'bottom'
          },
          yAxis: {
            title: {
              enabled: false,
            }
          }
        }
      }]
    }

  });

