import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard.jsx';

function App() {
  return (
	<>
		<Dashboard />
		<div class="widgetsContainer">
			<div id="container1" class="higchartsWidget"></div>
			<div id="container2" class="higchartsWidget"></div>
			<div id="container3" class="higchartsWidget"></div>
		</div>
	</>
  );
}

export default App;
