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
    height: "400px"
  },
}));

const getHighchartsOptions = () => {


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

      plotLines: [{
        color: 'rgba(255,255,255,.3)',
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
            color: '#FFFFFF',
          }
        }
      },{
        color: 'rgba(255,255,255,.3)',
        width: 2,
        value: 1585519200000,
        dashStyle: "Dash",
        label: {
          text: 'Trabajos Esenciales',
          verticalAlign: 'Top',
          textAlign: 'left',
          y: 8,
          x: 8,
          style: {
            color: '#FFFFFF',
          }
        }
      }]
    },
    plotOptions: {
      area: {
        stacking: undefined,
      },
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
            align: 'center',
            verticalAlign: 'bottom'
          },
        }
      }]
    }
  };
};

const buildSeriesData = data => {

  const series = [];

  series.push({
    name: "Casos",
    data: data.cases.acum
  });

  series.push({
    name: "Altas",
    data: data.recovered.acum
  });

  series.push({
    name: "Fallecidos",
    data: data.deaths.acum
  });

  return series;
};


const SpainEvolutionAcumWidget = ({ data }) => {
  const classes = useStyles();
  const seriesColors = [
    Highcharts.getOptions().colors[1],
    Highcharts.getOptions().colors[2],
    Highcharts.getOptions().colors[4]
  ];
  const options = getHighchartsOptions();

  options.series = (data && buildSeriesData(data)) || [];

  options.series.forEach( (serie, index, series) => {
    series[index] = { ...serie,
      fillColor: {
        stops: [[0, _styles.fade(seriesColors[index], 1)], [1, _styles.fade(seriesColors[index], .1)]]
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

export default SpainEvolutionAcumWidget;
