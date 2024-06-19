// my own components etc
import '../StyleSheets/Main.css';
import Leaderboard from './Leaderboard';
import Footer from './Footer';
import Header from './Header';

// most program states
import SelectionScreen from './ProgramStates/SelectionScreen';
import DoneQuestionsScreen from './ProgramStates/DoneQuestionsScreen';
import StartScreen from './ProgramStates/StartScreen';
import FinalScreen from './ProgramStates/FinalScreen';


// attempts to load Quizstate from storage
import QuestionList from '../Questions.json';

// library imports
import React from 'react';
import Confetti from 'react-confetti';

// image import
import AnswerScreen from './ProgramStates/AnswerScreen';
import StatManager from './Managers/StatManager';
import TechnicalManager from './Managers/TechnicalManager';


// program variables
var TransitionTime = 200;

// ALL POSSIBLE PROGRAM STATES

// 1.StartScreen
// 2.SelectionScreen
// 3.DoneQuestionsScreen
// 4.AnswerScreen
// 5.FinishScreen
// 6.Anything else defaults to the error page

// TODO
// prettify the StartScreen / add instruction for the program
// rewrite css styling
// rewrite everything into nice functional components
// rewrite json functionality(server side?)
// rewrite server functionality

class App extends React.Component {
  
	constructor(props) {
		super(props);
		// if the key doesnt exist it generates a new one
		if (window.localStorage.getItem("QuizState") === null) {
			this.state = {
				StartedQuiz : false,
				CompletedQuiz : false,
				// the state the program currently sits in, look at the top of the file for all allowed states
				ProgramState : "StartScreen",
				PreviousState : "StartScreen",
				// all variables used for the quiz itself
				QuestionList : QuestionList,
				ActiveQuestion : null,
				QuestionsCompleted : 0, 

				// qr code variables
				Scanning : false,
				// if the warning is a blank string, nothing will render. else it will
				// render the warning/error associated with the qr-code
				Warning : "",

				// all variables user by the leaderboard functionality
				SendResults : false,
				UserName : "",

				// technical properties
				ShouldShowConffetti : false,
				ShouldShowProgramBody : true,
				Transitioning : false,
			}
		}
		else {
			if (window.localStorage.getItem("LastVisited") + (1000*60*60*6) > Date.now() && import.meta.env.VITE_Version === window.localStorage.getItem("Version")) {
				this.state = JSON.parse(window.localStorage.getItem("QuizState"));
				// reverts back to the homescreen
				this.state.ProgramState = "SelectionScreen";
				this.state.PreviousState = "SelectionScreen";
				this.state.ActiveQuestion = null;
				this.state.Warning = "";
				this.state.Transitioning = false;
				this.state.ShouldShowProgramBody = true;
				this.state.Scanning = false;
				this.state.ShouldShowConffetti = false;
			}
			else {
				this.ResetQuiz();
			}
			
		}
	
		// event listeners
		this.HandleQrCodeScan = this.HandleQrCodeScan.bind(this);
		this.HandleQrCodeError = this.HandleQrCodeError.bind(this);

	}

	// all render code
	render() {
		// chooses what to display in the main part of the program
		let programbody;
		
		switch (this.state.ProgramState) {
		
			// loops through all possible program states and determines what to render, no hassle with css styles and its much more efficient
			case "StartScreen":
				programbody =
					<StartScreen OnQuizStart={() => {this.SwitchProgramState("SelectionScreen", true); this.setState({StartedQuiz : true});}}/>
					break;

			case "SelectionScreen":
				programbody =
						<SelectionScreen
							ScanningOff={() => {this.setState({Scanning : false});}}
							ScanningOn={() => {this.setState({Scanning : true});}}
							Warning={this.state.Warning}
							HandleQrCodeScan={this.HandleQrCodeScan}
							HandleQrCodeError={this.HandleQrCodeError}
							Scanning={this.state.Scanning}
							ResetQuiz={() => {this.ResetQuiz();}}
						/>
				break;
			
			case "DoneQuestionsScreen": 
				programbody =
					<DoneQuestionsScreen QuestionList={this.state.QuestionList}/>
				break;
			
			case "AnswerScreen":
				programbody = <AnswerScreen
				 				Question={this.state.QuestionList[this.state.ActiveQuestion]} 
								HandleQuestionComplete={(Score) => {this.HandleQuestionComplete(Score)}}/>
				break;

			case "FinishScreen":
			
				programbody =
					<>	
						<div>
							<h2 style={{textAlign : 'center'}}>{"Bekijk je resultaten!"}</h2>
							<div style={{display : 'flex', justifyContent : 'center'}}>
								{this.state.SendResults !== true ?
								<input style={{width : 15+"rem", height : 2+"rem", fontSize : 1.2+"rem", borderTopStyle : 'hidden', borderRightStyle : 'hidden', borderLeftStyle : 'hidden'}}
									type={'text'} onChange={(event) => {this.setState({UserName : event.target.value})}} value={this.state.UserName}/> : null}
								<button style={{backgroundColor : "#56a222", color : "#000000", borderRadius : 0.1+"rem", width : 7+"rem", height : 2+"rem"}}
									onClick={() => {if (this.state.SendResults !== true) {this.PushLeaderBoard();} else {this.SwitchProgramState("FinalScreen", true); this.setState({ShouldShowConffetti : true});}} }>{this.state.SendResults ? "Doorgaan" : this.state.UserName === "" ? "Sla over" : "Verzenden"}</button>
							</div>
						</div>

						<Leaderboard/>
					</>; 
				break;
			
			case "FinalScreen":
				programbody = <FinalScreen ResetQuiz={() => {this.ResetQuiz();}}/>
				break;

			default:
				programbody =
					<>
						<h1>Error... er is iets fout gegaan!</h1>
						<h2>Mogelijk heb je geen toegang gegeven tot de camera?</h2>
						<p>Klik op de terugknop en probeer het nog een keer!</p>
					</>;
				break;
		}
		
		// renders based on what programbody is
		return(
			<StatManager>
				<TechnicalManager>
					<Header
						PreviousState={this.state.PreviousState}
						ProgramState={this.state.ProgramState}
						SwitchProgramState={(State, ShouldMatch) => {this.SwitchProgramState(State, ShouldMatch);}}
						ActiveQuestion={this.state.ActiveQuestion}
						ResetQuiz={() => {this.ResetQuiz();}}/>
					
					{/*screen state body*/}
					<div style={{marginTop: 11+"vh"}}>
						<div style={{marginTop : 1+"vh", opacity : this.state.ShouldShowProgramBody ? 1 : 0, transition : `opacity ${TransitionTime}ms ease-in-out`}}>
							{programbody}
						</div>
					</div>
					<Footer
						QuestionsCompleted={this.state.QuestionsCompleted} 
						QuestionListLength={this.state.QuestionList.length}
						ProgramState={this.state.ProgramState}/>
					<div style={{position : 'absolute', left : 0+"%", top : 0+"%", opacity : this.state.ShouldShowConffetti === true ? 1 : 0, transition : 'opacity 1s ease-in-out'}}>
						<Confetti/>
					</div>

					{this.props.debugmode === true ?
						<div>
							<hr/>
							<p style={{color :"--test"}}>test</p>
							<h3>Debug bedieningspaneel</h3>
							<button onClick={() => {this.ResetQuiz()}}>Reset</button> 
							<button onClick={() => {this.SwitchProgramState("FinishScreen")}}>Naar FinishScreen</button>
						</div>
						: null}
				</TechnicalManager>
			</StatManager>
		); 
	}
	// handy function used all throughout the program to switch the ProgramState and PreviousState variable so that the program adapts based on input
	SwitchProgramState(NewState, StatesShouldMatch = false) {
		this.setState({Transitioning : true});
		this.TransitionPage(TransitionTime);
		setTimeout(() => {
			if (StatesShouldMatch !== true) {
				var OldState = this.state.ProgramState;
				this.setState({ProgramState : NewState, PreviousState : OldState}); 
			}
			else {
				this.setState({ProgramState : NewState, PreviousState : NewState}); 
			}
			this.setState({Transitioning : false});
		}, TransitionTime);
		
	}

	TransitionPage(TransitionTime) {
		this.setState({ShouldShowProgramBody : false});
		setTimeout(() => {
			this.setState({ShouldShowProgramBody : true});
		}, TransitionTime);
	}

	// handles the correct completion of a question
	HandleQuestionComplete(Score) {
		
		this.setState({ShouldShowConffetti : true});
		var QuestionsCompleted = this.state.QuestionsCompleted + 1;

		setTimeout(() => {
			window.localStorage.setItem("TotalPoints", parseInt(window.localStorage.getItem("TotalPoints")) + Score);
			this.setState({ShouldShowConffetti : false});
			this.setState({QuestionsCompleted : this.state.QuestionsCompleted + 1});
			// if all questions have been answered, finish the quiz
			if (QuestionsCompleted === this.state.QuestionList.length && QuestionsCompleted !== 0 ? true : false) {
				this.SwitchProgramState("FinishScreen", true);
				this.setState({CompletedQuiz : true});
			}
			else {
				this.SwitchProgramState("SelectionScreen", true);
			}
		}, 4000);
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
			return;
		}
		// checks if the question has been answered or not
		if (this.state.QuestionList[data.text].Completed === false) {
			this.setState({
				ActiveQuestion: data.text,
				ProgramState : "AnswerScreen",
				Scanning : false, Warning : "",});
		}
		else {
			// error
			this.setState({Warning :"Je hebt deze QR-code al beantwoord!"});
		}	
	}
	// handles errors received from the qr code scanner
	HandleQrCodeError(error) {
		console.log(error);
		this.setState({Scanning : false});
		this.SwitchProgramState("ErrorScreen");
	}	

	// handles the changing of color of the options when answering a question
	UpdateOptionColor(Option, index) {
		var OptionColorList = this.state.OptionColorList;
		if (Option === this.state.QuestionList[this.state.ActiveQuestion].CorrectAnswer) {
			// question answered correctly
			OptionColorList[index] = "#6BCD28";	
		}
		else {
			// question answered wrong
			OptionColorList[index] = "#e14747";
		}
		this.setState({OptionColorList : OptionColorList});
	}
	
	PushLeaderBoard() {
		// statistics to sent to the server
		var Body = {
			method: 'POST',
			headers: {"Content-Type": "text/plain; charset=UTF-8"},
			body: JSON.stringify({
				UserName : this.state.UserName !== "" ? this.state.UserName : "Anoniem",
				TimeSpent : this.state.TimeSpent,
				TotalPoints : parseInt(window.localStorage.getItem("TotalPoints")),
				Uuid : window.localStorage.getItem("UUID")})};
		
		this.setState({SendResults : true}); 
		// sends the Body array to the server
		fetch(import.meta.env.VITE_LeaderboardIP, Body).catch((error) => {console.error('Error:', error);});
	}

	// Saves the program minus the leaderboard
	Save() {
		var StateToSave = {
			StartedQuiz : this.state.StartedQuiz,
			CompletedQuiz : this.state.CompletedQuiz,
			// all variables used for the quiz itself
			QuestionList : this.state.QuestionList,
			QuestionsCompleted : this.state.QuestionsCompleted, 

			// all variables user by the leaderboard functionality
			SendResults : this.state.SendResults,
			UserName : this.state.UserName,
		}
		window.localStorage.setItem("QuizState" , JSON.stringify(StateToSave));
	}
	// runs when the program is ready to run
	componentDidMount() {
	
		// saves the program
		const SaveTimer = setInterval(() => {this.Save();}, 1*1000);
		this.SaveTimerID = SaveTimer;
	}
	// runs when the program is ready to stop
	componentWillUnmount() {
		// lets the timers go
		clearInterval(this.SaveTimerID);
	}
	// resets the program	
	ResetQuiz() {
		// deletes the saved quiz from storage and quickly reloads the page to reset the client side quiz so it begins with a clean slate
		window.localStorage.clear();
		window.location.reload();
	}
}

export default App;
