import React from 'react';
import ReactDOM from 'react-dom/client';
import './Local_Files/StyleSheets/index.css';
import App from './Local_Files/Components/App';

const host = "https://leaderboard-server.onrender.com";

try {
  screen.orientation.lock("portrait");
} catch (error) {
  console.log(error);
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App debugmode={true} leaderboardip={host}/>
  </React.StrictMode>
);


