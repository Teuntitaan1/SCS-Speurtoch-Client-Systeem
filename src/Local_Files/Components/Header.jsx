import {useState} from 'react';

// image import
import CompletedQuestionsButton from '../Images/checklist-alt-svgrepo-com.svg';
import Logo from '../Images/Archeon logo.png';
import BackArrow from '../Images/PijlNaarLinks.svg';
import ResetButton from '../Images/reset-svgrepo-com.svg';
import ResetButtonRed from '../Images/reset-svgrepo-com-red.svg';
import HintIcon from '../Images/HintIcon.svg';

export default function Header(props) {

	const [TimesResetClicked, SetTimesResetClicked] = useState(0);

	return(
		<>
			<div style={{backgroundColor : "#56a222", width : 100+"%", height : 10+"vh", position : 'absolute', top : 0+"%", left : 0+"%"}}>
						
			{/*Moves the program back into its previous state*/}
			{(props.ProgramState === "AnswerScreen" || props.ProgramState === "DoneQuestionsScreen" || props.ProgramState === "ErrorScreen" || props.ProgramState === "InfoToAnswerScreen") && props.AnsweredCorrect !== true ? 
			<img onClick={() => {if(props.Transitioning !== true){props.BackToPreviousScreen();} navigator.vibrate(10);}} style={{height : 10+"vh", position : 'absolute', left : 0+"%"}} src={BackArrow} alt="A backarrow"/> : null}

			{props.ProgramState === "SelectionScreen" || props.ProgramState === "StartScreen" || props.ProgramState === "FinishScreen" || props.ProgramState === "FinalScreen" || (props.ProgramState === "AnswerScren" && props.AnsweredCorrect === true) ? 
				<img style={{height : 10+"vh", position : 'absolute', left : 0+"%"}} src={TimesResetClicked > 0 ? ResetButtonRed : ResetButton} alt="resetButton" onClick={() => {if (TimesResetClicked > 0) {props.ResetQuiz();} else {SetTimesResetClicked(TimesResetClicked + 1); setTimeout(() => {SetTimesResetClicked(0)}, 1000)}}}></img> : null}
			{/*Archeon logo*/}
			{props.ProgramState !== "AnswerScreen" ?
				<div style={{display : 'flex', justifyContent : 'center', height : 10+"vh", position : 'absolute', width : 50+"%", left : 25+"%"}}>
					<img onClick={() => {window.open('https://www.archeon.nl/index.html', '_blank'); navigator.vibrate(10);}} style={{}} src={Logo} alt="Logo of the archeon website"/>
				</div> 
				:
				null}
			{/*Moves the program to the DoneQuestionsScreen state*/}
			{props.ProgramState === "SelectionScreen"  ? 
			<img onClick={() => {if(props.Transitioning !== true){props.ToDoneQuestionsScreen();} navigator.vibrate(10);}} src={CompletedQuestionsButton} alt="CompletedQuestionsbutton" style={{height: 10+"vh", position : 'absolute', right : 0+"%", bottom : 0+"%"}}/> : null}
			
			{/*Moves the program to the InfoToAnswerScreen state*/}
			{props.ProgramState === "AnswerScreen" && props.AnsweredCorrect !== true ? 
			<img onClick={() => {if(props.Transitioning !== true){props.ToInfoToAnswerScreen();} navigator.vibrate(10);}} src={HintIcon} alt="InfoToAnswerButton" style={{height: 10+"vh", position : 'absolute', right : 0+"%", bottom : 0+"%", zIndex : 1000}}/> : null}
		</div>
	</>
	);
};