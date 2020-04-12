import React, {Component} from 'react';

import { Typography, Grid, Box, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { withStyles } from '@material-ui/core/styles';

import Score from './Score.jsx';

import { requestData } from '../services/dataService';

import CountryEvolutionWidget from './CountryEvolutionWidget.jsx';
import HighchartsWidget from './HighchartsWidget.jsx';
import CountryEvolutionAcumWidget from './CountryEvolutionAcumWidget.jsx';

import { es as esLocale } from 'date-fns/locale/';
import { format, isYesterday, isToday } from 'date-fns'

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
  countrySelector: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: "transparent",
      backgroundColor: "rgba(255,255,255, .05)"
    },
    '& .MuiInputBase-input': {
      color: "#A2A39C",
      fontSize: "133%"
    }
  }
});


class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      countriesData: {},
      selectedCountryId: localStorage.getItem(`dashboard.selectedCountryId`) || "Spain"
    };
  }

  componentDidMount = () => {
    requestData((data, countriesData) => {
      this.setState({
        countriesData: countriesData
      });
    });
  }

  handleChangeCountry = (event, value) => {
    if(value) {
      localStorage.setItem(`dashboard.selectedCountryId`, value);
      this.setState({selectedCountryId: value});
    }
  }

  render() {
    const {classes} = this.props;
    const { countriesData, selectedCountryId } = this.state;
    const countryData = countriesData[selectedCountryId] || false;
    let updateString = "";
    if(countryData) {
      const udateDate = countryData.updateDate;
      const dayText = (isToday(udateDate) && "Hoy") || (isYesterday(udateDate) && "Ayer") || format(udateDate, "EEEE", {locale: esLocale});
      updateString = format(udateDate, `'${dayText}', dd MMMM 'a las' H:mm`, {
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
          <Grid item xs style={{display: "inline-flex", justifyContent: "center", alignItems: "center"}}>
            <Typography variant="h4" className={classes.mainTitle} >Evolución COVID-19 en </Typography>
            <Autocomplete
              id="combo-box-countries"
              options={Object.keys(countriesData).sort()}
              value={selectedCountryId}
              onChange={this.handleChangeCountry}
              style={{ width: 200 }}
              className={classes.countrySelector}
              size="small"
              disableClearable
              renderInput={(params) => <TextField {...params} variant="outlined" />}
            />
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>

        <Grid container component={Box} spacing={3} pt={1} mb={1} >
          <Grid item xs={12} lg={4} style={{paddingRight: "1.5rem"}}>
            <Grid container spacing={3} component={Box} height="calc(100% + 24px)">
              <Grid item xs={6} sm={6} lg={6}>
                <Score title="PosiTivos" color="blue" data={countryData.confirmed} />
              </Grid>
              <Grid item xs={6} sm={6} lg={6}>
                <Score title="AlTas" color="green" reverseTrend data={countryData.recovered} />
              </Grid>
              <Grid item xs={6} sm={6} lg={6}>
                <Score title="Fallecidos" color="red" data={countryData.deaths} />
              </Grid>
              <Grid item xs={6} sm={6} lg={6}>
                <Score title="Casos esTimados" color="orange"
                  trendText = "* Basado en una tasa de fallecimienTos del 1%"
                  data={countryData.deaths ? {...countryData.deaths, score: countryData.deaths.score * 100} : undefined}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} lg={4} component={Box} pr={0}>
            <Grid container spacing={0} component={Box} pr={0}>
              <CountryEvolutionWidget data={countryData} countryId={selectedCountryId} />
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} lg={4} component={Box} pr={0}>
            <Grid container spacing={0} component={Box} pr={0}>
              <CountryEvolutionAcumWidget data={countryData} countryId={selectedCountryId} />
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
          <Grid item xs={12} md={6} lg={4} style={{marginBottom: 24}}>
            <HighchartsWidget data={countriesData} type="acum" title="FallecimienTos acumulados" />
          </Grid>
          <Grid item xs={12} md={6} lg={4} style={{marginBottom: 24}}>
            <HighchartsWidget data={countriesData} type="abs" title="FallecimienTos diarios" />
          </Grid>
          <Grid item xs={12} md={6} lg={4} style={{marginBottom: 24}}>
            <HighchartsWidget data={countriesData} type="growth" title="Tasa de crecimiento" sufix="%" />
          </Grid>
        </Grid>
      </Box>
    );
  }
}



export default withStyles(styles, {withTheme: true})(Dashboard);
