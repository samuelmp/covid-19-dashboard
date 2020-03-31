import React, { Component } from 'react';
import { Box } from '@material-ui/core';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: "inline-flex",
    backgroundColor: "rgba(255,255,255,.025)",
    padding: "2rem 1rem",
    borderRadius: ".5rem",
    width: "calc(100% - 2rem)",
    height: "calc(100% - 2rem)",
  },
});

class WidgetContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {classes, className, id, ...other} = this.props;
    return (
      <Box className={clsx(classes.root, className)} id={id} {...other} />
    );
  }
}
export default withStyles(styles, {withTheme: true})(WidgetContainer);
