import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import WidgetContainer from './WidgetContainer.jsx';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { es as esLocale, enUS as enLocale } from 'date-fns/locale/';
import { format } from 'date-fns';
import { t, isLanguage } from '../js/I18n';

var _styles = require("@material-ui/core/styles");

const useStyles = makeStyles(theme => ({
  root: {
    height: "300px"
  },
}));

const getHighchartsOptions = (countryId) => {


  return {
    chart: {
      type: 'spline',
      marginTop: undefined,
    },

    title: {
      text: "",
      // y: 2,
      // x: -2,
      align: "right"
    },
    subtitle: {
      text: "",
      // y: 20,
      // x: -2,
      align: "right"
    },
    caption: {
      text: "",
      align: "right",
      style: {
        color: "#AAAAAA",
        "fontSize": "15px"
      }
    },
    tooltip: {
      valueDecimals: 2,
    },
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function () {
          return format(this.value, "dd MMM", {
            locale: isLanguage("es") ? esLocale : enLocale
          });
        },
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
      max: 100,
      min: 0
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
    name: t("Tasa de recuperación"),
    data: data.recoveredRate.acum.slice(beginSeries)
  });

  series.push({
    name: t("Tasa de mortalidad"),
    data: data.deathsRate.acum.slice(beginSeries)
  });

  return series;
};


const CountryEvolutionAcumWidget = ({ data, countryId }) => {
  const classes = useStyles();
  const seriesColors = [
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
  options.title.text = t("Resultado de los casos (Recuperados o fallecidos)");
  options.subtitle.text = t("Resultado del total de casos cerrados (Tasa de recuperación frente a tasa de mortalidad)");

  // options.caption.text = t("<b>Resultado del total de casos cerrados (tasa de recuperación frente a tasa de mortalidad)</b><br/><em>(Total acumulado de muertes y recuperaciones sobre el número acumulado de casos cerrados)</em>");
  // options.caption.text = t("(Total acumulado de muertes y recuperaciones sobre el número acumulado de casos cerrados)");
  return (<>
    <WidgetContainer className={classes.root}>
      <HighchartsReact highcharts={Highcharts} options={options} containerProps = {{ style: {width: "100%"} }} />
    </WidgetContainer>
  </>);
};

export default CountryEvolutionAcumWidget;
