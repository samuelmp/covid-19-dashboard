import Highcharts from 'highcharts';
// Theme for highchart
Highcharts.setOptions({
  "colors": ["#F92672", "#66D9EF", "#A6E22E", "#f1c40f", "#e74c3c", "#34495e", "#3498db", "#1abc9c", "#f39c12", "#d35400"],
  "chart": {
    "backgroundColor": "rgba(0,0,0,0)",//"#06121a",
    "style": {
      "fontFamily": 'Unica One',
      "color": "#A2A39C"
    },
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
    "align": "center",
    "verticalAlign": "bottom",
    "itemStyle": {
      "fontWeight": "normal",
      "color": "#A2A39C"
    },
    x: 0,
    y: 0
  },

  "xAxis": {
    "gridLineDashStyle": "Dot",
    "gridLineWidth": 0,
    "gridLineColor": "rgba(255,255,255,.3)",
    "lineColor": "rgba(255,255,255,.3)",
    "minorGridLineColor": "rgba(255,255,255,.3)",
    "tickColor": "rgba(255,255,255,.3)",
    "tickWidth": 0
  },
  "yAxis": {
    "gridLineDashStyle": "Dot",
    "gridLineWidth": 1,
    "gridLineColor": "rgba(255,255,255,.3)",
    "lineColor": "rgba(255,255,255,.3)",
    "minorGridLineColor": "rgba(255,255,255,.3)",
    "tickColor": "rgba(255,255,255,.3)",
    "tickWidth": 0
  },
  plotOptions: {
    area: {
      stacking: 'normal',
      lineColor: '#666666',
      lineWidth: 1,
      marker: {
        enabled: false
      }
    },
    series: {
      fillColor: {
        linearGradient: {x1: 0, y1: 0, x2: .8, y2: .9},
      },
      marker: {
        fillColor: 'rgba(255,255,255,.9)',
        lineWidth: 2,
        lineColor: null, // inherit from series
        symbol: "circle",
        radius: 3,
        enabled: false
      }
    },
  },
  tooltip: {
    split: false,
    crosshairs: true,
    shared: true,
    style: {color: "#A2A39C"}
  },
  responsive: {
    rules: [{
      condition: {
        maxWidth: 500
      },
      chartOptions: {
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom'
        }
      }
    }]
  }

});
