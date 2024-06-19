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
import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

// image import
import AnswerScreen from './ProgramStates/AnswerScreen';
import StatManager from './Managers/StatManager';
import TechnicalManager from './Managers/TechnicalManager';
import LeaderboardScreen from './ProgramStates/LeaderboardScreen';


// program variables
var TransitionTime = 200;

// ALL POSSIBLE PROGRAM STATES

// 1.StartScreen
// 2.SelectionScreen
// 3.DoneQuestionsScreen
// 4.AnswerScreen
// 5.FinishScreen
// 7.LeaderboardScreen
// 8.Anything else defaults to the error page

// TODO
// prettify the StartScreen / add instruction for the program
// rewrite css styling
// rewrite json functionality(server side?)
// rewrite server functionality

export default function App(props) {
	// State =>>
	const [ProgramState, NewProgramState] = useState("StartScreen");
	const [PreviousProgramState, NewPreviousProgramState] = useState("StartScreen");
	// State of the quiz itself
	const [QuizState, SetQuizState] = useState(QuestionList);
	// Active Question
	const [ActiveQuestion, SetActiveQuestion] = useState(null);
	// qr code variables
	// if the warning is a blank string, nothing will render. else it will
	// render the warning/error associated with the qr-code
	const [Warning, SetWarning] = useState("");

	// Technical stuff
	const [ShouldShowConffetti, SetShouldShowConffetti] = useState(false);
	const [ShouldShowProgramBody, SetShouldShowProgramBody] = useState(true);
	
	// Programbody Code
	const [Programbody, SetProgrambody] = useState(<></>);

	// Pulling from storage
	useEffect(() => {
		// Loads the quiz to the correct state
		if (window.localStorage.getItem("QuizState") !== null) {
			SetQuizState(JSON.parse(window.localStorage.getItem("QuizState")));

			if (window.localStorage.getItem("CompletedQuiz") === true) {
				NewProgramState("LeaderboardScreen");
				NewPreviousProgramState("LeaderboardScreen");
			}
			else {
				// reverts back to the homescreen
				NewProgramState("SelectionScreen");
				NewPreviousProgramState("SelectionScreen");
			}
		}

	}, []);

	// Programbody determination code
	useEffect(() => {
		switch (ProgramState) {

			// loops through all possible program states and determines what to render, no hassle with css styles and its much more efficient
			case "StartScreen":
				SetProgrambody(
					<StartScreen OnQuizStart={() => {SwitchProgramState("SelectionScreen", true); window.localStorage.setItem("StartedQuiz", true);}}/>);
				break;

			case "SelectionScreen":
				SetProgrambody(
					<SelectionScreen
						Warning={Warning}
						HandleQrCodeScan={HandleQrCodeScan}
						HandleQrCodeError={HandleQrCodeError}
						ResetQuiz={() => {ResetQuiz();}}
					/>);
				break;
			
			case "DoneQuestionsScreen": 
				SetProgrambody(
					<DoneQuestionsScreen/>);
				break;
			
			case "AnswerScreen":
				SetProgrambody(
					<AnswerScreen
					ActiveQuestion={ActiveQuestion}
					HandleQuestionComplete={(Score) => {HandleQuestionComplete(Score)}}/>);
				break;

			case "LeaderboardScreen":
			
				SetProgrambody(
					<LeaderboardScreen SwitchProgramState={(State, ShouldMatch) => {SwitchProgramState(State, ShouldMatch);}}/>);
				break;
			
			case "FinalScreen":
				SetProgrambody(
					<FinalScreen ResetQuiz={() => {ResetQuiz();}}/>);
				break;

			default:
				SetProgrambody(
					<>
						<h1>Error... er is iets fout gegaan!</h1>
						<h2>Mogelijk heb je geen toegang gegeven tot de camera?</h2>
						<p>Klik op de terugknop en probeer het nog een keer!</p>
					</>);
				break;
		}
	
	}, [ProgramState]);

	// timer functionality
	const [Count, SetCount] = useState(0);
	// Saves the QuizState
	useEffect(() => {
		const Timer = setInterval(() => {
		   SetCount(Count + 1);
		   window.localStorage.setItem("QuizState" , JSON.stringify(QuizState));
		}, 1000);

		return () => {clearInterval(Timer);}
	}, [Count]);

	// handy function used all throughout the program to switch the ProgramState and PreviousState variable so that the program adapts based on input
	function SwitchProgramState(NewState, StatesShouldMatch = false) {
		TransitionPage(TransitionTime);
		setTimeout(() => {
			if (StatesShouldMatch !== true) {
				var OldState = ProgramState;
				NewProgramState(NewState);
				NewPreviousProgramState(OldState);
			}
			else {
				NewProgramState(NewState);
				NewPreviousProgramState(NewState);
			}
		}, TransitionTime);
		
	}

	function TransitionPage(TransitionTime) {
		SetShouldShowProgramBody(false);
		setTimeout(() => {
			SetShouldShowProgramBody(true);
		}, TransitionTime);
	}

	// handles the correct completion of a question
	function HandleQuestionComplete(Score) {
		
		SetShouldShowConffetti(true);

		setTimeout(() => {
			window.localStorage.setItem("TotalPoints", parseInt(window.localStorage.getItem("TotalPoints")) + Score);
			this.setState({ShouldShowConffetti : false});
			window.localStorage.setItem("QuestionsCompleted", parseInt(window.localStorage.getItem("QuestionsCompleted")) + 1);
			// if all questions have been answered, finish the quiz
			if (parseInt(window.localStorage.getItem("QuestionsCompleted")) === QuizState.length && parseInt(window.localStorage.getItem("QuestionsCompleted")) !== 0 ? true : false) {
				SwitchProgramState("LeaderboardScreen", true);
				window.localStorage.setItem("CompletedQuiz", true);
			}
			else {
				SwitchProgramState("SelectionScreen", true);
			}
		}, 4000);
	}

  	// handles all Qr-code code
  	function HandleQrCodeScan(data) {
		// validates data
		if (data === null || QuizState[data.text] === undefined) {
			if (data == null) { SetWarning(""); } 
			else { SetWarning("Deze QR-code is niet geldig, probeer een andere!"); }
			return;
		}
		// checks if the question has been answered or not
		if (QuizState[data.text].Completed === false) {
			
			//// HIER ZIT ERGENS EEN BUG
			SetActiveQuestion(data.text);
			NewProgramState(AnswerScreen);
			SetWarning("");
		}
		else {
			// error
			SetWarning("Je hebt deze QR-code al beantwoord!");
		}	
	}
	// handles errors received from the qr code scanner
	function HandleQrCodeError(error) {
		console.log(error);
		SetScanning(false);
		SwitchProgramState("ErrorScreen", false);
	}	

	// resets the program	
	function ResetQuiz() {
		// deletes the saved quiz from storage and quickly reloads the page to reset the client side quiz so it begins with a clean slate
		window.localStorage.clear();
		window.location.reload();
	}

   return (
		<StatManager>
			<TechnicalManager>
				<Header
					PreviousState={PreviousProgramState}
					ProgramState={ProgramState}
					SwitchProgramState={(State, ShouldMatch) => {SwitchProgramState(State, ShouldMatch);}}
					ActiveQuestion={ActiveQuestion}
					ResetQuiz={() => {ResetQuiz();}}/>
				
				{/*screen state body*/}
				<div style={{marginTop: 11+"vh"}}>
					<div style={{marginTop : 1+"vh", opacity : ShouldShowProgramBody ? 1 : 0, transition : `opacity ${TransitionTime}ms ease-in-out`}}>
						{Programbody}
					</div>
				</div>
				<Footer
					QuestionListLength={QuizState.length}
					ProgramState={ProgramState}/>
				<div style={{position : 'absolute', left : 0+"%", top : 0+"%", opacity : ShouldShowConffetti === true ? 1 : 0, transition : 'opacity 1s ease-in-out'}}>
					<Confetti/>
				</div>

				{props.debugmode === true ?
					<div>
						<hr/>
						<h3>Debug bedieningspaneel</h3>
						<button onClick={() => {ResetQuiz()}}>Reset</button> 
						<button onClick={() => {SwitchProgramState("LeaderboardScreen")}}>Naar EindScreen</button>
					</div>
					: null}
			</TechnicalManager>
		</StatManager>
	);
}
