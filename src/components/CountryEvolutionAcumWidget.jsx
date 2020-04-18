import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import WidgetContainer from './WidgetContainer.jsx';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { es as esLocale } from 'date-fns/locale/';
import { format } from 'date-fns';

var _styles = require("@material-ui/core/styles");

const useStyles = makeStyles(theme => ({
  root: {
    height: "300px"
  },
}));

const getHighchartsOptions = (countryId) => {


  return {
    chart: {
      type: 'area',
      marginTop: 40,
    },

    title: {
      text: "",
      y: 2,
      x: -2,
      align: "right"
    },

    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function () {
          return format(this.value, "dd MMM", {
            locale: esLocale
          });
        },
      },

      plotLines: countryId === "Spain" ? [{
        color: 'rgba(255,255,255,.5)',
        width: 2,
        value: 1584140400000,
        dashStyle: "Dash",
        label: {
          text: 'Estado Alarma',
          verticalAlign: 'Top',
          textAlign: 'left',
          y: 8,
          x: 8,
          style: {
            color: 'rgba(255,255,255,.5)',
          }
        }
      }] : [],
      plotBands: countryId === "Spain" ? [{
        color: {
					linearGradient:  { x1: 0, x2: 0, y1: 0, y2: 1 },
					stops: [
            [0, 'rgba(255,255,255,.05)'],
            [.5, 'rgba(255,255,255,.025)'],
						[1, 'rgba(255,255,255,.0)'],
					]
				},
        from: 1585519200000,
        to: 1585519200000 + (1000*60*60*24*12),
        label: {
          text: 'Trabajos Esenciales',
          style: {
            color: 'rgba(255,255,255,.66)',
          }
        }
      }] : []
    },
    plotOptions: {
      area: {
        stacking: undefined,
      },
      series: {
        lineWidth: 4
      }
    },
    yAxis: {
      title: {
        enabled: false,
      },
    } ,
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
        }
      }]
    }
  };
};

const buildSeriesData = data => {

  const series = [];
  const beginSeries = data.beginIndex;
  series.push({
    name: "Casos",
    data: data.confirmed.acum.slice(beginSeries)
  });

  series.push({
    name: "Altas",
    data: data.recovered.acum.slice(beginSeries)
  });

  series.push({
    name: "Fallecidos",
    data: data.deaths.acum.slice(beginSeries)
  });

  return series;
};


const CountryEvolutionAcumWidget = ({ data, countryId }) => {
  const classes = useStyles();
  const seriesColors = [
    Highcharts.getOptions().colors[0],
    Highcharts.getOptions().colors[1],
    Highcharts.getOptions().colors[2]
  ];
  const options = getHighchartsOptions(countryId);

  options.series = (data && buildSeriesData(data)) || [];

  options.series.forEach( (serie, index, series) => {
    series[index] = { ...serie,
      fillColor: {
        stops: [[0, _styles.fade(seriesColors[index], .6)], [1, _styles.fade(seriesColors[index], 0)]]
      },
      lineColor: _styles.fade(seriesColors[index], .8),
      color: _styles.fade(seriesColors[index], .8)
    };
  });
  options.title.text = "DaTos acumulados";
  return (<>
    <WidgetContainer className={classes.root}>
      <HighchartsReact highcharts={Highcharts} options={options} containerProps = {{ style: {width: "100%"} }} />
    </WidgetContainer>
  </>);
};

export default CountryEvolutionAcumWidget;
