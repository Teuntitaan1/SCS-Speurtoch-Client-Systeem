import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Local_Files/Components/App';

const host = "https://leaderboard-server.onrender.com";



ReactDOM.createRoot(document.getElementById('root')).render(<App debugmode={false} leaderboardip={host}/>);


