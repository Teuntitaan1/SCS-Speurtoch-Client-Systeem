// my own components etc
import '../StyleSheets/App.css';
import Leaderboard from './Leaderboard';
import Hintlabel from './Hintlabel';
import Footer from './Footer';
import Header from './Header';

// most program states
import SelectionScreen from './ProgramStates/SelectionScreen';
import DoneQuestionsScreen from './ProgramStates/DoneQuestionsScreen';
import StartScreen from './ProgramStates/StartScreen';
import InfoToAnswerScreen from './ProgramStates/InfoToAnswerScreen';
import FinalScreen from './ProgramStates/FinalScreen';

// library imports
import React from 'react';
import Confetti from 'react-confetti';

// image import
import CompletedQuestionsButton from '../Images/checklist-alt-svgrepo-com.svg';

// audio imports 
var ScannedAudio = new Audio(require('../Audio/ScannedAudio.mp3'));
var QuestionCorrect = new Audio(require('../Audio/QuestionCorrect.mp3'));
var WrongScan = new Audio(require('../Audio/ScannedWrong.mp3'));
var WrongAnswer = new Audio(require('../Audio/WrongAnswer.mp3'));

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

class App extends React.Component {
  
	constructor(props) {
		super(props);

		const QuestionList = require("../Questions.json");
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
				QuestionMode : new Date().getMonth() > 11 || new Date().getMonth() < 4 ? "WinterMode" : "ZomerMode",
				ActiveQuestion : null,
				AnsweredCorrect : false,

				// a list of all the colors all the options should have
				OptionColorList : ["#56a222", "#56a222", "#56a222", "#56a222", "#56a222", "#56a222"],

				QuestionsCompleted : 0, 
				Attemps : 0,
				QuestionsCompletedFirstTime : 0,
				TimeAtQuestion : 0,

				// qr code variables
				Scanning : false,
				// if the warning is a blank string, nothing will render. else it will
				// render the warning/error associated with the qr-code
				Warning : "",

				// all variables user by the leaderboard functionality
				SendResults : false,
				Uuid : crypto.randomUUID(),
				TimeSpent : 0,
				UserName : "",
				TotalPoints : 0,
				Leaderboard : [],
				GotLeaderboard : false,

				// technical properties
				LastVisited : Date.now(),
				ShowGoodJobScreen : true,
				ShouldShowConffetti : false,
				ShouldIncrement : false,
				ShouldShowProgramBody : true
			}
		}
		else {
			if (JSON.parse(window.localStorage.getItem("QuizState")).LastVisited + (1000*60*60*6) > Date.now()) {
				this.state = JSON.parse(window.localStorage.getItem("QuizState"));
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
					<StartScreen OnQuizStart={() => {this.SwitchProgramState("SelectionScreen", true); this.GenerateHint(); navigator.vibrate(10);}}/>
					break;

			case "SelectionScreen":
				programbody =
						<SelectionScreen
							ScanningOff={() => {this.setState({Scanning : false}); navigator.vibrate(10);}}
							ScanningOn={() => {this.setState({Scanning : true}); navigator.vibrate(10);}}
							Warning={this.state.Warning}
							HandleQrCodeScan={this.HandleQrCodeScan}
							HandleQrCodeError={this.HandleQrCodeError}
							Scanning={this.state.Scanning}
							ResetQuiz={() => {this.ResetQuiz();}}
						/>
				break;
			
			case "DoneQuestionsScreen": 
				programbody =
					<DoneQuestionsScreen QuestionList={this.state.QuestionList} QuestionMode={this.state.QuestionMode}/>
				break;
			
			case "AnswerScreen":
				programbody =
					<>
						<div style={{position : 'relative', left : this.state.ShowGoodJobScreen !== true ? 0+"%" : -200+"%",   transition : 'left 1s ease-in-out'}}>
							<h1 style={{fontWeight : 'bold', textAlign : 'center', fontSize : 3.5+"vh"}}>{this.state.QuestionList[this.state.ActiveQuestion].Title}</h1>
							<h2 style={{fontWeight : 100, fontStyle : 'italic', textAlign : 'center', fontSize : 2.5+"vh", marginTop : -1+"vh"}}>{this.state.QuestionList[this.state.ActiveQuestion][this.state.QuestionMode].Description}</h2>
							<div style={{justifyContent : 'center'}}>
							{
							/*Dynamicly loads in the options provided by the question, different questions can have a different amount of answers*/
							this.state.QuestionList[this.state.ActiveQuestion][this.state.QuestionMode].Options.map((Option, index) =>
								<div style={{
									backgroundColor : this.state.OptionColorList[index], marginBottom : 0.1+"rem",
									width : 90+"vw", height : 12+"vh", borderRadius: 1+"rem", transition: 'background-color 0.3s ease-in-out', position : 'relative', left : 3+"vw"}}  key={index} onClick={() => {if (this.state.AnsweredCorrect !== true) {this.ValidateAnswer(Option); this.UpdateOptionColor(Option, index);} navigator.vibrate(10);}}>
									<div style={{borderRadius : 360+"rem", color : "#ffffff", fontSize : 1.5+"rem" , width : 1.5+"rem", height : 1.5+"rem", textAlign : 'center'}}>{index+1}</div>
									<p style={{textAlign : 'center', fontSize : 1+"rem", position : 'relative', top : -2+"vh"}}>{Option}</p>
								</div>
								)
							}
							</div>
							<div style={{display : 'flex', justifyContent : 'center', position : 'relative', top : -72+"vh"}}>
								<h2 style={{fontWeight : 'bold'}}>{this.state.TotalPoints} + {(1000 - (10 * this.state.TimeAtQuestion) - (100 * this.state.Attemps)) > 0 ? (1000 - (10 * this.state.TimeAtQuestion) - (100 * this.state.Attemps)) : 0 } punten</h2>
							</div>

						</div>

						<div style={{position : 'relative', bottom : 70+"vh", left : this.state.ShowGoodJobScreen === true ? 0+"%" : 200+"%",opacity : this.state.ShowGoodJobScreen === true ? 1 : 0 ,transition : 'left 1s ease-in-out, opacity 1700ms ease-in-out',}}>
							<h1 style={{textAlign : 'center'}}>{this.state.TotalPoints} + {(1000 - (10 * this.state.TimeAtQuestion) - (100 * this.state.Attemps)) > 0 ? (1000 - (10 * this.state.TimeAtQuestion) - (100 * this.state.Attemps)) : 0}</h1>
							{this.state.AnsweredCorrect === true ?
							<>
								<p style={{textAlign : 'center'}}>{Math.floor(this.state.TimeSpent) > 0 ? Math.floor(this.state.TimeSpent/60) + `${this.state.TimeSpent/60 > 1 || this.state.TimeSpent/60 === 0 ? " minuut en " : " minuten en "}` : ""}{this.state.TimeSpent % 60} {this.state.TimeSpent % 60 > 1 || this.state.TimeSpent % 60 === 0 ? "seconden" : "seconde" } bezig</p>
								<hr></hr>
								<p style={{textAlign : 'center'}}>{this.state.QuestionsCompletedFirstTime} {this.state.QuestionsCompletedFirstTime > 1 || this.state.QuestionsCompletedFirstTime === 0 ? "vragen" : "vraag"} in 1x goed</p>
								<hr></hr>
								<p style={{textAlign : 'center'}}>Kijk bij <span><img style={{width : 1.5+"rem", height : 1.5+"rem", position : 'relative', top : 1+"vh"}} src={CompletedQuestionsButton} alt='CompletedQuestionsButton'></img></span> om je voortgang te volgen! Hier vind je ook leuke weetjes!</p>
								<hr></hr>
								<h2 style={{textAlign : 'center', fontWeight : 'bold', fontStyle : 'italic'}}>Goed gedaan!</h2>
							</> 
							 : null}
						</div> 
					</>;
				break;
			

			case "InfoToAnswerScreen":
				programbody = <InfoToAnswerScreen InfoToAnswer={this.state.QuestionList[this.state.ActiveQuestion][this.state.QuestionMode].InfoToAnswer}/>
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
									onClick={() => {if (this.state.SendResults !== true) {this.PushLeaderBoard();} else {this.SwitchProgramState("FinalScreen", true); this.setState({ShouldShowConffetti : true});} navigator.vibrate(10);} }>{this.state.SendResults ? "Doorgaan" : this.state.UserName === "" ? "Sla over" : "Verzenden"}</button>
							</div>
						</div>

						<div>
						{
							this.state.GotLeaderboard ? 
								this.state.Leaderboard.length !== 0 ?
									<Leaderboard 
										Leaderboard={this.state.Leaderboard} 
										Uuid={this.state.Uuid} 
										SendResults={this.state.SendResults}/> : <p>Het leaderboard is leeg. Wees de eerste om je score te delen!</p>
							:
							<p>Aan het laden...</p>
						}
						</div>
					</>; 
				break;
			
			case "FinalScreen":
				programbody = 
				<FinalScreen ResetQuiz={() => {this.ResetQuiz();}}/>
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
			<>
				<Header
				 	ToDoneQuestionsScreen={() => {this.SwitchProgramState("DoneQuestionsScreen");}}
					BackToPreviousScreen={() => {this.SwitchProgramState(this.state.PreviousState);}}
					ToInfoToAnswerScreen={() => {this.SwitchProgramState("InfoToAnswerScreen");}}
				   	ProgramState={this.state.ProgramState}
					AnsweredCorrect={this.state.AnsweredCorrect}/>
				
				{/*Hint label on top of the screen and screen state body*/}
				<div style={{marginTop: 11+"vh"}}>
					{this.state.ProgramState === "SelectionScreen" ? 
						<Hintlabel CurrentHint={this.state.CurrentHint}/>
						:
						null}
					<div style={{marginTop : 1+"vh", opacity : this.state.ShouldShowProgramBody ? 1 : 0, transition : `opacity ${TransitionTime}ms ease-in-out`}}>
						{programbody}
					</div>
				</div>
				<Footer
				 	QuestionsCompleted={this.state.QuestionsCompleted} 
					QuestionListLength={this.state.QuestionList.length}/>
				<div style={{position : 'absolute', left : 0+"%", top : 0+"%", opacity : this.state.ShouldShowConffetti === true ? 1 : 0, transition : 'opacity 1s ease-in-out'}}>
					<Confetti/>
				</div>

				{this.props.debugmode === true ?
					<div>
						<hr/>
						<h3>Debug bedieningspaneel</h3>
						<button onClick={() => {this.ResetQuiz()}}>Reset</button> 
						<button onClick={() => {this.SwitchProgramState("FinishScreen")}}>Naar FinishScreen</button>
						<button onClick={() => {navigator.vibrate(1000);}}>Trillen</button>
						<button onClick={() => {QuestionCorrect.play().then(() => {console.log("Sound is playing");})}}>Geluid afspelen</button>

					</div>
					: null}
			</>
		); 
	}
	// handy function used all throughout the program to switch the ProgramState and PreviousState variable so that the program adapts based on input
	SwitchProgramState(NewState, StatesShouldMatch = false) {
		this.TransitionPage(TransitionTime);
		setTimeout(() => {
			if (StatesShouldMatch !== true) {
				var OldState = this.state.ProgramState;
				this.setState({ProgramState : NewState, PreviousState : OldState}); 
			}
			else {
				this.setState({ProgramState : NewState, PreviousState : NewState}); 
			}
		}, TransitionTime);
		
	}

	TransitionPage(TransitionTime) {
		this.setState({ShouldShowProgramBody : false});
		setTimeout(() => {
			this.setState({ShouldShowProgramBody : true});
		}, TransitionTime);
	}

  	ValidateAnswer(Option) {

		var NewQuestionList = this.state.QuestionList;
		// validates the option given by the user and if correct, marks the question as done, also returns to the selection screen
		if (Option === this.state.QuestionList[this.state.ActiveQuestion][this.state.QuestionMode].CorrectAnswer) {
			
			// plays the questioncorrect sound effect
			QuestionCorrect.play();

			// sets the active question to completed
			NewQuestionList[this.state.ActiveQuestion].Completed = true;
			// updates relevant variables
			this.setState({
				QuestionList : NewQuestionList,
				QuestionsCompleted : this.state.QuestionsCompleted + 1,
				AnsweredCorrect : true,
				ShowGoodJobScreen : true,
				QuestionsCompletedFirstTime : this.state.Attemps === 0 ? this.state.QuestionsCompletedFirstTime + 1 : this.state.QuestionsCompletedFirstTime,
				ShouldShowConffetti : true,
				ShouldIncrement : false,
				});
			// generates a new hint since the old one doesnt apply anymore
			this.GenerateHint();
			// cool sequence for the users
			setTimeout(() => {
				// if all questions have been answered, finish the quiz
				if (this.state.QuestionsCompleted === this.state.QuestionList.length && this.state.QuestionsCompleted !== 0 ? true : false) {
					this.PullLeaderBoard();
					this.SwitchProgramState("FinishScreen", true);
				}
				else {
					this.SwitchProgramState("SelectionScreen", true);
				}
				// ensures so that the points dont go into the negatives, the formula is: 1000-(100*Wrong attemps)-(10*time since question has started in seconds)
				var Points = (1000 - (10 * this.state.TimeAtQuestion) - (100 * this.state.Attemps)) > 0 ? (1000 - (10 * this.state.TimeAtQuestion) - (100 * this.state.Attemps)) : 0
				this.setState({TotalPoints : this.state.TotalPoints + Points, ShouldShowConffetti : false});
			}, 4000);			
		}
		else {
			this.setState({Attemps : this.state.Attemps + 1});
			WrongAnswer.play();
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
				WrongScan.play();
			}
			return;
		}
		// checks if the question has been answered or not
		if (this.state.QuestionList[data.text].Completed === false) {
			this.setState({
				ActiveQuestion: data.text,
				ProgramState :"AnswerScreen",
				Scanning : false, Warning : "",
				StartedQuestion : Date.now(),
				OptionColorList : ["#56a222", "#56a222", "#56a222", "#56a222", "#56a222", "#56a222"],
				Attemps : 0,
				AnsweredCorrect : false,
				ShouldShowConffetti : false,
				ShowGoodJobScreen : false, 
				TimeAtQuestion : 0,
				ShouldIncrement : true});
				// succes!
				navigator.vibrate(200);
				ScannedAudio.play();
		}
		else {
			// error
			this.setState({Warning :"Je hebt deze QR-code al beantwoord!"});
			WrongScan.play();
		}	
	}
	// handles errors received from the qr code scanner
	HandleQrCodeError(error) {
		console.log(error);
		this.setState({Scanning : false});
		this.SwitchProgramState("ErrorScreen");
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
	// handles the changing of color of the options when answering a question
	UpdateOptionColor(Option, index) {
		var OptionColorList = this.state.OptionColorList;
		if (Option === this.state.QuestionList[this.state.ActiveQuestion][this.state.QuestionMode].CorrectAnswer) {
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
				CorrectFirstTime : this.state.QuestionsCompletedFirstTime,
				TotalPoints : this.state.TotalPoints,
				Uuid : this.state.Uuid})};
		
		this.setState({SendResults : true}); 
		// sends the Body array to the server
		fetch(this.props.leaderboardip, Body)
			.then(() => {this.PullLeaderBoard();})
				.catch((error) => {console.error('Error:', error);});

	}
	PullLeaderBoard() {
		// gets the leaderboard from the server and displays it on the finishscreen
		fetch(this.props.leaderboardip)
		.then((response) => response.json())
		.then((data) => {this.setState({Leaderboard : data, GotLeaderboard : true}); console.log("Got data!"); });
	}
	// runs when the program is ready to run
	componentDidMount() {
		
		// increments the TimeSpent variable in the program
		const QuizTimer = setInterval(() => {if(this.state.ProgramState === "SelectionScreen" || this.state.ProgramState === "DoneQuestionsScreen" || this.state.ProgramState === "AnswerScreen") {this.setState({TimeSpent : this.state.TimeSpent + 1});}}, 1*1000);
		this.TimerID = QuizTimer;
		// saves the program
		const SaveTimer = setInterval(() => {this.setState({LastVisited : Date.now()}); window.localStorage.setItem("QuizState" , JSON.stringify(this.state));}, 1*1000);
		this.SaveTimerID = SaveTimer;
		// updates the leaderboard
		const LeaderboardTimer = setInterval(() => {if (this.state.ProgramState === "FinishScreen") {this.PullLeaderBoard();}}, 3*1000);
		this.LeaderboardTimerID = LeaderboardTimer;
		const QuestionTimer = setInterval(() => {if (this.state.ProgramState === "AnswerScreen" && this.state.ShouldIncrement === true) {this.setState({TimeAtQuestion : this.state.TimeAtQuestion + 1})};}, 1*1000);
		this.QuestionTimerID = QuestionTimer;
	}
	// runs when the program is ready to stop
	componentWillUnmount() {
		// lets the timers go
		clearInterval(this.TimerID);
		clearInterval(this.SaveTimerID);
		clearInterval(this.LeaderboardTimerID);
		clearInterval(this.QuestionTimerID);
	}
	// resets the program	
	ResetQuiz() {
		// deletes the saved quiz from storage and quickly reloads the page to reset the client side quiz so it begins with a clean slate
		window.localStorage.setItem("QuizState", "");
		window.location.reload();
	}
}

export default App;
