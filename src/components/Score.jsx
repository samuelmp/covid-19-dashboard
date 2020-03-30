import React from 'react';
import PropTypes from 'prop-types';

import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUpRounded';
import TrendingDownRoundedIcon from '@material-ui/icons/TrendingDownRounded';
import WidgetContainer from './WidgetContainer.jsx';

const scoreColors = {
  red: "rgba(231, 76, 60, .9)",
  green: "rgba(166, 226, 46, .9)",
  blue: "rgba(102, 207, 239, .9)",
  orange: "#f39c12"
}

const useStyles = makeStyles(theme => ({
  scoreWidget: {
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    height: "calc(100% - 2rem)",
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
  trendRed: {
    color: "rgba(231, 76, 60, .9)",
    marginLeft: theme.spacing(1)
  },

  trendGreen: {
    color: "rgba(166, 226, 46, .9)",
    marginLeft: theme.spacing(1)
  }

}));

const Score = ({ title, score, scoreColor, scoreInc, trend, trendColor }) => {
  const classes = useStyles();

  const scoreColorCode = scoreColors[scoreColor || "green"] ;

  const trendColorClass = trendColor ? (trendColor === "red" ? classes.trendRed : classes.trendGreen ) : "";


  return (
  <WidgetContainer className={classes.scoreWidget}>
    {title && <div className={classes.title}>{title}</div>}
    {score && <div className={classes.score} style={{color: scoreColorCode}}>
      {score.toLocaleString("it-IT")}
    </div>
    }
    <div className={classes.scoreInc}>
      {( typeof scoreInc === "number") ? scoreInc : <Typography  className={classes.scoreIncText}>{scoreInc}</Typography>}
      {trend && (
          (trend === "up" && <TrendingUpRoundedIcon className={trendColorClass} />) ||
          (trend === "down" && <TrendingDownRoundedIcon className={trendColorClass} />) ||
          ""
      )}
    </div>
  </WidgetContainer>
  );
};

export default Score;

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
