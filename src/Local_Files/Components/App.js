// my own components etc
import '../StyleSheets/App.css';
import CompletedQuestionsManager from './CompletedQuestionsManager';
import Leaderboard from './Leaderboard';
// library imports
import React from 'react';
import QrReader from 'react-qr-scanner';
import Confetti from 'react-confetti'
// image imports
import QrCodeButton from '../Images/QrCodeButton.svg';
import PartyImage from '../Images/party-popper-svgrepo-com.svg';
import DownButton from '../Images/Pijltje.svg'
import Hintlabel from './Hintlabel';
import Footer from './Footer';
import Header from './Header';

// audio imports 
var ScannedAudio = require('../Audio/ScannedAudio.mp3');
var QuestionCorrect = require('../Audio/QuestionCorrect.mp3');
// ALL POSSIBLE PROGRAM STATES

// 1.StartScreen
// 2.SelectionScreen
// 3.DoneQuestionsScreen
// 4.AnswerScreen
// 5.FinishScreen
// 6.Anything else defaults to the error page

// TODO
// prettify the leaderboard
// improve on making the ui more intuitive to use
// add audio
// grammar check
// prettify the StartScreen

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
					<>
						<h1 style={{textAlign : 'center'}}>{"Welkom bij de bijenspeurtocht!"}</h1>
						<p style={{textAlign : 'center'}}>Loop door het park en beantwoord spannende vragen over leuke bijen te vinden in het Archeon!</p>
						<div style={{display : 'flex', justifyContent : 'center', marginTop : 25+"vh"}}>
							<button onClick={() => {this.SwitchProgramState("SelectionScreen", true);this.GenerateHint();}} style={{backgroundColor : "#457c1f", width : 90+"vw", height : 15+"vh", borderRadius : 1+"rem", fontSize : 3+"rem", color : "#000000"}}>Begin!</button>
						</div>
						
					</>;
					break;

			case "SelectionScreen":
				programbody =
					<>	
						{this.state.Scanning === true ? 
							/*Qr code generator for the non legacy mode users*/
							<div style={{display : 'flex', justifyContent : 'center', flexWrap : 'wrap',  width : 100+"%", height : 20+"rem"}}>
							
								<QrReader 
									delay={0} 
									style={{height: 16+"rem", width: 100+"%", borderRadius : 5+"px"}} 
									onScan={this.HandleQrCodeScan} 
									onError={this.HandleQrCodeError}
								/>

								<button onClick={() => this.setState({Scanning : false})} style={{height: 2+"rem", width: 50+"%", borderRadius : 5+"px", backgroundColor : "#457c1f", color : "#000000"}} >Stop met scannen</button>
								<p style={{color : "red", height : 2+"rem"}}>{this.state.Warning}</p>

							</div>
							:
							/*if not scanning display the image*/
							<div style={{display : 'flex', justifyContent : 'center'}}>
								<img onClick={() => this.setState({Scanning : true})} src={QrCodeButton} alt="Qr code button"
									style={{height: 20+"rem", width: 90+"%"}} />
							</div>

						}
					</>;
				break;
			
			case "DoneQuestionsScreen": 
				programbody =
					<CompletedQuestionsManager QuestionList={this.state.QuestionList} QuestionMode={this.state.QuestionMode}/>
				break;
			
			case "AnswerScreen":
				programbody =
					<>
						<div style={{position : 'relative', left : this.state.ShowGoodJobScreen !== true ? 0+"%" : -200+"%",   transition : 'left 1s ease-in-out'}}>
							<h1 style={{fontWeight : 'bold', textAlign : 'center', fontSize : 4+"vh"}}>{this.state.QuestionList[this.state.ActiveQuestion].Title}</h1>
							<h2 style={{fontWeight : 100, fontStyle : 'italic', textAlign : 'center', fontSize : 3+"vh", marginTop : -1+"vh"}}>{this.state.QuestionList[this.state.ActiveQuestion][this.state.QuestionMode].Description}</h2>
							<div style={{justifyContent : 'center'}}>
							{
							/*Dynamicly loads in the options provided by the question, different questions can have a different amount of answers*/
							this.state.QuestionList[this.state.ActiveQuestion][this.state.QuestionMode].Options.map((Option, index) =>
								<div style={{
									backgroundColor : this.state.OptionColorList[index], marginBottom : 0.1+"rem",
									width : 90+"vw", height : 12+"vh", borderRadius: 1+"rem", transition: 'background-color 0.3s ease-in-out', position : 'relative', left : 3+"vw"}}  key={index} onClick={() => {if (this.state.AnsweredCorrect !== true) {this.ValidateAnswer(Option); this.UpdateOptionColor(Option, index);}}}>
									<div style={{borderRadius : 360+"rem", color : "#ffffff", fontSize : 1.5+"rem" , width : 1.5+"rem", height : 1.5+"rem", textAlign : 'center'}}>{index+1}</div>
									<p style={{textAlign : 'center', fontSize : 1+"rem", position : 'relative', top : -2+"vh"}}>{Option}</p>
								</div>
								)
							}
							</div>
							<div style={{display : 'flex', justifyContent : 'center', marginTop : 0+"vh"}}>
								<img src={DownButton} onClick={() => {this.SwitchProgramState("InfoToAnswerScreen");}} style={{width : 10+"vw", height : 10+"vh"}} alt='DownButton'></img>
							</div>
							<p style={{position : 'absolute', left : 0+"%", bottom : 0+"vh", fontWeight : 'bold'}}>{this.state.TotalPoints} + {(1000 - (10 * this.state.TimeAtQuestion) - (100 * this.state.Attemps)) > 0 ? (1000 - (10 * this.state.TimeAtQuestion) - (100 * this.state.Attemps)) : 0 } punten</p>

						</div>

						<div style={{position : 'relative', bottom : 50+"vh", left : this.state.ShowGoodJobScreen === true ? 0+"%" : 200+"%",opacity : this.state.ShowGoodJobScreen === true ? 1 : 0 ,transition : 'left 1s ease-in-out, opacity 1700ms ease-in-out',}}>
							<h1 style={{textAlign : 'center'}}>{this.state.TotalPoints} + {(1000 - (10 * this.state.TimeAtQuestion) - (100 * this.state.Attemps)) > 0 ? (1000 - (10 * this.state.TimeAtQuestion) - (100 * this.state.Attemps)) : 0}</h1>
							{this.state.AnsweredCorrect === true ?
							<>
								<p style={{textAlign : 'center', fontWeight : 'bold'}}>{Math.floor(this.state.TimeSpent) > 0 ? Math.floor(this.state.TimeSpent/60) + `${this.state.TimeSpent/60 > 1 || this.state.TimeSpent/60 === 0 ? " minuut en " : " minuten en "}` : ""}{this.state.TimeSpent % 60} {this.state.TimeSpent % 60 > 1 || this.state.TimeSpent % 60 === 0 ? "seconden" : "seconde" } bezig</p>
								<hr></hr>
								<p style={{textAlign : 'center', fontWeight : 'bold'}}>{this.state.QuestionsCompletedFirstTime} {this.state.QuestionsCompletedFirstTime > 1 || this.state.QuestionsCompletedFirstTime === 0 ? "vragen" : "vraag"} in 1x goed</p>
								<hr></hr>
								<h2 style={{textAlign : 'center', fontWeight : 'bold', fontStyle : 'italic'}}>Goed gedaan!</h2>
							</> 
							 : null}
						</div> 
					</>;
				break;
			

			case "InfoToAnswerScreen":
				programbody = 
					<>
						<hr></hr>
						<h3 style={{fontSize : 4+"vh"}}>{this.state.QuestionList[this.state.ActiveQuestion][this.state.QuestionMode].InfoToAnswer}</h3>
						<hr></hr>
					</>;
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
								<button style={{backgroundColor : "#56a222", borderRadius : 0.1+"rem", width : 7+"rem", height : 2+"rem"}}
									onClick={() => {if (this.state.SendResults !== true) {this.PushLeaderBoard();} else {this.SwitchProgramState("FinalScreen", true); this.setState({ShouldShowConffetti : true});}}}>{this.state.SendResults ? "Doorgaan" : this.state.UserName === "" ? "Sla over" : "Verstuur resulaten"}</button>
							</div>
						</div>

						<div>
						{
							this.state.GotLeaderboard ? 
								this.state.Leaderboard.length !== 0 ?
									<Leaderboard 
										Leaderboard={this.state.Leaderboard} 
										Uuid={this.state.Uuid} 
										SendResults={this.state.SendResults}/> : <p>Het leaderboard is leeg, wees de eerste!</p>
							:
							<p>Aan het laden...</p>
						}
						</div>
					</>; 
				break;
			
			case "FinalScreen":
				programbody = 
				<>
					<h1 style={{textAlign : 'center', fontSize : 5+"vh"}}>Goed gedaan! Loop naar de kassa, laat dit zien en krijg een cool prijsje!</h1>
					<div style={{display : 'flex', justifyContent : 'center'}}>
						<button style={{backgroundColor : "#56a222", borderRadius : 0.5+"rem", width : 12+"rem", height : 3+"rem"}} onClick={() => {this.ResetQuiz()}}>Ik heb mijn prijs gekregen!</button>
					</div>
					<div style={{display : 'flex', justifyContent : 'center', marginTop : 1+"rem"}}>
						<img src={PartyImage} alt='Goed gedaan!' style={{width : 80+"vw", height : 40+"vh"}}></img>
					</div>
				</>
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
				   	ProgramState={this.state.ProgramState}/>
				
				{/*Hint label on top of the screen and screen state body*/}
				<div style={{marginTop: 11+"vh"}}>
					{/*Hint label*/}
					{this.state.ProgramState === "SelectionScreen" ? 
						<Hintlabel CurrentHint={this.state.CurrentHint}/>
						:
						null}
					
					{/*Main program body*/}	
					<div style={{marginTop : 1+"vh"}}>
						{programbody}
					</div>
				</div>

				{/*Footer of the program*/}
				<Footer
				 	QuestionsCompleted={this.state.QuestionsCompleted} 
					QuestionListLength={this.state.QuestionList.length}/>

				{/*Confetti to be shown all accross the screen*/}
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
						<button onClick={() => {new Audio(QuestionCorrect).play().then(() => {console.log("Sound is playing");})}}>Geluid afspelen</button>

					</div>
					: null}
			</>
		); 
	}
	// handy function used all throughout the program to switch the ProgramState and PreviousState variable so that the program adapts based on input
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
		if (Option === this.state.QuestionList[this.state.ActiveQuestion][this.state.QuestionMode].CorrectAnswer) {
		
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
			// plays the questioncorrect sound effect
			new Audio(QuestionCorrect).play();
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
				navigator.vibrate(100);
				new Audio(ScannedAudio).play();
		}
		else {
			// error
			navigator.vibrate([100,50,100,50,100]);
			this.setState({Warning :"Je hebt deze QR-code al beantwoord!"});
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

		// sends the Body array to the server
		fetch(this.props.leaderboardip, Body)
			.then(() => {this.setState({SendResults : true}); this.PullLeaderBoard();})
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
