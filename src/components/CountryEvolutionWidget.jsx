import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import WidgetContainer from './WidgetContainer.jsx';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { es as esLocale, enUS as enLocale } from 'date-fns/locale/';
import { format } from 'date-fns';
import { Switch, FormControlLabel } from '@material-ui/core';
import cloneDeep from 'lodash.clonedeep';
import { t, isLanguage } from '../js/I18n';
var _styles = require("@material-ui/core/styles");

const useStyles = makeStyles(theme => ({
  root: {
    height: "300px",
    position: "relative",
    //paddingTop: "1.25rem",
  },
  typeSwitch: {
    position: "absolute",
    top: theme.spacing(1.5),
    left: theme.spacing(0),
    zIndex: 1
  },
  acumSwitch: {
    position: "absolute",
    top: theme.spacing(1.5),
    right: theme.spacing(2.5),
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
      text: t('Fallecidos'),
    },
    labels: {
      align: 'right',
      x: -4,
      y: -6,
      style: {
        color: isResponsive ? _styles.fade(Highcharts.getOptions().colors[2], .88) : "rgba(255,255,255,0)"
      }
    },
    gridLineWidth: 0,
    opposite: true
  }, { // Secondary yAxis
    title: {
      enabled: !isResponsive,
      text: t('PosiTivos - AlTas'),
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
        align: "center"
    },
    subtitle: {
      text: "",
      y: 20,
      align: "center"
    },

    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function () {
          return format(this.value, "dd MMM", {
            locale: isLanguage("es") ? esLocale : enLocale
          });
        },
        padding: 10
      },
      plotLines: countryId === "Spain" ? [{
        color: 'rgba(255,255,255,.5)',
        width: 2,
        value: 1584140400000,
        dashStyle: "Dash",
        label: {
          text: t('Estado Alarma'),
          verticalAlign: 'Top',
          textAlign: 'left',
          y: 8,
          x: 8,
          style: {
            color: 'rgba(255,255,255,.5)',
          }
        }
      },
      {
        color: 'rgba(255,255,255,.5)',
        width: 2,
        value: 1587852000000,
        dashStyle: "Dash",
        label: {
          text: t('Salida niños'),
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
          text: t('Trabajos Esenciales'),
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

const buildSeriesData = (data) => {
  const isAvgData = "true" === localStorage.getItem('countryEvolution.isAvgData') || false;
  const isAcumData = "true" === localStorage.getItem('countryEvolution.isAcumData') || false;
  const series = [];

  const serieType = isAvgData ? (isAcumData ? "acum_avg" : "abs_avg") : (isAcumData ? "acum" : "abs");
  const beginSeries = data.beginIndex;
  series.push({
    name: t("PosiTives"),
    data: cloneDeep(data.confirmed[serieType]).slice(beginSeries),
    lineColor: _styles.fade(Highcharts.getOptions().colors[0], .8),
    color: _styles.fade(Highcharts.getOptions().colors[0], .8),
  });

  series.push({
    name: t("AlTas"),
    data: cloneDeep(data.recovered[serieType]).slice(beginSeries),
    lineColor: _styles.fade(Highcharts.getOptions().colors[1], .8),
    color: _styles.fade(Highcharts.getOptions().colors[1], .8),
  });

  series.push({
    name: t("Fallecidos"),
    data: cloneDeep(data.deaths[serieType]).slice(beginSeries),
    yAxis: 1,
    lineColor: _styles.fade(Highcharts.getOptions().colors[2], .8),
    color: _styles.fade(Highcharts.getOptions().colors[2], .8),
  });
  return series;
};

const getChartSubtitle = isAvgData => `${isAvgData ? t("(media de 7 días)") : ""}`;
const getChartTitle = isAcumData => `${isAcumData ? t("DaTos acumulados") : t("DaTos diarios")}`;

let internalChart;
let chartSeriesData;

const handleTypeChange = (event) => {
  localStorage.setItem('countryEvolution.isAvgData', event.target.checked);

  internalChart && internalChart.update({
    series: buildSeriesData(chartSeriesData),
    subtitle:{text: getChartSubtitle(event.target.checked)}
  }, true, true);
}

const handleAcumChange = (event) => {
  localStorage.setItem('countryEvolution.isAcumData', event.target.checked);

  internalChart && internalChart.update({
    series: buildSeriesData(chartSeriesData),
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
  const isAcumData = "true" === localStorage.getItem('countryEvolution.isAcumData') || false;
  chartSeriesData = data;
  //options.series = series || [];
  options.series = (data && buildSeriesData(data)) || [];
  //options.xAxis.categories = categories || [];
  options.title.text = getChartTitle(isAcumData);
  options.subtitle.text = getChartSubtitle(isAvgData);
  return (<>
    <WidgetContainer className={classes.root}>
      <TypeSwitch onChange={handleTypeChange} initialChecked={isAvgData} />
      <HighchartsReact highcharts={Highcharts} options={options} callback={ afterChartCreated } containerProps = {{ style: {width: "100%"} }} />
      <AcumSwitch onChange={handleAcumChange} initialChecked={isAcumData} />
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
  className={classes.typeSwitch} labelPlacement="start" label={t("Normalizar")} />
  );
}

const AcumSwitch = ({ onChange, initialChecked }) => {

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
  className={classes.acumSwitch} labelPlacement="start" label={t("Acumulado")} />
  );
}
