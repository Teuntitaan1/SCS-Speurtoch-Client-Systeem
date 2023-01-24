import React from 'react';
import './App.css';
import QrReader from 'react-qr-scanner';

// ALL POSSIBLE PROGRAM STATES
// 1.StartScreen
// 2.SelectionScreen
// 3.AnswerScreen
// 4.FinishScreen
// 5. Anything else defaults to the error page

// TODO
// Hints
// Saving State of Quiz
// Look and feel of the program should be improved
// feedback when trying to scan a question you have already scanned

//QRCode Formatting should be as followed
// index of the question should be the containment of the qr code

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

      // qr code variables
      Scanning : false,
    }
    // event listeners

    this.HandleScan = this.HandleScan.bind(this);
    this.HandleError = this.HandleError.bind(this);
  }

  // all render code
  render() {

    switch (this.state.ProgramState) {
    
      // loops through all possible program states and determines what to render, no hassle with css styles and its much more efficient
      case "StartScreen":

        return(
          <>
            <h1>{"Welkom bij de Archeon speurtocht over bijen en zijn diverse soorten! (placeholder tekst)"}</h1>
            <button onClick={() => this.setState({ProgramState : "SelectionScreen"})}>Start</button>
          </>
        );

      case "SelectionScreen":

      // upon completing the question, the checkmark renders, else it does not.
      // The image has to be required.
        return (
          <>
            <button onClick={() => this.setState({Scanning : !this.state.Scanning})}>Scannen</button>
            
            {this.state.Scanning === true ? 
            
                <QrReader
                delay={1000}
                style={{height: 240, width: 320,}}
                onError={this.HandleError}
                onScan={this.HandleScan}
                />
                :  null
            }
            {this.state.QuestionList.map((Question, index) => 
              <p key={index}>
                {Question["Title"]}
                {Question["Completed"] ? 
                <img src={require("./Local_Files/Images/checkmark.png")} alt='Checkmark' className='QuestionCheckmark'/> 
                : null}
              </p>
              )
                
            }
            <p>{this.state.QuestionsCompleted}/{this.state.AmountOfQuestions} goed beantwoord!</p>
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
            <button onClick={() => this.setState({ProgramState : "SelectionScreen"})}>Terug</button>
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
  
  ValidateAnswer(Option) {

    // validates the option given by the user and if correct, marks the question as done, also returns to the selection screen
    if (Option === this.state.QuestionList[this.state.ActiveQuestion]["CorrectAnswer"]) {
      
      console.log("Correct Answer");

      var NewQuestionList = this.state.QuestionList;
      NewQuestionList[this.state.ActiveQuestion]["Completed"] = true;
      this.setState({QuestionList : NewQuestionList});
      this.setState({QuestionsCompleted : this.state.QuestionsCompleted + 1});

      // if all questions have been completed, the quiz finishes, else it moves back to the SelectionScreen
      this.state.QuestionsCompleted === this.state.AmountOfQuestions ?
       this.setState({ProgramState : "FinishScreen"}) : this.setState({ProgramState : "SelectionScreen"});       
    }
    else {
      console.log("Incorrect Answer");
    }
  }

  

  // all QrCode Code 

  // handles the scanning of the qr codes
  HandleScan(data){
    
    // else triggers on data change
    if (data === null) {
     // do nothing 
    }
    else {
      // checks if the qrcode is valid following our guidelines
      if (data["text"].length <= 2){
        // checks if the qrcode already has been scanned
        if (this.state.QuestionList[data["text"]]["Scanned"] === false) {
          
          // sets the active question and turns of the scanner
          this.setState({ActiveQuestion: data["text"]});
          this.setState({ProgramState :"AnswerScreen"});
          this.setState({Scanning : false});
          
          // makes sure you cant scan the same question twice
          var NewList = this.state.QuestionList;
          NewList[data["text"]]["Scanned"] = true;
          this.setState({QuestionList : NewList});

        }
        
       
      }
    }

    
  }
  // handles the error part of scanning qr codes
  HandleError(err){
    
    console.error(err);
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

  // runs when the program is ready to run
  componentDidMount() {
  
    // reads the file Questions.json and uses it in the quiz
    var Questions = require("./Local_Files/Quiz_Content/Questions.json");
    this.setState({QuestionList : Questions});
    this.setState({AmountOfQuestions : Questions.length});

  }

  // runs when the program is ready to stop
  componentWillUnmount() {
  }
}

export default App;
