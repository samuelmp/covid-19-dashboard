import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
	palette: {
		primary: purple,
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
