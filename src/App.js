import React from 'react';
import './App.css';

// ALL POSSIBLE PROGRAM STATES
// 1.StartScreen
// 2.SelectionScreen
// 3.AnswerScreen
// 4.FinishScreen

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      ProgramState : "SelectionScreen",
      QuestionList : [],
      Statistics : {"CorrectFirstTime" : 0, "TimeSpent" : 0},
    }
  }

  // All statistics code

  // all quiz code 


  // runs when the program is ready to run
  componentDidMount() {
    // asynchronous api/server call requesting all questions
    fetch("http://localhost:8000")
      .then(response => response.json())
        .then(
          (result) => {
            this.setState({QuestionList : result});
          },
          // Handles errors
          (error) => {
            console.log(error);
          }
          )
    }


  // all render code
  render() {

    switch (this.state.ProgramState) {
      
      // loops through all possible program states and determines what to render, no hassle with css styles and its much more efficient
      case "StartScreen":

        return(
          <>
            <h1>Hier komt het startscherm!</h1>
          </>
        );

      case "SelectionScreen":

        return (
          <>
            {this.state.QuestionList.map((Question, Index) => 
              <QuestionComponent Question={Question} ID={"Question"+Index}/>
            )}
          </>
        );  

      case "AnswerScreen":

        return(
          <>
            <h1>Hier komt het vraagscherm!</h1>
          </>
        );

      case "FinishScreen":
        
        return(
          <>
            <h1>Hier komt het eindscherm!</h1>
          </>
          );
    
      default:

        return(
          <>
            <h1>Error... er is iets fout gegaan!</h1>
          </>
        );
    } 
  }
}

class QuestionComponent extends React.Component {
  render() {
    return(
      <div id={this.props.ID}>
        <h3>{this.props.Question["Title"]}</h3>
      </div>
    );
  }
}
export default App;
