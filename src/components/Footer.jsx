import React, { Component } from 'react';
import GitHubIcon from '@material-ui/icons/GitHub';
import { Typography, Grid, Box, Link, IconButton } from '@material-ui/core';


export default class Footer extends Component {
  render() {
    return (
      <Grid container spacing={3} component={Box} pt={2} pb={0} px={6} my={4} >
        <Grid item xs>
          <Grid container spacing={2} direction="column" component={Box} pb={2} >
            <Grid item component={Box} display="flex" xs={12} md={3} pb={1.5} style={{alignItems: "center"}}>
              <Typography variant="h5">
                FuenTes de daTos
              </Typography>
            </Grid>
            <Grid item>
              <Link href="https://github.com/datadista/datasets" rel="noopener noreferrer" target="_blank">
                DaTa from Spain of COVID-19 (by DaTadisTa)
              </Link>
            </Grid>
            <Grid item>
              <Link href="https://github.com/CSSEGISandData/COVID-19" rel="noopener noreferrer" target="_blank">
                DaTa ReposiTory by Johns Hopkins CSSE
              </Link>
            </Grid>
          </Grid>
        </Grid>
        <Grid item style={{display: "flex", alignItems: "flex-end", justifyContent: "flex-end"}}>
          <Box display="flex" alignItems="center">
            <Box py={2}>Fork me on GitHub</Box>
            <IconButton edge="end" disableRipple color="primary" aria-label="menu" rel="noopener noreferrer" href="https://github.com/samuelmp/covid-19-dashboard" target="_blank" title="Fork me on GitHub">
              <GitHubIcon />
            </IconButton>
          </Box>

        </Grid>
      </Grid>
    )
  }
}
