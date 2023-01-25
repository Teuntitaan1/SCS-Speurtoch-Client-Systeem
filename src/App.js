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
			// if the warning is a blank string, nothing will render. else it will
			// render the warning/error associated with the qr-code
			Warning : ""

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
			<div className='StartScreenDiv'>
				<h1>{"Welkom bij de Archeon speurtocht over bijen en zijn diverse soorten! (placeholder tekst)"}</h1>
				<button onClick={() => this.setState({ProgramState : "SelectionScreen"})}>Start</button>
			</div>
			);

		case "SelectionScreen":

		// upon completing the question, the checkmark renders, else it does not.
		// The image has to be required.
			return (
			<div className='SelectionScreenDiv'>
				<button onClick={() => this.setState({Scanning : !this.state.Scanning})}>Scannen</button>
				
				{this.state.Scanning === true ? 
				
					<QrReader
					delay={100}
					style={{height: 240, width: 320,}}
					onError={this.HandleError}
					onScan={this.HandleScan}
					/>
					:  null
				}
				
				<p style={{"color" : "red"}}>{this.state.Warning}</p>

				{this.state.QuestionList.map((Question, index) =>
					Question["Completed"] === true ? <CompletedQuestion key={index} Question = {Question}/> : null
				)}
			</div> 
		); 


		case "AnswerScreen":
		
			return(
			<div className='AnswerScreenDiv'>
				<h1>{this.state.QuestionList[this.state.ActiveQuestion]["Title"]}</h1>
				<h2>{this.state.QuestionList[this.state.ActiveQuestion]["Description"]}</h2>

				{
				/*Dynamicly loads in the options provided by the question, different questions can have a different amount of answers*/
				this.state.QuestionList[this.state.ActiveQuestion]["Options"].map((Option, index) =>
					<button key={index} onClick={() => this.ValidateAnswer(Option)}>{Option}</button>)
				}
				<button onClick={() => this.setState({ProgramState : "SelectionScreen"})}>Terug</button>
			</div>
			);

		case "FinishScreen":
			
			return(
			<div className='FinishScreenDiv'>
				<h1>Hier komt het eindscherm!</h1>
				<button onClick={() => this.PostStatistics()}>Stuur statistieken op!</button>
			</div>
			);
		
		default:

			return(
			<div className='ErrorScreenDiv'>
				<h1>Error... er is iets fout gegaan!</h1>
			</div>
			);
		} 
	}
  
  	ValidateAnswer(Option) {

		console.log("here")
		// validates the option given by the user and if correct, marks the question as done, also returns to the selection screen
		if (Option === this.state.QuestionList[this.state.ActiveQuestion]["CorrectAnswer"]) {
		
			var NewQuestionList = this.state.QuestionList;
			NewQuestionList[this.state.ActiveQuestion]["Completed"] = true;
			this.setState({QuestionList : NewQuestionList});			
			
			this.setState({ProgramState : "SelectionScreen"});
		}
		else {
			console.log("Incorrect Answer");
		}
  }
  		
  	// all QrCode Code 

  	// handles the scanning of the qr codes
  	HandleScan(data){
    
		if (data === null) {
			// do nothing
			this.setState({Warning : ""});
			return null; 
		}
		// checks if the qrcode is valid by checking if it would return a key in our QuestionList
		if (this.state.QuestionList[data["text"]] === undefined) {
			this.setState({Warning : "Deze QR-code is niet geldig, probeer een andere!"});
			return null; 
		}
		
		if (this.state.QuestionList[data["text"]]["Completed"] === false) {
			
			// sets the active question and turns of the scanner
			this.setState({ActiveQuestion: data["text"]});
			this.setState({ProgramState :"AnswerScreen"});
			this.setState({Scanning : false});
			
			// resets the warning
			this.setState({Warning : ""});
		}
		else {
			this.setState({Warning :"Je hebt deze QR-code al beantwoord!"});
		}
    }

	// handles the error part of scanning qr codes
	HandleError(error){
		this.setState({Warning : error});
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



class CompletedQuestion extends React.Component {
	render() {
		return(
			<div className='CompletedQuestionDiv'>
				<h3 className='CompletedQuestionTitle'>{this.props.Question["Title"]}</h3>
				<h4 className='CompletedQuestionDescription'>{this.props.Question["Description"]}</h4>
				<ul>
					{this.props.Question["Options"].map((Option, index) => 
						Option === this.props.Question["CorrectAnswer"] ?
						<li key={index} className='CorrectAnswer'>{Option}</li> : 
						<li key={index} className='IncorrectAnswer'>{Option}</li>)}
				</ul>
			</div>
		);
	}
} 
export default App;
