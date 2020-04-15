import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Highcharts from 'highcharts';
import { Typography } from '@material-ui/core';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUpRounded';
import TrendingDownRoundedIcon from '@material-ui/icons/TrendingDownRounded';
import WidgetContainer from './WidgetContainer.jsx';

const _styles = require("@material-ui/core/styles");

const scoreColors = {
  red:    Highcharts.getOptions().colors[2],
  green:  Highcharts.getOptions().colors[1],
  blue:   Highcharts.getOptions().colors[0],
  orange: Highcharts.getOptions().colors[3],
  grey:   "#5e83a8"
}

const styles = theme => ({
  scoreWidget: {
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    height: "calc(100% - 2rem)",
    position: "relative",
    justifyContent: "flex-start",
    "& .peity": {
      position: "absolute",
      bottom: 0,
      borderRadius: 5,
      left: 0,
    },
    //minHeight: 110

  },

  title: {
    fontSize: "1.8rem",
  },
  score: {
    fontSize: "3.3rem",
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

  transformDataResults = ({abs_avg: abs}) => {
    let peityList = false;

    if(abs && abs.length > 0) {
      const SLICE_MAX = 20;
      const sliceCount = abs.length >= SLICE_MAX ? SLICE_MAX : abs.length;
      peityList = abs.slice(-sliceCount).map(item => item[1]);
    }

    this.setState({
      peityList: peityList
    });
  }


  componentDidUpdate(prevProps) {
    const {color} = this.props;
    window.$(this.peityEl).peity("line", {
      stroke: _styles.fade(scoreColors[color || "grey"], .175),
      fill: _styles.fade(scoreColors[color || "grey"], .075),
      width: "100%",
      height: "90%",
    });
  }

  componentDidMount() {
    const {data} = this.props;
    this.transformDataResults(data)
  }

  render() {
    const { classes, title, color, trendText = false, reverseTrend = false, data } = this.props;
    const { peityList } = this.state;
    const scoreColorCode = scoreColors[color || "green"] ;

    if(data) {
      const {score, scoreInc, scoreTrend } = data;

      // const trendColor = (reverseTrend && scoreTrend < 0) || scoreTrend > 0 ? "red" : "green";
      const trendColor = reverseTrend ? (scoreTrend < 0 ? "red" : "green") : (scoreTrend > 0 ? "red" : "green");

      const trendColorClass = trendColor === "red" ? classes.trendRed : classes.trendGreen;
      return (
        <WidgetContainer className={classes.scoreWidget} >
          {title && <div className={classes.title}>{title}</div>}
          {score && <div className={classes.score} style={{color: scoreColorCode}}>
            {score.toLocaleString("it-IT")}
          </div>
          }

          <div className={classes.scoreInc}>
            {trendText ? <Typography  className={classes.scoreIncText}>{trendText}</Typography> : scoreInc}
            {scoreTrend && !trendText && (
                (scoreTrend > 0 && <TrendingUpRoundedIcon className={trendColorClass} />) ||
                (scoreTrend < 0 && <TrendingDownRoundedIcon className={trendColorClass} />) ||
                ""
            )}
            {!trendText && <Typography className={classes.scoreDifference}>{(scoreTrend > 0 ? "+" : "") + scoreTrend}</Typography>}

          </div>
          {peityList && <span ref={el => this.peityEl = el} className="line" style={{display: "none"}}> {peityList.join(",")}</span>}
        </WidgetContainer>
      );
    } else {
      return <WidgetContainer className={classes.scoreWidget} ></WidgetContainer>;
    }
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
