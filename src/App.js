import './App.css';

function App() {
  
  
  return (
    <>
    <h1>Test</h1>
    <QuestionComponent/>
    </>
  );
}

function QuestionComponent (props) {
  
  return (
    <h1>{props.QuestionList}</h1>
  );
}

export default App;
