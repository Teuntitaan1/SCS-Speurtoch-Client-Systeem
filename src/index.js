import React from 'react';
import ReactDOM from 'react-dom/client';
import './StyleSheets/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const debug = false;

root.render(
  <React.StrictMode>
    <App debugmode={debug}/>
  </React.StrictMode>
);

