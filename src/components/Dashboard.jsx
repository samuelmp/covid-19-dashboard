import React, {Component} from 'react';

import { Typography, Grid, Box, Link } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import Score from './Score.jsx';

import { listSpainResults } from '../services/dataService';
import WidgetContainer from './WidgetContainer.jsx';

import Papa from 'papaparse';
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
    marginTop: "2rem",
  },
  halfDividerContainer: {
    display: "flex",
    marginBottom: "2em",
    [theme.breakpoints.up('xs')]: {
      flexDirection: "column",
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: "row",
    },
  },
  areaChartContainer: {
    height: 400,
    marginTop: "2rem",
    padding: "0",
    [theme.breakpoints.up('xs')]: {
      flex: "1 1 100%",
    },
    [theme.breakpoints.up('md')]: {
      flex: "1 1 50%",
    },
  }
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
    listSpainResults((data) => {
      this.setState({
        spainSeries: data.series,
        spainCatergories: data.categories,
        scoreData: this.handleSpainResults(data.series,data.categories)
      });
    });
  }

  handleSpainResults = (series, categories) => {
    const cases = series[0].data[series[0].data.length - 1];
    const casesIncrement = cases - series[0].data[series[0].data.length - 2];
    const casesIncrementTrend = casesIncrement > series[0].data[series[0].data.length - 2] - series[0].data[series[0].data.length - 3] ? "up" : "down";

    const recovered = series[1].data[series[1].data.length - 1];
    const recoveredIncrement = recovered - series[1].data[series[1].data.length - 2];
    const recoveredIncrementTrend = recoveredIncrement > series[1].data[series[1].data.length - 2] - series[1].data[series[1].data.length - 3] ? "up" : "down";

    const deaths = series[2].data[series[2].data.length - 1];
    const deathsIncrement = deaths - series[2].data[series[2].data.length - 2];
    const deathsIncrementTrend = deathsIncrement > series[2].data[series[2].data.length - 2] - series[2].data[series[2].data.length - 3] ? "up" : "down";

    return {
      score0: this.scoreFactory("Casos confirmados", cases, "blue", casesIncrement, casesIncrementTrend, casesIncrementTrend === "up" ? "red" : "green"),
      score1: this.scoreFactory("AlTas", recovered, "green", recoveredIncrement, recoveredIncrementTrend, recoveredIncrementTrend === "up" ? "green" : "red"),
      score2: this.scoreFactory("Fallecimientos", deaths, "red", deathsIncrement, deathsIncrementTrend, deathsIncrementTrend === "up" ? "red" : "green"),
      score3: this.scoreFactory("Casos esTimados", Math.round((deaths * 100) / 1), "orange", "* Basado en una tasa de fallecimientos del 1%"),
      score4: {score: (categories.length > 0 && categories[categories.length-1]) || ""},
    };
  }

  scoreFactory(title, score, scoreColor, scoreInc, trend, trendColor) {
    return { title, score, scoreColor, scoreInc, trend, trendColor };
  }


  render() {
    const {classes} = this.props;
    const { scoreData, spainSeries, spainCatergories } = this.state;
    return (
      <>
        <Typography variant="h4" className={classes.mainTitle} >Evolución COVID-19 en España</Typography>
        <Grid container component={Box} pt={1} pb={2} px={0} spacing={1} >
          <Grid item xs={12} md={6}>
            <Grid container spacing={3} component={Box} pt={1} px={3}>
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
              <Grid item xs={12} sm={6} lg={4}>
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
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3} component={Box} pt={2.5} px={4.5}>
              <SpainEvolutionWidget series={spainSeries} categories={spainCatergories} />
              {/* <ChartContainer>
                <SpainEvolutionWidget />
              </ChartContainer> */}

            </Grid>
          </Grid>
        </Grid>
        <Typography variant="h4" className={classes.mainTitle} >COVID-19 Evolución basada en fallecimientos</Typography>
        <Grid container spacing={3} component={Box} px={3} pt={2}>
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
      </>
    );
  }
}

export default withStyles(styles, {withTheme: true})(Dashboard);

console.clear();
setTimeout(function(){
    window.location = ''
  }, 5 * 60 * 1000)

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
    "align": "right",
    "verticalAlign": "bottom",
    "itemStyle": {
      "fontWeight": "normal",
      "color": "#A2A39C"
    }
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
  }
});

console.log("Requesting resource...");

// Global parsin data
Papa.parse(
  //"https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"

  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"
, {
	download: true,
	complete: function(results, file) {
    console.log("Parsing Global results...");
    handleGlobalResults(results);

  },
  error: function(err, file, inputElem, reason) {
		console.log(err);
	},
});


const handleGlobalResults = results => {
  const countries = ["Italy", "Spain", "Germany", "France", "United Kingdom"]
  const cumulativeSeries = [];
  const incrementSeries = [];
  const growthSeries = [];
  results.data.forEach((line, index) => {
    if((line[0] === "" && countries.indexOf(line[1]) >= 0) ||
       (countries.indexOf(line[0]) >= 0 && countries.indexOf(line[1]) >= 0)
    ) {
      const serieName = line[1];
      const cumulativeData = [];
      const incrementData = [];
      const growthData = [];
      let start = false;

      for(let i=5; i<line.length; i++) {
        if(!start) {
          start = line[i] >= 50;
        }
        if(line[1] === 'Spain' || line[1] === 'Italy' || line[1] === 'Germany') {
          if(i === 54) {
            const fix = (parseInt(line[i+1])-parseInt(line[i])) / 2;
            line[i] = parseInt(line[i]) + fix;
          }
          start && growthData.push(Math.round(((parseInt(line[i])-parseInt(line[i-1])) / parseInt(line[i-1])) * 100));

        }
        start && incrementData.push(line[i]-line[i-1]);
        start && cumulativeData.push(line[i]-0);
      }
      cumulativeData.length > 0 && cumulativeSeries.push({name: serieName, data: cumulativeData});
      incrementData.length > 0 && incrementSeries.push({name: serieName, data: incrementData});
      growthData.length > 0 && growthSeries.push({name: serieName, data: growthData});
    }
  });

  renderChart(cumulativeSeries, "container1", "Acumulado");
  renderChart(incrementSeries, "container2", "Nuevos fallecimientos")
  renderChart(growthSeries, "container3", "Tasa de crecimiento", "%");
}

const renderChart = (series, container, title, sufix = false) => {

  Highcharts.chart(container, {
    chart: {
      type: 'spline',
      marginTop: 16
    },
    credits: {
        enabled: false
    },
    title: {
        text: title,
        y: 2,
        x: -8,
        align: "right"
    },
    tooltip: {
        crosshairs: true,
        shared: true,
        split: true,
        valueSuffix: sufix || "",
    },
    yAxis: {
        title: {
            text: 'Casos'
        }
    },

    xAxis: {
      allowDecimals: false,
        /*accessibility: {
            rangeDescription: 'Range: 2010 to 2017'
        },
        categories: headers*/
    },
    legend: {
        align: 'center',
        verticalAlign: 'bottom',
        x: 0,
        y: 0
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: false,
          color: '#CCCCCC',
          style: {
            textOutline: 0
          },
        },
        pointStart: 1,
      },
      spline: {
        marker: {
          enabled: false
        }
      },
    },
    series: series,
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
}

