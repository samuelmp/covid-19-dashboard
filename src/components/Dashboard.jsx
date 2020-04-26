import React, {Component} from 'react';

import { Typography, Grid, Box, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { withStyles } from '@material-ui/core/styles';

import Score from './Score.jsx';

import { requestData } from '../services/dataService';

import CountryEvolutionWidget from './CountryEvolutionWidget.jsx';
import HighchartsWidget from './HighchartsWidget.jsx';
import CountryEvolutionAcumWidget from './CountryEvolutionAcumWidget.jsx';

import { es as esLocale, enUS as enLocale } from 'date-fns/locale/';
import { format, isYesterday, isToday } from 'date-fns';

import { t, isLanguage, getCountryCode } from '../js/I18n';

const styles = theme => ({
  root: {
    // width: '100%',
    padding: "0 2rem",
    paddingBottom: "1rem",
    paddingRight: "1.5rem",
    flex: "1 1 auto"
  },
  headerContainer: {
    paddingTop: theme.spacing(1),
    flexWrap: "nowrap"
  },
  titleContainer: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap"
  },
  mainTitle: {
    fontSize: "1.9rem",
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
      fontSize: "166%"
    },
    '& .MuiAutocomplete-endAdornment': {
      top: "calc(50% - 1rem)"
    },
  },
  countrySelectorList: {
    fontSize: "18px",
    listStyle: "none",
    margin: 0,
    padding: theme.spacing(.5, 0),
    overflow: "auto",
    maxHeight: "40vh",
    '& .MuiAutocomplete-groupLabel': {
      fontSize: "14px",
    }
  },
  loadingWrapper: {
    position: "absolute",
    top:0, bottom: 0, left: 0, right: 0,
    width: "100%",
    display: "flex",
    paddingTop: "33vh"
  },
  loadingText: {
    marginLeft: theme.spacing(-1.5),
    opacity: .6,
    marginBottom: theme.spacing(2.5),
    fontSize: 26
  }
});

const countryResolver = {
  "IT": "Italy",
  "ES": "Spain",
  "DE": "Germany",
  "FR": "Frence",
  "GB": "United Kingdom",
  "US": "US",
  "AR": "Argentina"
}

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.recomendedCountries = ["Italy", "Spain", "Germany", "France", "United Kingdom", "China", "US"];
    const countryByLang = countryResolver[getCountryCode()];
    const countryName = localStorage.getItem(`dashboard.selectedCountryId`) || countryByLang || "Spain";
    const firstLetter = this.recomendedCountries.indexOf(countryName) >=0 ? "*" : countryName[0].toUpperCase();
    this.state = {
      countriesData: {},
      selectedCountryId: {
        firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
        title: countryName,
      },
      countriesList: [],
      isLoading: true
    };

  }

  componentDidMount = () => {
    requestData((countriesData) => {
      this.setState({
        countriesData: countriesData,
        countriesList: this.getCountriesList(countriesData),
        isLoading: false
      });
    });
  }

  getCountriesList = (countriesData) => {

    const recomendedText = "*";

    const allCountriesObj = Object.keys(countriesData).map((option) => {
      const groupText = this.recomendedCountries.indexOf(option) >= 0 ? recomendedText : option[0].toUpperCase();
      return {
        firstLetter: groupText, title: option,
      };
    });
    const recomendedCountriesObj = allCountriesObj.filter(country => country.title && this.recomendedCountries.indexOf(country.title) >=0);
    const otherCountriesObj = allCountriesObj.filter(country => country.title && this.recomendedCountries.indexOf(country.title) < 0);
    recomendedCountriesObj.sort((a,b) => a.title.localeCompare(b.title))
    otherCountriesObj.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))

    return recomendedCountriesObj.concat(otherCountriesObj);
  }

  handleChangeCountry = (event, value) => {
    if(value) {
      localStorage.setItem(`dashboard.selectedCountryId`, value.title);
      this.setState({selectedCountryId: value});
    }
  }

  render() {
    const {classes} = this.props;
    const { countriesData, selectedCountryId, countriesList, isLoading } = this.state;
    const countryData = countriesData[selectedCountryId.title] || false;
    let updateString = "";
    if(countryData) {
      const udateDate = countryData.updateDate;
      const dayText = (isToday(udateDate) && t("Hoy")) || (isYesterday(udateDate) && t("Ayer")) || format(udateDate, "EEEE", {locale: isLanguage("es") ? esLocale : enLocale});
      updateString = format(udateDate, `'${dayText}', dd MMMM '${t("a las")}' H:mm`, {
        locale: isLanguage("es") ? esLocale : enLocale
      });
    }


    return (

      <Box className={classes.root}>
        { isLoading ?
          <Box className={classes.loadingWrapper}>
            <div className="sk-folding-cube">
              <Box className={classes.loadingText}>{t('CARGANDO')}</Box>
              <div className="sk-cube1 sk-cube"></div>
              <div className="sk-cube2 sk-cube"></div>
              <div className="sk-cube4 sk-cube"></div>
              <div className="sk-cube3 sk-cube"></div>
              {/* <Box mt={9}>DATA...</Box> */}
            </div>
          </Box>
          :
          <>
            <Grid container spacing={3} className={classes.headerContainer} >
              <Grid item xs={3}>
                <Grid container spacing={0} direction="column" style={{paddingTop: "1.2rem"}} >
                  <Grid item><Typography variant="body1" >{t("ACTUALIZADO: ")}</Typography></Grid>
                  <Grid item><Typography variant="body1" color="primary" >{updateString.toUpperCase()}</Typography></Grid>
                </Grid>
              </Grid>
              <Grid item xs className={classes.titleContainer}>
                <Typography variant="h4" className={classes.mainTitle} >{t("Evolución COVID-19 en ")}</Typography>
                <Autocomplete
                  id="combo-box-countries"
                  options={countriesList || []}
                  getOptionLabel={(option) => (option && option.title) || ""}
                  value={countriesList && countriesList.length > 0 && Object.keys(countriesList).length > 0 && selectedCountryId}
                  onChange={this.handleChangeCountry}
                  style={{ width: 200 }}
                  className={classes.countrySelector}
                  size="small"
                  groupBy={(option) => option.firstLetter}
                  disableClearable
                  blurOnSelect
                  ListboxProps={{className: classes.countrySelectorList}}
                  renderInput={(params) => <TextField {...params} variant="outlined" />}
                  getOptionSelected={(a,b) => a.firstLetter === b.firstLetter && a.title === b.title}
                />
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>

            <Grid container component={Box} spacing={3} pt={1} mb={1} >
              <Grid item xs={12} lg={4} style={{paddingRight: "1.5rem"}}>
                <Grid container spacing={3} component={Box} height="calc(100% + 24px)">
                  <Grid item xs={6} sm={6} lg={6}>
                    <Score title={t("PosiTivos")} color="blue" data={countryData.confirmed} />
                  </Grid>
                  <Grid item xs={6} sm={6} lg={6}>
                    <Score title={t("AlTas")} color="green" reverseTrend data={countryData.recovered} />
                  </Grid>
                  <Grid item xs={6} sm={6} lg={6}>
                    <Score title={t("Fallecidos")} color="red" data={countryData.deaths} />
                  </Grid>
                  <Grid item xs={6} sm={6} lg={6}>
                    <Score title={t("Casos esTimados")} color="orange"
                      trendText ={t("* Basado en una tasa de fallecimienTos del 1%")}
                      data={countryData.deaths ? {...countryData.deaths, score: countryData.deaths.score * 100} : undefined}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6} lg={4} component={Box} pr={0}>
                <Grid container spacing={0} component={Box} pr={0}>
                  <CountryEvolutionWidget data={countryData} countryId={selectedCountryId.title} />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6} lg={4} component={Box} pr={0}>
                <Grid container spacing={0} component={Box} pr={0}>
                  <CountryEvolutionAcumWidget data={countryData} countryId={selectedCountryId.title} />
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={3} component={Box} pt={1} >
              <Grid item xs>
                <Typography variant="h4" className={classes.mainTitle} >{t("COVID-19 Evolución global basada en fallecimienTos")}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={3} component={Box} pt={1} pr={0} >
              <Grid item xs={12} md={6} lg={4} style={{marginBottom: 24}}>
                <HighchartsWidget data={countriesData} type="acum" title={t("FallecimienTos acumulados")} />
              </Grid>
              <Grid item xs={12} md={6} lg={4} style={{marginBottom: 24}}>
                <HighchartsWidget data={countriesData} type="abs" title={t("FallecimienTos diarios")} />
              </Grid>
              <Grid item xs={12} md={6} lg={4} style={{marginBottom: 24}}>
                <HighchartsWidget data={countriesData} type="growth" title={t("Tasa de crecimiento")} sufix="%" />
              </Grid>
            </Grid>
          </>
        }
      </Box>
    );
  }
}



export default withStyles(styles, {withTheme: true})(Dashboard);
