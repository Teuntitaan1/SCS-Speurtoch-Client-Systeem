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
      ActiveQuestion : null,
      Statistics : {"CorrectFirstTime" : 0, "TimeSpent" : 0},
    }
  }

  // All statistics code

  // all quiz code 

  ValidateAnswer(Option) {


    // validates the option given by the user and if correct, marks the question as done, also returns to the selection screen
    if (Option === this.state.QuestionList[this.state.ActiveQuestion]["CorrectAnswer"]) {
      console.log("Correct Answer");
      var NewQuestionList = this.state.QuestionList;
      NewQuestionList[this.state.ActiveQuestion]["Completed"] = true;
      this.setState({QuestionList : NewQuestionList});
      this.SwitchState("SelectionScreen");
    }
    else {
      console.log("Incorrect Answer");
    }
  }

  // all program state code
  SwitchState(State, Index) {
    this.setState({ProgramState : State});
    this.setState({ActiveQuestion: Index});
  }

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
        

          
      /////////
      // upon completing the question, the checkmark renders, else it does not.
      // the button will render when the question is not yet completed, so the question can be answered.
      // The image has to be required.
        return (
          <>
            {this.state.QuestionList.map((Question, Index) => 
              
              <div key={Index}>
                <h3>{Question["Title"]}</h3>

                {Question["Completed"] ? null : <button onClick={() => this.SwitchState("AnswerScreen", Index)}>Naar vraag</button>}
                
                {Question["Completed"] ? <img src={require('./Images/checkmark.png')} alt='Vraag compleet!'/>: null}

              </div>
            )}
          </>
        );  

      case "AnswerScreen":
        
        return(
          <>
          
            <h1>{this.state.QuestionList[this.state.ActiveQuestion]["Title"]}</h1>
            <h2>{this.state.QuestionList[this.state.ActiveQuestion]["Description"]}</h2>

            <button onClick={() => this.ValidateAnswer("Option1")}>{this.state.QuestionList[this.state.ActiveQuestion]["Option1"]}</button>
            <button onClick={() => this.ValidateAnswer("Option2")}>{this.state.QuestionList[this.state.ActiveQuestion]["Option2"]}</button>
            <button onClick={() => this.ValidateAnswer("Option3")}>{this.state.QuestionList[this.state.ActiveQuestion]["Option3"]}</button>
            <button onClick={() => this.ValidateAnswer("Option4")}>{this.state.QuestionList[this.state.ActiveQuestion]["Option4"]}</button>

            <button onClick={() => this.SwitchState("SelectionScreen")}>Terug</button>

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

export default App;
