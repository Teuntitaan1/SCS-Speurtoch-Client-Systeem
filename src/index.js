import React from 'react';
import ReactDOM from 'react-dom/client';
import './StyleSheets/index.css';
import App from './App';
import { isSafari } from 'react-device-detect';

const root = ReactDOM.createRoot(document.getElementById('root'));
const debug = true;
const legacymode = isSafari === true ? true : true;



root.render(
  <React.StrictMode>
    <App debugmode={debug} legacymode={legacymode}/>
  </React.StrictMode>
);


