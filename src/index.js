import React from 'react';
import ReactDOM from 'react-dom/client';
import './StyleSheets/index.css';
import App from './Components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const debug = true;

root.render(
  <React.StrictMode>
    <App debugmode={debug}/>
    
    {/*Debug reset button, will be removed in production*/}
    {debug === true ?
      <>
      <br/>
      <hr/>
      <button onClick={() => {window.localStorage.setItem("QuizState", "");
		  window.location.reload();}}>Reset</button> 
      </>
      : null
    }
  </React.StrictMode>
);

