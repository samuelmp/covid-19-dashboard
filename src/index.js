
import React from 'react';
import ReactDOM from 'react-dom';
// import 'pace-js/pace.js'
// import 'pace-js/themes/yellow/pace-theme-minimal.css'
import './index.css';
import './js/customHighcharts.js';
import './js/utils.js';
import App from './App';




import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import green from '@material-ui/core/colors/green';


const theme = createMuiTheme({
	palette: {
		primary: {main: "#F92672"},
		secondary: green,
    type: 'dark',
    background: {default: "#06121a", paper: "#18242a"}
	},
	status: {
		danger: 'orange',
	},
	typography: {
		fontFamily: [
		'Unica One',
		'-apple-system',
		'BlinkMacSystemFont',
		'"Segoe UI"',
		'Roboto',
		'"Helvetica Neue"',
		'Arial',
		'sans-serif',
		'"Apple Color Emoji"',
		'"Segoe UI Emoji"',
		'"Segoe UI Symbol"',
		].join(','),
	},
});

console.clear();
console.log(theme);
setTimeout(function() {
  window.location = ''
}, 60 * 60 * 1000);

ReactDOM.render(
  <React.StrictMode>
  	<MuiThemeProvider theme={theme}>
    	<App />
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
