import React from 'react';
import ReactDOM from 'react-dom/client';
import './StyleSheets/index.css';
import App from './Components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const debug = true;

root.render(
  <React.StrictMode>
    <App debugmode={debug} serverip={"http://localhost:8000"}/>
    
    {/*Debug reset button, will be removed in production*/}
    {debug === true ?
      <>
      <br/>
      <hr/>
      <h3>Debug bedieningspaneel</h3>
      <button onClick={() => {window.localStorage.setItem("QuizState", "");
		  window.location.reload();}}>Reset</button> 
      </>
      : null
    }
  </React.StrictMode>
);

