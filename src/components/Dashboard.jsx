import React, {Component} from 'react';

import { Typography, Grid, Box } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import Score from './Score.jsx';

import { requestData } from '../services/dataService';
import WidgetContainer from './WidgetContainer.jsx';

import Highcharts from 'highcharts';

import SpainEvolutionWidget from './SpainEvolutionWidget.jsx';
import SpainEvolutionAcumWidget from './SpainEvolutionAcumWidget.jsx';

import { es as esLocale } from 'date-fns/locale/';
import { format } from 'date-fns'

const styles = theme => ({
  root: {
    width: '100%',
  },
  mainTitle: {
    fontSize: "2rem",
    textAlign: "center",
    borderBottom: "1px none #A2A39C60",
    padding: "1rem",
    marginBottom: 0,
  },
});


class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      spainSeries: [],
      countriesData: {}
    };
  }

  componentDidMount = () => {
    requestData((data, countriesData) => {
      this.setState({
        spainSeries: data.spain.spainSeriesNew,
        countriesData: countriesData
      });

      renderChart(data.global_deaths.cumulativeSeries, "container1", "FallecimienTos acumulados");
      renderChart(data.global_deaths.incrementSeries, "container2", "Nuevos fallecimienTos")
      renderChart(data.global_deaths.growthSeries, "container3", "Tasa de crecimiento", "%");

    });
  }

  render() {
    const {classes} = this.props;
    const { spainSeries, countriesData } = this.state;
    const spainData = countriesData["Spain"] || false;
    let updateString = "";
    if(spainData) {
      const udateDate = spainData.updateDate;
      updateString = format(udateDate, "EEEE dd MMMM 'a las' H:mm ", {
        locale: esLocale
      });
    }


    return (
      <Box style={{padding: "0 2rem", paddingBottom: "1rem", paddingRight: "1.5rem"}}>
        <Grid container spacing={3} component={Box} pt={1} >
          <Grid item xs={3} component={Box} display="flex" alignItems="center">
            <Grid container spacing={0} direction="column" >
              <Grid item><Typography variant="body1" >ACTUALIZADO: </Typography></Grid>
              <Grid item><Typography variant="body1" color="primary" >{updateString.toUpperCase()}</Typography></Grid>
            </Grid>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" className={classes.mainTitle} >Evolución COVID-19 en España</Typography>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>

        <Grid container component={Box} spacing={3} pt={1} mb={1} >
          <Grid item xs={12} lg={4} style={{paddingRight: "1.5rem"}}>
            <Grid container spacing={3} component={Box} height="calc(100% + 24px)">
              <Grid item xs={12} sm={6} lg={6}>
                <Score title="PosiTivos" color="blue" serie={spainSeries[0]} />
              </Grid>
              <Grid item xs={12} sm={6} lg={6}>
                <Score title="AlTas" color="green" reverseTrend serie={spainSeries[1]} />
              </Grid>
              <Grid item xs={12} sm={6} lg={6}>
                <Score title="Fallecidos" color="red" serie={spainSeries[2]} />
              </Grid>
              <Grid item xs={12} sm={6} lg={6}>
                <Score title="Casos esTimados" color="orange"
                  serie={spainSeries[2] ? {...spainSeries[2], data: spainSeries[2].data.map(el => el * 100)} : undefined}
                  trendText = "* Basado en una tasa de fallecimienTos del 1%"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} lg={4} component={Box} pr={0}>
            <Grid container spacing={0} component={Box} pr={0}>
              <SpainEvolutionWidget data={spainData} />
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} lg={4} component={Box} pr={0}>
            <Grid container spacing={0} component={Box} pr={0}>
              <SpainEvolutionAcumWidget data={spainData} />
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={3} component={Box} pt={1} >
          {/* <Grid item xs={3} component={Box} display="flex" alignItems="center">
            <Grid container spacing={0} direction="column" >
              <Grid item><Typography variant="body1" >ACTUALIZADO: </Typography></Grid>
              <Grid item><Typography variant="body1" color="primary" >{updateString.toUpperCase()}</Typography></Grid>
            </Grid>
          </Grid> */}
          <Grid item xs>
            <Typography variant="h4" className={classes.mainTitle} >COVID-19 Evolución global basada en fallecimienTos</Typography>
          </Grid>
          {/* <Grid item xs={3}></Grid> */}
        </Grid>
        <Grid container spacing={3} component={Box} pt={1} pr={0} >
          <Grid item xs={12} md={6} lg={4}>
            <WidgetContainer id="container1" style={{height: "400px"}} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <WidgetContainer id="container2" style={{height: "400px"}} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <WidgetContainer id="container3" style={{height: "400px"}} />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default withStyles(styles, {withTheme: true})(Dashboard);

console.clear();
setTimeout(function(){
  window.location = ''
}, 5 * 60 * 1000);

const renderChart = (series, container, title, sufix = false) => {

  Highcharts.chart(container, {
    chart: {
      type: 'spline',
      marginTop: 20,
      marginBottom: 50,
    },
    title: {
        text: title,
        y: 2,
        x: -8,
        align: "right"
    },
    tooltip: {
        valueSuffix: sufix || "",
    },
    yAxis: {
        title: {
            text: 'Fallecidos'
        }
    },

    xAxis: {
      allowDecimals: false,
      tickmarkPlacement: 'on',
    },

    series: series,

  });
}

