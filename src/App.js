import React from 'react';
import './App.css';

// ALL POSSIBLE PROGRAM STATES
// 1.StartScreen
// 2.SelectionScreen
// 3.AnswerScreen
// 4.FinishScreen
// 5. Anything else defaults to the error page

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      // the state the program currently sits in, look at the top of the file for all allowed states
      ProgramState : "StartScreen",
      // all variables used for the quiz itself
      QuestionList : [],
      ActiveQuestion : null,
      
      AmountOfQuestions : 0,
      QuestionsCompleted : 0, 
      // statistics for after the quiz
      Statistics : {"CorrectFirstTime" : 0, "TimeSpent" : 0},
    }
    // event listeners
    this.ValidateCode = this.ValidateCode.bind(this);
  }

  // all quiz code 

  ValidateCode(event) {
    
    // prevents the form from reloading the page
    event.preventDefault();
    // compares the value from the code input to the correct code
    if (event.target[0].value === this.state.QuestionList[event.target.id]["Code"]) {
      
      console.log("Correct Secret code");
      // sets the active question and switches screen
      this.setState({ActiveQuestion: event.target.id});
      this.SwitchProgramState("AnswerScreen");
    }
    else {
      console.log("Incorrect Secret code");
    }
  }

  ValidateAnswer(Option) {

    // validates the option given by the user and if correct, marks the question as done, also returns to the selection screen
    if (Option === this.state.QuestionList[this.state.ActiveQuestion]["CorrectAnswer"]) {
      
      console.log("Correct Answer");

      var NewQuestionList = this.state.QuestionList;
      NewQuestionList[this.state.ActiveQuestion]["Completed"] = true;
      this.setState({QuestionList : NewQuestionList});
      this.setState({QuestionsCompleted : this.state.QuestionsCompleted + 1});

      this.SwitchProgramState("SelectionScreen");
      
    }
    else {
      console.log("Incorrect Answer");
    }
  }

  // all program state code
  SwitchProgramState(State) {
    // switches the this.state.ProgramState with the State variable, thus changing the state the program is in and triggering a rerender
    this.setState({ProgramState : State});
  }

  // runs when the program is ready to run
  componentDidMount() {
    
    // reads the file Questions.json and uses it in the quiz
    var Questions = require("./Local_Files/Quiz_Content/Questions.json");
    this.setState({QuestionList : Questions});
    this.setState({AmountOfQuestions : Questions.length});

    // triggers the code for the statistics

  }

  // runs when the program is ready to stop
  componentWillUnmount() {
  }

  // All statistics code

  PostStatistics() {
    
    fetch("http://localhost:8000", {
      method: 'POST', // Sends data to the server
      headers: {
        "Content-Type": "text/plain",
      },
    	body: JSON.stringify(this.state.Statistics),
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  // all render code
  render() {

    switch (this.state.ProgramState) {
      
      // loops through all possible program states and determines what to render, no hassle with css styles and its much more efficient
      case "StartScreen":

        return(
          <>
            <h1>{"Welkom bij de Archeon speurtocht over bijen en zijn diverse soorten! (placeholder tekst)"}</h1>
            <button onClick={() => this.SwitchProgramState("SelectionScreen")}>Start</button>
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
              
              <div key={Index} className='Question'>
                <h3>{Question["Title"]}</h3>

                {Question["Completed"] ? null :
                
                  <form key={Index} id={Index} onSubmit={this.ValidateCode}>
                  
                  <input type={'text'}></input>
                  <input type={'submit'} value={"Controleren"}></input>

                </form>
                
                }
              
                {Question["Completed"] ? <img src={require('./Local_Files/Images/checkmark.png')} alt='Vraag compleet!' className='QuestionCheckmark'/>: null}
                
              </div>
            )}

            <p>{this.state.QuestionsCompleted}/{this.state.AmountOfQuestions} goed beantwoord!</p>
            <button onClick={() => this.SwitchProgramState("FinishScreen")}>{"Klaar(Gaat naar FinishScreen( is dus voor testen ))"}</button>
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

            <br></br>
            <button onClick={() => this.SwitchProgramState("SelectionScreen")}>Terug</button>

          </>
        );

      case "FinishScreen":
        
        return(
          <>
            <h1>Hier komt het eindscherm!</h1>
            <button onClick={() => this.PostStatistics()}>Stuur statistieken op!</button>
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
