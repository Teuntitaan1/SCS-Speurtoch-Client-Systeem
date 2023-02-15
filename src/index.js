import React from 'react';
import ReactDOM from 'react-dom/client';
import './StyleSheets/index.css';
import App from './App';
import { browserName, browserVersion } from 'react-device-detect';

const root = ReactDOM.createRoot(document.getElementById('root'));
const debug = false;
console.log(`BrowserName: ${browserName}, BrowserVersion: ${browserVersion}`);



root.render(
  <React.StrictMode>
    <App debugmode={debug}/>
  </React.StrictMode>
);


