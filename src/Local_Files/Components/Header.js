import React from 'react';
import '../StyleSheets/App.css';

// image import
import CompletedQuestionsButton from '../Images/checklist-alt-svgrepo-com.svg';
import Logo from '../Images/Archeon logo.png';
import BackArrow from '../Images/PijlNaarLinks.svg';
import ResetButton from '../Images/reset-svgrepo-com.svg';
import ResetButtonRed from '../Images/reset-svgrepo-com-red.svg';
import HintIcon from '../Images/HintIcon.svg';

class Header extends React.Component {
    
	constructor(props) {
		super(props);
		this.state = {
			TimesResetClicked : 0,
		}
	}
	
	render() {
        return (
            <>
               <div style={{backgroundColor : "#56a222", width : 100+"%", height : 10+"vh", position : 'absolute', top : 0+"%", left : 0+"%"}}>
					
					{/*Moves the program back into its previous state*/}
					{(this.props.ProgramState === "AnswerScreen" || this.props.ProgramState === "DoneQuestionsScreen" || this.props.ProgramState === "ErrorScreen" || this.props.ProgramState === "InfoToAnswerScreen") && this.props.AnsweredCorrect !== true ? 
					<img onClick={() => {this.props.BackToPreviousScreen(); navigator.vibrate(10);}} style={{height : 10+"vh", position : 'absolute', left : 0+"%"}} src={BackArrow} alt="A backarrow"/> : null}

					{this.props.ProgramState === "SelectionScreen" || this.props.ProgramState === "StartScreen" || this.props.ProgramState === "FinishScreen" || this.props.ProgramState === "FinalScreen" || (this.props.ProgramState === "AnswerScren" && this.props.AnsweredCorrect === true) ? 
						<img style={{height : 10+"vh", position : 'absolute', left : 0+"%"}} src={this.state.TimesResetClicked > 0 ? ResetButtonRed : ResetButton} alt="resetButton" onClick={() => {if (this.state.TimesResetClicked > 0) {this.props.ResetQuiz();} else {this.setState({TimesResetClicked : this.state.TimesResetClicked + 1}); setTimeout(() => {this.setState({TimesResetClicked : 0})}, 1000)}}}></img> : null}
					{/*Archeon logo*/}
					{this.props.ProgramState !== "AnswerScreen" ?
						<div style={{display : 'flex', justifyContent : 'center', height : 10+"vh", position : 'absolute', width : 50+"%", left : 25+"%"}}>
							<img onClick={() => {window.open('https://www.archeon.nl/index.html', '_blank'); navigator.vibrate(10);}} style={{}} src={Logo} alt="Logo of the archeon website"/>
						</div> 
						:
						null}
					{/*Moves the program to the DoneQuestionsScreen state*/}
					{this.props.ProgramState === "SelectionScreen"  ? 
					<img onClick={() => {this.props.ToDoneQuestionsScreen(); navigator.vibrate(10);}} src={CompletedQuestionsButton} alt="CompletedQuestionsbutton" style={{height: 10+"vh", position : 'absolute', right : 0+"%", bottom : 0+"%"}}/> : null}
					
					{/*Moves the program to the InfoToAnswerScreen state*/}
					{this.props.ProgramState === "AnswerScreen" && this.props.AnsweredCorrect !== true ? 
					<img onClick={() => {this.props.ToInfoToAnswerScreen(); navigator.vibrate(10);}} src={HintIcon} alt="InfoToAnswerButton" style={{height: 10+"vh", position : 'absolute', right : 0+"%", bottom : 0+"%", zIndex : 1000}}/> : null}
				</div>
            </>
        );
    }
}

export default Header;