import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './components/CustomHighcharts.js';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
	palette: {
		primary: {main: "#F92672"},
		secondary: green,
		type: 'dark',
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

ReactDOM.render(
  <React.StrictMode>
  	<MuiThemeProvider theme={theme}>
    	<App />
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


// .pace {
//   -webkit-pointer-events: none;
//   pointer-events: none;
//   -webkit-user-select: none;
//   -moz-user-select: none;
//   user-select: none;
// }

// .pace-inactive {
//   display: none;
// }

// .pace .pace-progress {
//   background: #ff0071;
//   position: fixed;
//   z-index: 2000;
//   top: 0;
//   right: 100%;
//   width: 100%;
//   height: 2px;
// }

// .pace .pace-progress-inner {
//   display: block;
//   position: absolute;
//   right: 0px;
//   width: 100px;
//   height: 100%;
//   box-shadow: 0 0 10px #ff0071, 0 0 5px #ff0071;
//   opacity: 1.0;
//   -webkit-transform: rotate(3deg) translate(0px, -4px);
//   -moz-transform: rotate(3deg) translate(0px, -4px);
//   -ms-transform: rotate(3deg) translate(0px, -4px);
//   -o-transform: rotate(3deg) translate(0px, -4px);
//   transform: rotate(3deg) translate(0px, -4px);
// }

// .pace .pace-activity {
//   display: block;
//   position: fixed;
//   z-index: 2000;
//   top: 15px;
//   right: 15px;
//   width: 14px;
//   height: 14px;
//   border: solid 2px transparent;
//   border-top-color: #ff0071;
//   border-left-color: #ff0071;
//   border-radius: 10px;
//   -webkit-animation: pace-spinner 400ms linear infinite;
//   -moz-animation: pace-spinner 400ms linear infinite;
//   -ms-animation: pace-spinner 400ms linear infinite;
//   -o-animation: pace-spinner 400ms linear infinite;
//   animation: pace-spinner 400ms linear infinite;
// }

// @-webkit-keyframes pace-spinner {
//   0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); }
//   100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
// }
// @-moz-keyframes pace-spinner {
//   0% { -moz-transform: rotate(0deg); transform: rotate(0deg); }
//   100% { -moz-transform: rotate(360deg); transform: rotate(360deg); }
// }
// @-o-keyframes pace-spinner {
//   0% { -o-transform: rotate(0deg); transform: rotate(0deg); }
//   100% { -o-transform: rotate(360deg); transform: rotate(360deg); }
// }
// @-ms-keyframes pace-spinner {
//   0% { -ms-transform: rotate(0deg); transform: rotate(0deg); }
//   100% { -ms-transform: rotate(360deg); transform: rotate(360deg); }
// }
// @keyframes pace-spinner {
//   0% { transform: rotate(0deg); transform: rotate(0deg); }
//   100% { transform: rotate(360deg); transform: rotate(360deg); }
// }

