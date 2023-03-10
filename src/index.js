import React from 'react';
import ReactDOM from 'react-dom/client';
import './Local_Files/StyleSheets/index.css';
import App from './Local_Files/Components/App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App debugmode={true}/>
  </React.StrictMode>
);


