import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import WidgetContainer from './WidgetContainer.jsx';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const useStyles = makeStyles(theme => ({
  root: {
    height: "400px"
  },
}));

const options2 = {

};

const options = {
  chart: {
    type: 'area',
    marginTop: 16,
  },
  credits: {
    enabled: false
  },
  title: {
      text: "",
      y: 2,
      x: -8,
      align: "right"
  },
  series: [
    {
      data: [1, 2, 1, 4, 3, 6]
    }
  ],
  xAxis: {
    tickmarkPlacement: 'on',
  },
  yAxis: {
    title: {
        text: 'Casos'
    }
  },
  legend: {
    align: 'center',
    verticalAlign: 'bottom',
    x: 0,
    y: 0
  },
  tooltip: {
    split: true,
    crosshairs: true,
    shared: true
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
      }
    },
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
};

const SpainEvolutionWidget = ({ series, categories }) => {
  const classes = useStyles();
  options.series = series || [];
  options.xAxis.categories = categories || [];
  options.title.text = "España";
  console.log("SpainEvolutionWidget >", series);
  console.log("Highcharts >", Highcharts);
  return (<>
    <WidgetContainer className={classes.root}>
      <HighchartsReact highcharts={Highcharts} options={options} containerProps = {{ style: {width: "100%"} }} />
    </WidgetContainer>
  </>);
};

export default SpainEvolutionWidget;
