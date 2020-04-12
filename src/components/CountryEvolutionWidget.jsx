import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import WidgetContainer from './WidgetContainer.jsx';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { es as esLocale } from 'date-fns/locale/';
import { format } from 'date-fns';
import { Switch, FormControlLabel } from '@material-ui/core';
import cloneDeep from 'lodash.clonedeep';
var _styles = require("@material-ui/core/styles");

const useStyles = makeStyles(theme => ({
  root: {
    height: "400px",
    position: "relative"
  },
  switch: {
    position: "absolute",
    top: theme.spacing(1.5),
    left: theme.spacing(0),
    zIndex: 1
  }
}));

const getYAxis = (isResponsive = false) => {

  return [{ // Primary yAxis
    title: {
      enabled: false,
    },
  }, { // Secondary yAxis
    title: {
      enabled: !isResponsive,
      text: 'Fallecidos',
    },
    labels: {
      align: 'right',
      x: -4,
      y: -6
    },
    opposite: true
  }, { // Secondary yAxis
    title: {
      enabled: !isResponsive,
      text: 'PosiTivos - AlTas',
    },
  }];

};

const getHighchartsOptions = (countryId) => {
  return {
    chart: {
      type: 'spline',
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
        color: 'rgba(255,255,255,.66)',
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
            color: 'rgba(255,255,255,.66)',
          }
        }
      }] : [],
      plotBands: countryId === "Spain" ? [{
        color: 'rgba(255,255,255,.05)',
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
    yAxis: getYAxis() ,

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
          yAxis: getYAxis(true)
        }
      }]
    }
  };
};

const buildSeriesData = (data, isAvgData) => {

  const series = [];
  const serieType = isAvgData ? "abs_avg" : "abs";
  const beginSeries = data.beginIndex;
  series.push({
    name: "Casos",
    data: cloneDeep(data.confirmed[serieType]).slice(beginSeries),
    lineColor: _styles.fade(Highcharts.getOptions().colors[0], .8),
    color: _styles.fade(Highcharts.getOptions().colors[0], .8),
    dashStyle: "Solid"
  });

  series.push({
    name: "Altas",
    data: cloneDeep(data.recovered[serieType]).slice(beginSeries),
    lineColor: _styles.fade(Highcharts.getOptions().colors[1], .8),
    color: _styles.fade(Highcharts.getOptions().colors[1], .8),
    dashStyle: "Solid"
  });

  series.push({
    name: "Fallecidos",
    data: cloneDeep(data.deaths[serieType]).slice(beginSeries),
    yAxis: 1,
    lineColor: _styles.fade(Highcharts.getOptions().colors[2], .8),
    color: _styles.fade(Highcharts.getOptions().colors[2], .8),
    dashStyle: "Solid"
  });
  return series;
};

const getChartTitle = isAvgData => `DaTos diarios${isAvgData ? " (media de 7 días)" : ""}`;

let internalChart;
let chartSeriesData;
const handleChange = (event) => {
  localStorage.setItem('countryEvolution.isAvgData', event.target.checked);

  internalChart && internalChart.update({
    series: buildSeriesData(chartSeriesData, event.target.checked),
    title:{text: getChartTitle(event.target.checked)}
  }, true, true);
}

const afterChartCreated = (chart) => {
  internalChart = chart;
}

const CountryEvolutionWidget = ({ data, countryId }) => {
  const classes = useStyles();
  const options = getHighchartsOptions(countryId);

  const isAvgData = "true" === localStorage.getItem('countryEvolution.isAvgData') || false;
  chartSeriesData = data;
  //options.series = series || [];
  options.series = (data && buildSeriesData(data, isAvgData)) || [];
  //options.xAxis.categories = categories || [];
  options.title.text = getChartTitle(isAvgData);
  return (<>
    <WidgetContainer className={classes.root}>
      <TypeSwitch onChange={handleChange} initialChecked={isAvgData} />
      <HighchartsReact highcharts={Highcharts} options={options} callback={ afterChartCreated } containerProps = {{ style: {width: "100%"} }} />
    </WidgetContainer>
  </>);
};

export default CountryEvolutionWidget;


const TypeSwitch = ({ onChange, initialChecked }) => {

  const classes = useStyles();
  const [checked, setChecked] = React.useState(initialChecked);
  const handleChange = (event) => {
    setChecked(event.target.checked);
    onChange && onChange(event);
  };

  return(
  <FormControlLabel control={
    <Switch color="primary" disableRipple size="small" checked={checked} onChange={handleChange} />
  }
  className={classes.switch} labelPlacement="start" label="Normalizar" />
  );
}
