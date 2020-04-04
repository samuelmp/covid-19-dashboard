import React from 'react';

import Dashboard from './components/Dashboard.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx'


function App() {
  return (
    <>
      <Header />
      <Dashboard />
      <Footer />
      {/* The core Firebase JS SDK is always required and must be listed first */}
      <script src="/__/firebase/7.13.1/firebase-app.js"></script>

      {/* TODO: Add SDKs for Firebase products that you want to use
        https://firebase.google.com/docs/web/setup#available-libraries */}
      <script src="/__/firebase/7.13.1/firebase-analytics.js"></script>

      {/* Initialize Firebase */}
      <script src="/__/firebase/init.js"></script>
    </>
  );
}

export default App;
