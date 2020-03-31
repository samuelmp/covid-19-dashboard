import React, { Component } from 'react';
import GitHubIcon from '@material-ui/icons/GitHub';
import { Box, IconButton } from '@material-ui/core';


export default class Header extends Component {
  render() {
    return (
      <Box position="fixed" top={8} right={8} >
        <IconButton edge="start" disableRipple color="primary" aria-label="menu" rel="noopener noreferrer" href="https://github.com/samuelmp/covid-19-dashboard" target="_blank" title="Fork me on GitHub">
          <GitHubIcon />
        </IconButton>
      </Box>
    )
  }
}
