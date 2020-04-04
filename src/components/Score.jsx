import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUpRounded';
import TrendingDownRoundedIcon from '@material-ui/icons/TrendingDownRounded';
import WidgetContainer from './WidgetContainer.jsx';


const _styles = require("@material-ui/core/styles");



const scoreColors = {
  red: "rgba(231, 76, 60, .9)",
  green: "rgba(166, 226, 46, .9)",
  blue: "rgba(102, 207, 239, .9)",
  orange: "#f39c12",
  grey: "#5e83a8"
}
const styles = theme => ({
  scoreWidget: {
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    height: "calc(100% - 2rem)",
    position: "relative",
    "& .peity": {
      position: "absolute",
      bottom: 0,
      borderRadius: 5
    },
    //minHeight: 110

  },

  title: {
    fontSize: "1.8rem",
  },
  score: {
    fontSize: "3.5rem",
  },

  scoreInc: {
    fontSize: "1.5rem",
    textAlign: "center",
    display: "inline-flex",
    alignItems: "center",

    '& i' : {
      marginLeft: ".6rem"
    },
    '&.text': {
        fontSize: "1rem",
        textAlign: "center"
    }
  },
  scoreIncText: {
    fontSize: "1rem",
    textAlign: "center",
    marginTop: "1rem"
  },
  scoreDifference: {
    fontSize: "1.2rem",
    display: "inline-flex",
    marginLeft: theme.spacing(1),
    opacity: .8,
    marginTop: theme.spacing(.5)
  },
  trendRed: {
    color: "rgba(231, 76, 60, .9)",
    marginLeft: theme.spacing(1)
  },

  trendGreen: {
    color: "rgba(166, 226, 46, .9)",
    marginLeft: theme.spacing(1)
  },


});

 class Score extends Component {

  constructor(props) {
    super(props)

    this.state = {}

    this.myRef = React.createRef();
  }
  transformDataResults = (serie) => {
    //const score = serie.data[serie.data.length - 1];

    let score = 0;
    let scoreIncrement = 0;
    let scoreTrend = 0;
    let peityList = false;
    //serie.data.forEach(e => score += e);

    if(serie.data && serie.data.length > 0) {
      for (let i = 0; i < serie.data.length; i++) {
        const e = serie.data[i];
        score += e;
        if(serie.data.length >= 1 && (serie.data.length - 1) === i) {
          scoreIncrement = serie.data[i];
          scoreTrend = scoreIncrement - serie.data[i - 1];
        }
      }


      const SLICE_MAX = 20;
      const sliceCount = serie.data.length >= SLICE_MAX ? SLICE_MAX : serie.data.length;
      peityList = serie.data.slice(-sliceCount);
    }
    //const scoreIncrement = score - serie.data[serie.data.length - 2];
    //const scoreTrend = scoreIncrement > serie.data[serie.data.length - 2] - serie.data[serie.data.length - 3] ? "up" : "down";
    this.setState({
      score: score,
      scoreIncrement:scoreIncrement,
      scoreTrend: scoreTrend,
      peityList: peityList
    });
  }


  componentDidUpdate(prevProps) {

    const {color, serie} = this.props;
    window.$(this.peityEl).peity("line", {
      stroke: _styles.fade(scoreColors[color || "grey"], .175),
      fill: _styles.fade(scoreColors[color || "grey"], .075),
      width: "100%",
      height: "90%",
    });
    if(!Object.equals(prevProps.serie, serie)) {
      this.transformDataResults(serie)
    }

  }

  render() {
    const { classes, title, color, trendText = false, reverseTrend = false } = this.props;
    const { score, scoreIncrement, scoreTrend, peityList } = this.state;
    const scoreColorCode = scoreColors[color || "green"] ;

    const trendColor = (reverseTrend && scoreTrend < 0) || scoreTrend > 0 ? "red" : "green"

    const trendColorClass = trendColor === "red" ? classes.trendRed : classes.trendGreen;
    return (
      <WidgetContainer className={classes.scoreWidget} >
        {title && <div className={classes.title}>{title}</div>}
        {score && <div className={classes.score} style={{color: scoreColorCode}}>
          {score.toLocaleString("it-IT")}
        </div>
        }

        <div className={classes.scoreInc}>
          {trendText ? <Typography  className={classes.scoreIncText}>{trendText}</Typography> : scoreIncrement}
          {scoreTrend && !trendText && (
              (scoreTrend > 0 && <TrendingUpRoundedIcon className={trendColorClass} />) ||
              (scoreTrend < 0 && <TrendingDownRoundedIcon className={trendColorClass} />) ||
              ""
          )}
          {!trendText && <Typography className={classes.scoreDifference}>{(scoreTrend > 0 ? "+" : "") + scoreTrend}</Typography>}

        </div>
        {peityList && <span ref={el => this.peityEl = el} className="line" style={{display: "none"}}> {peityList.join(",")}</span>}
      </WidgetContainer>
    )
  }
}

export default withStyles(styles, {withTheme: true})(Score);

Score.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  score: PropTypes.number,
  scoreColor: PropTypes.oneOf(['blue', 'green', 'red', 'orange']),
  scoreInc: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.number
  ]),
  trend: PropTypes.oneOf(['up', 'down']),
  trendColor: PropTypes.oneOf(['red', 'green'])
};
