import {useState} from 'react';

// image import
import CompletedQuestionsButton from '../Images/checklist-alt-svgrepo-com.svg';
import Logo from '../Images/Archeon logo.png';
import BackArrow from '../Images/PijlNaarLinks.svg';
import ResetButton from '../Images/reset-svgrepo-com.svg';
import ResetButtonRed from '../Images/reset-svgrepo-com-red.svg';

export default function Header(props) {

	const [TimesResetClicked, SetTimesResetClicked] = useState(0);

	return(
		<>
			<div style={{backgroundColor : "#56a222", width : 100+"%", height : 10+"vh", position : 'absolute', top : 0+"%", left : 0+"%"}}>
						
			{/*Moves the program back into its previous state*/}
			{(props.ProgramState === "AnswerScreen" || props.ProgramState === "DoneQuestionsScreen" || props.ProgramState === "ErrorScreen" || props.ProgramState === "InfoToAnswerScreen") && props.ActiveQuestion === null ? 
			<img onClick={() => {props.SwitchProgramState(props.PreviousState, false);}} style={{height : 10+"vh", position : 'absolute', left : 0+"%"}} src={BackArrow} alt="A backarrow"/> : null}

			{props.ProgramState === "SelectionScreen" || props.ProgramState === "StartScreen" || props.ProgramState === "FinishScreen" || props.ProgramState === "FinalScreen" || (props.ProgramState === "AnswerScreen") && props.ActiveQuestion === null ? 
				<img style={{height : 10+"vh", position : 'absolute', left : 0+"%"}} src={TimesResetClicked > 0 ? ResetButtonRed : ResetButton} alt="resetButton" onClick={() => {if (TimesResetClicked > 0) {props.ResetQuiz();} else {SetTimesResetClicked(TimesResetClicked + 1); setTimeout(() => {SetTimesResetClicked(0)}, 1000)}}}></img> : null}
			{/*Archeon logo*/}
			{props.ProgramState !== "AnswerScreen" ?
				<div style={{display : 'flex', justifyContent : 'center', height : 10+"vh", position : 'absolute', width : 50+"%", left : 25+"%"}}>
					<img onClick={() => {window.open('https://www.archeon.nl/index.html', '_blank');}} style={{}} src={Logo} alt="Logo of the archeon website"/>
				</div> 
				:
				null}
			{/*Moves the program to the DoneQuestionsScreen state*/}
			{props.ProgramState === "SelectionScreen"  ? 
			<img onClick={() => {props.SwitchProgramState("DoneQuestionsScreen" ,false);}} src={CompletedQuestionsButton} alt="CompletedQuestionsbutton" style={{height: 10+"vh", position : 'absolute', right : 0+"%", bottom : 0+"%"}}/> : null}
			
		</div>
	</>
	);
};