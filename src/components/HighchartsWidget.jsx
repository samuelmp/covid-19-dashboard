import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import WidgetContainer from './WidgetContainer.jsx';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Switch, FormControlLabel, Grid, Typography } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import { t } from '../js/I18n';

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
  },
  switch: {
    // position: "absolute",
    // top: theme.spacing(1.5),
    // left: theme.spacing(0),
    // zIndex: 1,


  },
  toggle: {
    backgroundColor: "transparent",
    '& .MuiButtonBase-root': {
      borderColor: "transparent",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      '&:hover': {
        borderColor: "rgba(255, 255, 255, 0.15)",
      }
    },
    '& .MuiToggleButton-root': {
      height: theme.spacing(3)
    },
    '& .Mui-selected': {
      color: "rgba(255, 255, 255, 0.5)",
      borderColor: "transparent",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      '&:hover': {
        borderColor: "rgba(255, 255, 255, 0.15)",
      }
    }
  }

}));

const getHighchartsOptions = (title, series, sufix, initialScale) => {
  return {
    chart: {
      type: 'spline',
      marginTop: 20,
      //marginBottom: 50,
    },
    "colors": ["#6dbad6", "#A6E22E", "#e74c3c", "#F92672", "#003f5c", "#665191","#ffa600", "#1863fd", "#d45087", "#2f4b7c"],
    //"colors": ["#006386", "#007b9f", "#0094b6", "#00c9df", "#00e4f0", "#00ffff"],
    //colors: ["#488f31", "#8eb15b", "#c9d38d", "#f6c385", "#ef8860", "#de425b"],
    //colors: ["#003f5c", "#444e86", "#955196", "#dd5182", "#ff6e54", "#ffa600"],

        title: {
        text: title,
        y: 2,
        x: -8,
        align: "right"
    },
    subtitle: {
      text: t("Media de los últimos 7 días"),
      align: "right",
      x: -10,
      y: 24
    },
    tooltip: {
        valueSuffix: sufix || "",
    },
    yAxis: {
      type: initialScale,
      title: {
          text: t('Fallecidos'),
          disabled: true
      }
    },

    xAxis: {
      allowDecimals: false,
      tickmarkPlacement: 'on',
    },

    // caption: {
    //   text: 'An advanced demo showing a combination of various Highcharts features, including flags and plot bands. The chart shows how Highcharts and Highsoft has evolved over time, with number of employees, revenue, search popularity, office locations, and various events of interest.'
    // },

  };
};

const buildSeriesData = (countriesData, isAvgData, type, isInitial = false) => {

  const series = [];
  const serieType = type + (isAvgData ? "_avg" : "");
  const countries = ["Italy", "Spain", "Germany", "France", "United Kingdom", "China", "US"];
  for (const countryId in countriesData) {
    if(countries.indexOf(countryId) >= 0) {
      const isSerieVisible = countryId !== "China";
      const beginSeries = countriesData[countryId].beginIndex;
      const serie = {name: countryId, data: countriesData[countryId].deaths[serieType].slice(beginSeries).map(item => item[1])};
      if(isInitial) serie["visible"] = isSerieVisible;
      series.push(serie);
    }
  }
  return series;
};



const HighchartsWidget = ({ data, type, title, sufix = "" }) => {
  const classes = useStyles();
  const chartRef = React.useRef();


  const handleTypeChange = (event) => {
    localStorage.setItem(`globalCountriesEvolution.${type}.isAvgData`, event.target.checked);
    chartRef && chartRef.current && chartRef.current.update({
      series: buildSeriesData(data, event.target.checked, type),
      subtitle:{text: getChartTitle(event.target.checked)}
    }, true, true);
  };

  const handleScaleChange = (event, newScale) => {
    localStorage.setItem(`globalCountriesEvolution.${type}.scale`, newScale);
    chartRef && chartRef.current && chartRef.current.update({
      yAxis: {type: newScale}
    }, true, true);
  };



  const afterChartCreated = (chart) => {
    chartRef.current = chart;
  };

  const getChartTitle = isAvgData => ` ${isAvgData ? t("Media de los 7 últimos días") : ""}`;
  const typeKey = `globalCountriesEvolution.${type}.isAvgData`;
  const isAvgData = localStorage.getItem(typeKey) ? (localStorage.getItem(typeKey) === "true") : true;
  const scaleKey = `globalCountriesEvolution.${type}.scale`;
  const initialScale = localStorage.getItem(scaleKey) ? (localStorage.getItem(scaleKey)) : "linear";

  const options = getHighchartsOptions(data, type, sufix, initialScale);
  options.series = (data && buildSeriesData(data, isAvgData, type, true)) || [];
  options.title.text = title;
  options.subtitle.text = getChartTitle(isAvgData);

  return (<>
    <WidgetContainer className={classes.root}>
      <Grid container direction="column" wrap="nowrap">
        <Grid item xs>
          <HighchartsReact highcharts={Highcharts} options={options} callback={ afterChartCreated } containerProps = {{ style: {width: "100%", height: 300} }} />
        </Grid>
        <Grid item>
          <Grid container>
            <Grid item xs style={{display: "flex"}}>
              <TypeSwitch onChange={handleTypeChange} initialChecked={isAvgData} />
            </Grid>
            <Grid item xs style={{display: "inline-flex", justifyContent: "flex-end", alignItems: "center", paddingRight: 8}}>
              <Typography variant="caption" style={{marginRight: 8}} color="textSecondary" >{t("Tipo de escala")}</Typography>
              <ScaleSwitch onChange={handleScaleChange} initialScale={initialScale} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </WidgetContainer>
  </>);
};

export default HighchartsWidget;


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
  className={classes.switch} labelPlacement="start" label={t("Normalizar")} />
  );

}

const ScaleSwitch = ({ onChange, initialScale }) => {

  const classes = useStyles();
  const [scale, setScale] = React.useState(initialScale);
  const handleChange = (event, newScale) => {
    if (newScale !== null) {
      setScale(newScale);
      onChange && onChange(event, newScale);
    }
  };
  return(
    <ToggleButtonGroup value={scale} onChange={handleChange} className={classes.toggle} exclusive variant="outlined">
      <ToggleButton value="logarithmic" aria-label="log" size="small">{t("Logarítmica")}</ToggleButton>
      <ToggleButton value="linear" aria-label="line" size="small">{t("Lineal")}</ToggleButton>
    </ToggleButtonGroup>
  );

}
