// my own components etc
import './StyleSheets/App.css';
import CompletedQuestion from './Components/CompletedQuestion';

// library imports
import React from 'react';
import QrReader from 'react-qr-scanner';
// image imports
import QrCodeButton from './Images/QrCodeButton.svg';
import ArrowDown from './Images/Pijltje.svg';
import Logo from './Images/Archeon logo.png';
import BackArrow from './Images/PijlNaarLinks.svg';
import HintIcon from './Images/HintIcon.svg';
// ALL POSSIBLE PROGRAM STATES
// 1.StartScreen
// 2.SelectionScreen
// 3.DoneQuestionsScreen
// 4.AnswerScreen
// 5.FinishScreen
// 6.Anything else defaults to the error page


// ALL POSSIBLE LOCATIONS
//MIDDELEEUWEN
//PREHISTORIE
//ROMEINSETIJD

// TODO
// fix the leaderboard
// prettify the Startscreen
// prettify the FinishScreen
// prettify the Questionsscreen

class App extends React.Component {
  
	constructor(props) {
		super(props);

		const QuestionList = require("./Questions.json");
		// attempts to load Quizstate from storage

		// if the key doesnt exist it generates a new one
		if (window.localStorage.getItem("QuizState") === null || window.localStorage.getItem("QuizState") === "") {
			window.localStorage.setItem("QuizState" , "");
			this.state = {
				// the state the program currently sits in, look at the top of the file for all allowed states
				ProgramState : "StartScreen",
				PreviousState : "StartScreen",
				// all variables used for the quiz itself
				QuestionList : QuestionList,
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
		}
		else {
			this.state = JSON.parse(window.localStorage.getItem("QuizState"));
		}
	
		// event listeners
		this.HandleQrCodeScan = this.HandleQrCodeScan.bind(this);
		this.HandleQrCodeError = this.HandleQrCodeError.bind(this);

	}



	// all render code
	render() {
		// generates a nice looking progress bar
		var progressbar = 
			<>
				<div style={{borderWidth : 5+"px", borderColor : 'black', width : 100+"%", height : 1+"rem"}}>
					<div style={{backgroundColor : 'green', height : 100+"%", width : (this.state.QuestionsCompleted * (100 / this.state.QuestionList.length)) + "%", transition: 'width 1s ease-in-out', borderRadius : 5+"px"}}><p style={{textAlign : 'end'}}>{this.state.QuestionsCompleted}/{this.state.QuestionList.length}</p></div>
				</div>
			</>

		// chooses what to display in the main part of the program
		var programbody = null;
		
		switch (this.state.ProgramState) {
		
			// loops through all possible program states and determines what to render, no hassle with css styles and its much more efficient
			case "StartScreen":

				programbody =
					<>
						<h1>{"Archeon Speurtocht Bijenlandgemeenschap"}</h1>
						<button onClick={() => {this.SwitchProgramState("SelectionScreen");this.GenerateHint();}}>Begin!</button>
						
					</>;
					break;




			case "SelectionScreen":
			// upon completing the question, the checkmark renders, else it does not.
			// The image has to be required.
				programbody =
					<>	
						{this.state.Scanning === true ? 
							/*Qr code generator for the non legacy mode users*/
							<div style={{display : 'flex', justifyContent : 'center', flexWrap : 'wrap',  width : 100+"%", height : 20+"rem"}}>
							
								<QrReader 
									delay={0} 
									style={{height: 16+"rem", width: 100+"%", borderRadius : 5+"px"}} 
									onScan={this.HandleQrCodeScan} 
									onError={this.HandleQrCodeError}/>

								<button onClick={() => this.setState({Scanning : false})} style={{height: 2+"rem", width: 50+"%", borderRadius : 5+"px"}} >Stop met scannen</button>
								<p style={{color : "red", height : 2+"rem"}}>{this.state.Warning}</p>

							</div>
							:
							/*if not scanning display the image*/
							<div style={{display : 'flex', justifyContent : 'center'}}>
								<img onClick={() => this.setState({Scanning : true})} src={QrCodeButton} alt="Qr code button"
									style={{height: 20+"rem", width: 90+"%"}} />
							</div>

						}
						
						<div style={{display : 'flex', justifyContent : 'center'}}>
							<img onClick={() => this.SwitchProgramState("DoneQuestionsScreen")} src={ArrowDown} alt="DoneQuestionsbutton" style={{height: 4+"rem", width: 4+"rem"}}/>
						</div>

					</>;
				break;
			



			case "DoneQuestionsScreen": 
				
				programbody =
					<>
						{this.state.QuestionList.map((Question, index) => Question.Completed === true ? <CompletedQuestion key={index} Question = {Question}/> 
						: null)}
					</>;
				break;
			



			case "AnswerScreen":
			
				programbody =
					<>
						<h1 style={{fontWeight : 'bold', textAlign : 'center'}}>{this.state.QuestionList[this.state.ActiveQuestion].Title}</h1>
						<h2 style={{fontWeight : 100, fontStyle : 'italic', textAlign : 'center'}}>{this.state.QuestionList[this.state.ActiveQuestion].Description}</h2>
						<div style={{display : 'flex'}}>
						{
						/*Dynamicly loads in the options provided by the question, different questions can have a different amount of answers*/
						this.state.QuestionList[this.state.ActiveQuestion].Options.map((Option, index) =>
							<div style={{backgroundColor : "#56a222", width : 10+"rem", height : 5+"rem", borderRadius: 1+"rem"}}  key={index} onClick={() => {this.ValidateAnswer(Option);}}>
								<div style={{borderRadius : 360+"rem", backgroundColor : "#457c1f", width : 1.5+"rem", height : 1.5+"rem", textAlign : 'center'}}>{index}</div>
								<p style={{textAlign : 'center'}}>{Option}</p>
							</div>
							)
						}
						</div>
						{this.state.FirstAttempt !== true ? <p>Helaas! Dat is niet het goede antwoord!</p> : this.state.AnsweredCorrect === true ? <p>Goed gedaan!</p> : null}
					</>;
				break;





			case "FinishScreen":
				
				programbody =
					<>
						{this.state.SendResults !== true ?
							<>
								<h3>{"Wat is je naam? (niet verplicht)"}</h3>
								<input type={'text'} onChange={(event) => {this.setState({UserName : event.target.value})}} value={this.state.UserName}/>
								<button onClick={() => {this.PushLeaderBoard(); this.PullLeaderBoard()}}>{this.state.UserName === "" ? "Sla over" : "Verstuur resulaten"}</button>
							</> 
							:
							<>
								<h3>Je score</h3>
								{
									this.state.Leaderboard.length !== 0 ? 
										<table border={1} cellPadding={5}>
											<tbody>
												<tr>
													<th>Naam</th>
													<th>In 1x goed</th>
													<th>Tijd</th>
												</tr>
												{this.state.Leaderboard.map((Entry, index) => 
													<tr key={index}>
														<td>{Entry.UserName}</td>
														<td>{Entry.CorrectFirstTime}</td>
														<td>{Entry.TimeSpent}</td>
													</tr>
												)}
											</tbody>
									</table>
									:
									<p>Aan het laden...</p>
								}
								<p>Laat dit scherm zien bij de kassa voor een cool prijsje!</p>
								<button onClick={() => {this.ResetQuiz()}}>Ik heb mijn prijs gekregen!</button>
							</>
						}
					</>;
				break;
			
			default:

				programbody =
					<>
						<h1>Error... er is iets fout gegaan!</h1>
					</>;
				break;



		}
		

		// renders based on what programbody is
		return(
			<>
				<div style={{backgroundColor : "#56a222", width : 100+"%", height : 10+"%", position : 'absolute', top : 0+"%", left : 0+"%"}}>
					<img onClick={() => {this.SwitchProgramState(this.state.PreviousState);}} style={{height : 100+"%", position : 'absolute', left : 0+"%"}} src={BackArrow} alt="A backarrow"/>
					<img style={{height : 100+"%", position : 'absolute', left : 100/3+"%"}} src={Logo} alt="Logo of the archeon website"/>
				</div>
				
				<div style={{paddingTop : 15+"%"}}>
					<div style={{backgroundColor : "#457c1f", marginTop : 7+"%", width : 100+"%", height : 3.5+"rem", borderRadius : 1+"rem", display : 'flex'}}>
						<img src={HintIcon} alt='Hint icon' style={{width : 3+"rem", height : 3.5+"rem"}}></img>
						<p style={{ textAlign : 'center', fontSize : 1.1+"rem"}}>{this.state.CurrentHint}</p>
					</div> 
					<div style={{marginTop : 2+"%"}}>
						{programbody}
					</div>
				</div>

				<div style={{backgroundColor : "#56a222", width : 100+"%", height : 12+"%", position : 'absolute', bottom : 0+"%", left : 0+"%"}}>
					{progressbar}
					<footer style={{position : 'absolute', bottom : 0+"%", left : 35+"%", opacity : 0.8, fontWeight : 'bold', fontSize : 100+"%"}}>Bezige Bijtjes @{new Date().getFullYear()}</footer>
				</div>

				{this.props.debugmode === true ?
					<div>
						<hr/>
						<h3>Debug bedieningspaneel</h3>
						<button onClick={() => {this.ResetQuiz()}}>Reset</button> 

					</div>
					: null}
			</>
			
		); 
	}

	SwitchProgramState(NewState, StatesShouldMatch = false) {
		if (StatesShouldMatch !== true) {
			var OldState = this.state.ProgramState;
			this.setState({ProgramState : NewState, PreviousState : OldState}); 
		}
		else {
			this.setState({ProgramState : NewState, PreviousState : NewState}); 
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
			
			
			this.GenerateHint();

			// cool sequence for the users
			setTimeout(() => {
				
				// if all questions have been answered, finish the quiz, please work
				if (this.state.QuestionsCompleted === this.state.QuestionList.length && this.state.QuestionsCompleted !== 0) {
					this.SwitchProgramState("FinishScreen", true);
				}
				else {
					this.SwitchProgramState("SelectionScreen", true);
					this.setState({AnsweredCorrect : false});
				}
				
			}, 1200);			
		}
		else {
			this.setState({FirstAttempt : false});
			console.log("Incorrect Answer");
		}
  	}

		// generates a hint used in the selectionscreen
		GenerateHint() {

			var GotHint = false;
			var CurrentTijdperk = 0;
			var TijdperkList = ["PREHISTORIE", "MIDDELEEUWEN", "ROMEINSETIJD"];
	
			while (GotHint === false) {
				// loops through the questionlist array
				// eslint-disable-next-line
				this.state.QuestionList.every(Question => {
					// skips the question if it has already been completed
					if (Question.Completed === false) {
						// checks if its tijdperk is equal to the desired tijdperk
						if (Question.Tijdperk === TijdperkList[CurrentTijdperk]) {
							// sets the hint to the found hint
							this.setState({CurrentHint : Question.Hint});
							GotHint = true;
							console.log(`Got hint from ${Question.Title}, Tijdperk = ${Question.Tijdperk}`);
							// stops the .every()
							return false;
						}
					}
					// continues the .every() when the question isnt usefull
					return true;
				});
				// if no questions could be found matching the desired tijdperk, move the tijdperk + 1
				CurrentTijdperk++;
				// if all possible tijdperken have been searched through and nothing was found, all questions have been answered and the quiz is done
				if (CurrentTijdperk - 1 === TijdperkList.length) {
					this.setState({CurrentHint : "Je hebt alle vragen beantwoord, goed gedaan!"});
					GotHint = true;
				}
			}
		}

  	// handles all Qr-code code
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
	// handles all timer code
	TimerTick() {
		// increments the TimeSpent variable if the user is activly participating in the quiz
		if(this.state.ProgramState !== "StartScreen" && this.state.ProgramState !== "FinishScreen") {
			this.setState({TimeSpent : this.state.TimeSpent + 1});
		}
	}
	TimerSave() {
		var SavedState = this.state;
		// saves the program to localstate
		window.localStorage.setItem("QuizState" , JSON.stringify(SavedState));
	}
	
	PushLeaderBoard() {
		// statistics to sent to the server
		var Body = {
			method: 'POST',
			headers: {"Content-Type": "text/plain; charset=UTF-8"},
			body: JSON.stringify({
				UserName : this.state.UserName !== "" ? this.state.UserName : "Anoniem",
				TimeSpent : this.state.TimeSpent,
				CorrectFirstTime : this.state.QuestionsCompletedFirstTime,
				// calculates a score based on different statistics
				Score : this.state.QuestionsCompleted / this.state.TimeSpent})};

		// sends the Body array to the server
		fetch("http://localhost:8000", Body).catch((error) => {console.error('Error:', error);});

		// updates the state
		this.setState({SendResults : true});
	}
	// broke all of a sudden
	PullLeaderBoard() {
		// gets the leaderboard from the server and displays it on the finishscreen
		fetch('http://localhost:8000')
		.then((response) => response.json())
		.then((data) => {this.setState({Leaderboard : data}); console.log(`Pullled, got data: ${data}`)});
	}

	// runs when the program is ready to run
	componentDidMount() {
		
		// prepares the various timers used in the program
		const QuizTimer = setInterval(() => this.TimerTick(), 1*1000);
		this.TimerID = QuizTimer;

		const SaveTimer = setInterval(() => this.TimerSave(), 1*1000);
		this.SaveTimerID = SaveTimer;

		const LeaderboardTimer = setInterval(() => this.PullLeaderBoard(), 10*1000);
		this.LeaderboardTimerID = LeaderboardTimer;
	}
	// runs when the program is ready to stop
	componentWillUnmount() {
		// lets the timers go
		clearInterval(this.TimerID);
		clearInterval(this.SaveTimerID);
		clearInterval(this.LeaderboardTimerID);
	}



	
	ResetQuiz() {
		// deletes the saved quiz from storage and quickly reloads the page to reset the client side quiz so it begins with a clean slate
		window.localStorage.setItem("QuizState", "");
		window.location.reload();
	}
}

export default App;
