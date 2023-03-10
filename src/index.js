import React from 'react';
import ReactDOM from 'react-dom/client';
import './Local_Files/StyleSheets/index.css';
import App from './Local_Files/Components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const debug = false;




root.render(
  <React.StrictMode>
    <App debugmode={debug}/>
  </React.StrictMode>
);


