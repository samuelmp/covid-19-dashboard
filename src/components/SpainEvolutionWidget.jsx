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

const options = {
  chart: {
    type: 'spline',
    marginTop: 30,

  },

  title: {
      text: "",
      y: 4,
      x: -8,
      align: "right"
  },

  xAxis: {
    tickmarkPlacement: 'on',
    plotLines: [{
      color: 'rgba(255,255,255,.3)',
      width: 2,
      value: 9,
      dashStyle: "Dash",
      label: {
        text: 'Estado Alarma',
        verticalAlign: 'Top',
        textAlign: 'center',
        y: 40,
        x: 8,
        style: {
          color: '#FFFFFF',
        }
      }
    }]
  },
  yAxis: [{ // Primary yAxis
    labels: {
      style: {
          color: Highcharts.getOptions().colors[1]
      }
    },
    title: {
      enabled: false,
      text: 'PosiTivos',
      style: {
          color: Highcharts.getOptions().colors[1]
      }
    },

  }, { // Secondary yAxis
    // gridLineWidth: 0,
    title: {
      text: 'Fallecidos - PosiTivos',
      style: {
          color: Highcharts.getOptions().colors[4]
      }
    },
    labels: {
      style: {
          color: Highcharts.getOptions().colors[4]
      }
    },
    opposite: true
  }, { // Secondary yAxis
    // gridLineWidth: 0,
    title: {
      text: 'Altas',
      style: {
          color: Highcharts.getOptions().colors[2]
      }
    },
    labels: {
      style: {
          color: Highcharts.getOptions().colors[2]
      }
    },
    // opposite: true
  }],
};

const SpainEvolutionWidget = ({ series, categories }) => {
  const classes = useStyles();
  options.series = series || [];
  options.xAxis.categories = categories || [];
  options.title.text = "España";
  return (<>
    <WidgetContainer className={classes.root}>
      <HighchartsReact highcharts={Highcharts} options={options} containerProps = {{ style: {width: "100%"} }} />
    </WidgetContainer>
  </>);
};

export default SpainEvolutionWidget;
