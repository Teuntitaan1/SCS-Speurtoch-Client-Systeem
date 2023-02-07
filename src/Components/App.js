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


// ALL POSSIBLE LOCATIONS
//MIDDELEEUWEN
//PREHISTORIE
//ROMEINSETIJD

// TODO
// Hints
// Look and feel of the program should be improved
// needs extra info after answering a question
// Program looks ugly af, should work on that

class App extends React.Component {
  
	constructor(props) {
		super(props);
		console.log(`Debug mode: ${this.props.debugmode}`);

		// attempts to load Quizstate from storage
		window.localStorage.getItem("QuizState") !== "" ? 
			this.state = JSON.parse(window.localStorage.getItem("QuizState"))
			:
			this.state = {
				// the state the program currently sits in, look at the top of the file for all allowed states
				ProgramState : "StartScreen",
				// all variables used for the quiz itself
				QuestionList : require("../Local_Files/Quiz_Content/Questions.json"),
				ActiveQuestion : null,
				FirstAttempt : true,
				AnsweredCorrect : false,

				QuestionsCompleted : 0, 
				QuestionsCompletedFirstTime : 0,
				// qr code variables
				Scanning : false,
				// if the warning is a blank string, nothing will render. else it will
				// render the warning/error associated with the qr-code
				Warning : "",
	
				// all variables user by the leaderboard functionality
				SendResults : false,
				TimeSpent : 0,
				UserName : "",
				Leaderboard : [],

			}
	
		// event listeners

		this.HandleQrCodeScan = this.HandleQrCodeScan.bind(this);
		this.HandleQrCodeError = this.HandleQrCodeError.bind(this);
	}



	// all render code
	render() {

		switch (this.state.ProgramState) {
		
			// loops through all possible program states and determines what to render, no hassle with css styles and its much more efficient
			case "StartScreen":

				return(
					<>
						<h1>{"Archeon Speurtocht Bijenlandgemeenschap"}</h1>
						<button onClick={() => this.setState({ProgramState : "SelectionScreen"})}>Begin!</button>
					</>
				);

			case "SelectionScreen":

			// upon completing the question, the checkmark renders, else it does not.
			// The image has to be required.
				return (
					<>
						<button onClick={() => this.setState({Scanning : !this.state.Scanning})}>{this.state.Scanning !== true ? "Start" : "Stop"} met scannen</button>
						
						{this.state.Scanning === true ? 
							<QrReader 
								delay={100} 
								style={{height: 240, width: 320,}} 
								onScan={this.HandleQrCodeScan} 
								onError={this.HandleQrCodeError}/>
							:  
							null
						}
						
						<p style={{"color" : "red"}}>{this.state.Warning}</p>

						<p>{this.state.QuestionsCompleted}/{this.state.QuestionList.length} goed beantwoord!</p>
						<button onClick={() => this.setState({ProgramState : "DoneQuestionsScreen"})}>Vragen</button>
						{/*Big button statement, lets the user through when all questions have been answered, else it doesnt*/}
						<button onClick={() => 
							{this.state.QuestionsCompleted === this.state.QuestionList.length && this.state.QuestionsCompleted !== 0 ?
								this.setState({ProgramState : "FinishScreen"}) :
								console.log("Je mag er nog niet door")}}
						>{this.state.QuestionsCompleted === this.state.QuestionList.length && this.state.QuestionsCompleted !== 0 ?
							"Verzenden" : `Nog ${this.state.QuestionList.length - this.state.QuestionsCompleted} ${this.state.QuestionList.length - this.state.QuestionsCompleted === 1 ? "vraag" : "vragen"}`
						}</button>
					</> 
			); 
			
			case "DoneQuestionsScreen": 
				
				return(
					<>
						<button onClick={() => {this.setState({ProgramState : "SelectionScreen"})}}>Terug</button>
						{this.state.QuestionList.map((Question, index) => Question.Completed === true ? <CompletedQuestion key={index} Question = {Question}/> 
						: null)}
					</>
				);
			

			case "AnswerScreen":
			
				return(
					<>
						<h1>{this.state.QuestionList[this.state.ActiveQuestion].Title}</h1>
						<h2>{this.state.QuestionList[this.state.ActiveQuestion].Description}</h2>
						{
						/*Dynamicly loads in the options provided by the question, different questions can have a different amount of answers*/
						this.state.QuestionList[this.state.ActiveQuestion].Options.map((Option, index) =>
							<button key={index} onClick={() => this.ValidateAnswer(Option)}>{Option}</button>)
						}
						{this.state.FirstAttempt !== true ? <p>Helaas! Dat is niet het goede antwoord!</p> : this.state.AnsweredCorrect === true ? <p>Goed gedaan!</p> : null}
						<button onClick={() => this.setState({ProgramState : "SelectionScreen"})}>Terug</button>
					</>
				);

			case "FinishScreen":
				
				return(
					<>
						{
							this.state.SendResults !== true ?
								<>
									<h3>{"Wat is je naam? (niet verplicht)"}</h3>
									<input type={'text'} onChange={(event) => {this.setState({UserName : event.target.value})}} value={this.state.UserName}/>
									<button onClick={() => {this.PushLeaderBoard(); this.PullLeaderBoard()}}>{this.state.UserName === "" ? "Sla over" : "Verstuur resulaten"}</button>
								</> 
								:
								<>
									{
										this.state.Leaderboard.length !== 0 ? 
											<table border={1} cellPadding={5}>
												<tbody>
													<tr>
														<th>Naam</th>
														<th>Tijd</th>
														<th>In 1x goed</th>
													</tr>
													{this.state.Leaderboard.map((Entry, index) => 
														<tr key={index}>
															<td>{Entry.UserName}</td>
															<td>{Entry.TimeSpent}</td>
															<td>{Entry.CorrectFirstTime}</td>
														</tr>
													)}
												</tbody>
										</table>
										:
										<p>Aan het laden...</p>
									}
									<button onClick={() => {this.ResetQuiz()}}>Goed gedaan!</button>
								</>
						}
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

		var NewQuestionList = this.state.QuestionList;
		// validates the option given by the user and if correct, marks the question as done, also returns to the selection screen
		if (Option === this.state.QuestionList[this.state.ActiveQuestion].CorrectAnswer) {
		
			// feedback for the user
			this.setState({AnsweredCorrect : true});
			this.state.FirstAttempt === true ? this.setState({QuestionsCompletedFirstTime : this.state.QuestionsCompletedFirstTime + 1}) : this.setState({FirstAttempt : true});
			// sets the active question to completed
			NewQuestionList[this.state.ActiveQuestion].Completed = true;
			this.setState({QuestionList : NewQuestionList, QuestionsCompleted : this.state.QuestionsCompleted + 1});
			
			// cool sequence for the users
			setTimeout(() => {
				this.setState({ProgramState : "SelectionScreen", AnsweredCorrect : false});
			}, 2000);			
		}
		else {
			this.setState({FirstAttempt : false});
			console.log("Incorrect Answer");
		}
  	}

  	// handles all events
	//
	//
  	HandleQrCodeScan(data){
		// validates data
		if (data === null || this.state.QuestionList[data.text] === undefined) {
			if (data == null) {
				this.setState({Warning : ""});
			} 
			else {
				this.setState({Warning : "Deze QR-code is niet geldig, probeer een andere!"});
			}
			return null;
		}
		// checks if the question has been answered or not
		this.state.QuestionList[data.text].Completed === false ?
			this.setState({ActiveQuestion: data.text, ProgramState :"AnswerScreen", Scanning : false, Warning : ""}) 
		:
			this.setState({Warning :"Je hebt deze QR-code al beantwoord!"});
	}
	// handles errors received from the qr code scanner
	HandleQrCodeError(error) {
		this.setState({Warning : error});
	}
		
	
	// All statistics code
	TimerTick() {
		if(this.state.ProgramState !== "StartScreen" && this.state.ProgramState !== "FinishScreen") {
			this.setState({TimeSpent : this.state.TimeSpent + 1});
		}
	}
	TimerSave() {
		var SavedState = {
			// the state the program currently sits in, look at the top of the file for all allowed states
			ProgramState : this.state.ProgramState,
			// all variables used for the quiz itself
			QuestionList : this.state.QuestionList,
			ActiveQuestion : this.state.ActiveQuestion,
			FirstAttempt : this.state.FirstAttempt,
			AnsweredCorrect : this.state.AnsweredCorrect,

			QuestionsCompleted : this.state.QuestionsCompleted, 
			QuestionsCompletedFirstTime : this.state.QuestionsCompletedFirstTime,


			// qr code variables
			Scanning : false,
			// if the warning is a blank string, nothing will render. else it will
			// render the warning/error associated with the qr-code
			Warning : "",

			// all variables user by the leaderboard functionality
			SendResults : this.state.SendResults,
			TimeSpent : this.state.TimeSpent,
			UserName : this.state.UserName,
			Leaderboard : this.state.Leaderboard
			
		}	
		window.localStorage.setItem("QuizState" , JSON.stringify(SavedState));
	}
	
	PushLeaderBoard() {
		var Body = JSON.stringify({
			UserName : this.state.UserName !== "" ? this.state.UserName : "Anoniem",
			TimeSpent : this.state.TimeSpent,
			CorrectFirstTime : this.state.QuestionsCompletedFirstTime,});

		// sends the statistics array to the server
		fetch("http://localhost:8000", {
			method: 'POST',
			headers: {"Content-Type": "text/plain; charset=UTF-8"},
			body: Body})
		.catch((error) => {console.error('Error:', error);});

		// updates the state
		this.setState({SendResults : true});
	}
	
	PullLeaderBoard() {
		// gets the leaderboard from the server
		fetch('http://localhost:8000')
		.then((response) => response.json())
		.then((data) => this.setState({Leaderboard : data}));
	}




	// runs when the program is ready to run
	componentDidMount() {
		
		// statistics functions
		const QuizTimer = setInterval(() => this.TimerTick(), 1*1000);
		this.TimerID = QuizTimer;

		const SaveTimer = setInterval(() => this.TimerSave(), 5*1000);
		this.SaveTimerID = SaveTimer;

		const LeaderboardTimer = setInterval(() => this.PullLeaderBoard(), 20*1000);
		this.LeaderboardTimerID = LeaderboardTimer;
	}
	// runs when the program is ready to stop
	componentWillUnmount() {
		clearInterval(this.TimerID);
		clearInterval(this.SaveTimerID);
		clearInterval(this.LeaderboardTimerID);
	}

	ResetQuiz() {
		window.localStorage.setItem("QuizState", "");
		window.location.reload();
	}
}

export default App;
