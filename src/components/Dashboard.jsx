import React, {Component} from 'react';

import { Typography, Grid, Box, Link } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import Score from './Score.jsx';

import { requestData } from '../services/dataService';
import WidgetContainer from './WidgetContainer.jsx';

import Highcharts from 'highcharts';

import SpainEvolutionWidget from './SpainEvolutionWidget.jsx';

const styles = theme => ({
  root: {
    width: '100%',
  },
  mainTitle: {
    fontSize: "2rem",
    textAlign: "center",
    borderBottom: "1px none #A2A39C60",
    paddingBottom: ".4rem",
    marginBottom: 0,
    marginTop: "1rem",
  },
});


class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scoreData: [],
      spainSeries: [],
      spainCatergories: []
    };
  }

  componentDidMount = () => {
    requestData((data) => {
      this.setState({
        spainSeries: data.spain.spainSeriesNew,
        spainCatergories: data.spain.spainCatergories,
        scoreData: data.spain.scoreData
      });

      renderChart(data.global_deaths.cumulativeSeries, "container1", "FallecimienTos acumulados");
      renderChart(data.global_deaths.incrementSeries, "container2", "Nuevos fallecimienTos")
      renderChart(data.global_deaths.growthSeries, "container3", "Tasa de crecimiento", "%");

    });
  }

  render() {
    const {classes} = this.props;
    const { scoreData, spainSeries, spainCatergories } = this.state;
    return (
      <Box style={{padding: "0 2rem", paddingBottom: "1rem"}}>
        <Typography variant="h4" className={classes.mainTitle} >Evolución COVID-19 en España</Typography>
        <Grid container component={Box} spacing={3} py={3} mb={1} >
          <Grid item xs={12} md={6}>
            <Grid container spacing={3} component={Box}>
              <Grid item xs={12} sm={6} lg={4}>
                <Score {...scoreData.score0} />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Score {...scoreData.score1} />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Score {...scoreData.score2} />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Score {...scoreData.score3} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={0} component={Box} pr={0}>
              <SpainEvolutionWidget series={spainSeries} categories={spainCatergories} />
            </Grid>
          </Grid>
        </Grid>
        <Typography variant="h4" className={classes.mainTitle} >COVID-19 Evolución global basada en fallecimienTos</Typography>
        <Grid container spacing={3} component={Box} pt={3} pr={0} >
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
        <Grid container spacing={3} component={Box} pt={3} pb={3} >
          <Score title="FuenTes de daTos" scoreInc={<>
            <Link href="https://github.com/datadista/datasets" rel="noopener noreferrer" target="_blank">
              DaTa from Spain of COVID-19 (by DaTadisTa)
            </Link>
            <br />
            <Link href="https://github.com/CSSEGISandData/COVID-19" rel="noopener noreferrer" target="_blank">
              DaTa ReposiTory by Johns Hopkins CSSE
            </Link>
            <br />
            {scoreData.score4 && scoreData.score4.score}
          </>} />
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
            text: 'PosiTivos'
        }
    },

    xAxis: {
      allowDecimals: false,
      tickmarkPlacement: 'on',
        /*accessibility: {
            rangeDescription: 'Range: 2010 to 2017'
        },
        categories: headers*/
    },

    series: series,

  });
}

