import React from 'react';
import ReactDOM from 'react-dom/client';
import './Local_Files/StyleSheets/index.css';
import App from './Local_Files/Components/App';

const localhost = "http://localhost:8000"; 
const externalhost = "https://leaderboard-server.onrender.com:8000";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App debugmode={true} leaderboardip={externalhost}/>
  </React.StrictMode>
);


