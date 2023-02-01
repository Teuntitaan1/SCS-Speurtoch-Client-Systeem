import React from 'react';
import '../StyleSheets/App.css';
import QrReader from 'react-qr-scanner';
import CompletedQuestion from './CompletedQuestion';

// ALL POSSIBLE PROGRAM STATES
// 1.StartScreen
// 2.SelectionScreen
// 3.DoneQuestionsScreen
// 4.AnswerScreen
// 5.FinishScreen
// 6. Anything else defaults to the error page

//QRCode Formatting should be as followed
// index of the question should be the containment of the qr code

// TODO
// Hints
// Saving State of Quiz
// Look and feel of the program should be improved
// needs extra info after answering a question
// Program looks ugly af, should work on that
// there is no feedback for questions that are answered wrong









class App extends React.Component {
  
	constructor(props) {
		super(props);

		this.state = {
		
			// the state the program currently sits in, look at the top of the file for all allowed states
			ProgramState : "StartScreen",
			// all variables used for the quiz itself
			QuestionList : [],
			ActiveQuestion : null,
			
			QuestionsCompleted : 0, 

			// qr code variables
			Scanning : false,
			// if the warning is a blank string, nothing will render. else it will
			// render the warning/error associated with the qr-code
			Warning : "",

			// all variables user by the leaderboard functionality
			SendResults : false,
			TimeSpent : 0,
			UserName : "",
			Leaderboard : []

		}
		// event listeners

		this.HandleScan = this.HandleScan.bind(this);
		this.HandleError = this.HandleError.bind(this);
		this.HandleNameChange = this.HandleNameChange.bind(this);
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
						onScan={this.HandleScan}
						onError={this.HandleError}
						/>
						:  null
					}
					
					<p style={{"color" : "red"}}>{this.state.Warning}</p>

					<p>{this.state.QuestionsCompleted}/{this.state.QuestionList.length} goed beantwoord!</p>
					<button onClick={() => this.setState({ProgramState : "DoneQuestionsScreen"})}>Vragen</button>
					<button onClick={() => this.setState({ProgramState : "FinishScreen"})}>Klaar?</button>
				</div> 
		); 
		
		case "DoneQuestionsScreen": 
			
			return(
				<div>
					<button onClick={() => {this.setState({ProgramState : "SelectionScreen"})}}>Terug</button>
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
				<div>
					{
						this.state.SendResults !== true ?
							<div>
								<input type={'text'} onChange={this.HandleNameChange} value={this.state.UserName}/>
								<button onClick={() => this.HandleLeaderboard()}>{this.state.UserName === "" ? "Sla stap over" : "Verstuur resulaten"}</button>
							</div> 
							:
							<div>
								{
									this.state.Leaderboard.length !== 0 ? 
										<table>
											<tbody>
												<tr>
													<th>Naam</th>
													<th>Tijd</th>
													<th>In 1x goed</th>
												</tr>
												{this.state.Leaderboard.map((Entry, index) => 
													<tr key={index}>
														<td>{Entry["UserName"]}</td>
														<td>{Entry["TimeSpent"]}</td>
														<td>{Entry["CorrectFirstTime"]}</td>
													</tr>
												)}
											</tbody>
									</table>
									:
									<p color='red'>Helaas, wij konden geen resultaten inladen</p>
								}
								<button onClick={() => window.location.reload()}>Goed gedaan!</button>
							</div>
					}
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

		var NewQuestionList = this.state.QuestionList;
		// validates the option given by the user and if correct, marks the question as done, also returns to the selection screen
		if (Option === this.state.QuestionList[this.state.ActiveQuestion]["CorrectAnswer"]) {
		
			// sets the active question to completed
			NewQuestionList[this.state.ActiveQuestion]["Completed"] = true;
			this.setState({QuestionList : NewQuestionList});			
			// switches the state back to the selectionscreen
			this.setState({ProgramState : "SelectionScreen"});
			// Increments the QuestionsCompleted variable
			this.setState({QuestionsCompleted : this.state.QuestionsCompleted + 1});
		}
		else {
			// sets the active question to completed
			NewQuestionList[this.state.ActiveQuestion]["CorrectFirstTime"] = false;
			this.setState({QuestionList : NewQuestionList});
			console.log("Incorrect Answer");
		}
  	}
  	// only lets the user through when all questions have been answered
  	ValidateQuiz() {
		
		if (this.state.QuestionsCompleted === this.state.QuestionList.length && this.state.QuestionsCompleted !== 0) {
			
		}
		//currently doesnt work since debug
		this.setState({ProgramState : "FinishScreen"});
		this.HandleLeaderboard();
	}

  	// handles all events
	//
	//
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
	
	
	
	
	
	// handles errors received from the qr code scanner
	HandleError(error) {
		this.setState({Warning : error});
	}
	HandleNameChange(event) {
		this.setState({UserName : event.target.value});
	}
	
	
	
	
	
	
	
	// All statistics code
	Timer() {
		if(this.state.ProgramState !== "StartScreen" && this.state.ProgramState !== "FinishScreen") {
			this.setState({TimeSpent : this.state.TimeSpent + 1});
		}
	}
	
	
	
	
	
	
	// handles the leaderboard on the FinishScreen
	HandleLeaderboard() {

		// updates the state
		this.setState({SendResults : true});
		// sets the username provided, or "Anoniem" when none provided
		var UserNameForServer = "Anoniem";
		if (this.state.UserName !== "") {
			UserNameForServer = this.state.UserName;
		}
		// doenst work, need fixing
		var CorrectFirstTime = 0;
		this.state.QuestionList.map((Question) => Question["CompletedFirstTime"] === true ? CorrectFirstTime++ : console.log("Didnt complete first time"));
		
		// sends the statistics array to the server
		fetch("http://localhost:8000", {
			method: 'POST',
			headers: {
			"Content-Type": "text/plain; charset=UTF-8",
			
			},
			body: JSON.stringify(
				{
					"UserName" : UserNameForServer,
					"TimeSpent" : this.state.TimeSpent,
					"CorrectFirstTime" : CorrectFirstTime,
				}
			),
			})
		.catch((error) => {
		console.error('Error:', error);
		});
		// gets the leaderboard from the server
		fetch('http://localhost:8000')
  			.then((response) => response.json())
  			.then((data) => this.setState({Leaderboard : data}));
	}
	




	// runs when the program is ready to run
	componentDidMount() {
		// reads the file Questions.json and uses it in the quiz
		var Questions = require("../Local_Files/Quiz_Content/Questions.json");
		this.setState({QuestionList : Questions});

		// statistics functions
		const Timer = setInterval(() => this.Timer(), 1000);
		this.TimerID = Timer;
	}
	// runs when the program is ready to stop
	componentWillUnmount() {
		clearInterval(this.TimerID);
	}
}

export default App;
