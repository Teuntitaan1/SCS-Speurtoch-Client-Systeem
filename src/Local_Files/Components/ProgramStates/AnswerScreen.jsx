import { useEffect, useState } from "react";

// image import
import CompletedQuestionsButton from '../../Images/checklist-alt-svgrepo-com.svg';
import HintIcon from '../../Images/HintIcon.svg';
import BackArrow from '../../Images/PijlNaarLinks.svg';

export default function AnswerScreen(props) {
    
    // Question variable
    const Question = props.Question;


    // Functional variables
    const [ShowGoodJobScreen, SetShowGoodJobScreen] = useState(false);
    const [AnsweredCorrect, SetAnsweredCorrect] = useState(false);
    const [TimeAtQuestion, SetTimeAtQuestion] = useState(0);
    const [ShouldIncrement, SetShouldIncrement] = useState(true);
    const [OptionColorList, SetOptionColorList] = useState(["#56a222", "#56a222", "#56a222", "#56a222", "#56a222", "#56a222"]);

    // base score and attemps
    const [Score, SetScore] = useState(1000);
    const [Attemps, SetAttempts] = useState(0);

    const [AtHintScreen, SetAtHintScreen] = useState(false);

    // timer functionality
    const [Count, SetCount] = useState(0);
    useEffect(() => {
        const Timer = setInterval(() => {
            if (ShouldIncrement) {
                SetCount(Count + 1);
                SetTimeAtQuestion(TimeAtQuestion + 1);
                SetScore((1000 - (10 * TimeAtQuestion) - (100 * Attemps)) > 0 ? (1000 - (10 * TimeAtQuestion) - (100 * Attemps)) : 0)
            }
        }, 1000);

        return () => {clearInterval(Timer);}
    }, [Count]);

    // Checks the given answer
    function ValidateAnswer(Option, Index) {
		var NewOptionColorList = OptionColorList;
		// validates the option given by the user and if correct, marks the question as done, also returns to the selection screen
		if (Option === Question.CorrectAnswer) {
			OptionColorList[Index] = "#6BCD28";	
            SetAnsweredCorrect(true);
            SetShowGoodJobScreen(true);
            SetShouldIncrement(false);
			// cool sequence for the users
			props.HandleQuestionComplete(Score);		
		}
		else {
			SetAttempts(Attemps + 1);
            NewOptionColorList[Index] = "#e14747";
		}
        SetOptionColorList(NewOptionColorList);
  	}

    return(
        <>
            {!AtHintScreen ? 
            <>
                <div style={{display : 'flex', justifyContent : 'center', position : 'relative', top : -11+"vh", opacity : ShowGoodJobScreen !== true ? 1 : 0, transition : 'opacity 1s ease-in-out'}}>
                    <h2 style={{fontWeight : 'bold'}}>{props.TotalPoints} + {(1000 - (10 * TimeAtQuestion) - (100 * Attemps)) > 0 ? (1000 - (10 * TimeAtQuestion) - (100 * Attemps)) : 0 } punten</h2>
                </div>

                <div style={{position : 'relative', left : ShowGoodJobScreen !== true ? 0+"%" : -200+"%", transition : 'left 1s ease-in-out', top : -7+"vh"}}>

                    <h1 style={{fontWeight : 'bold', textAlign : 'center', fontSize : 3.5+"vh"}}>{Question.Title}</h1>
                    <h2 style={{fontWeight : 100, fontStyle : 'italic', textAlign : 'center', fontSize : 2.5+"vh", marginTop : -1+"vh"}}>{Question.Description}</h2>
                    <div style={{justifyContent : 'center'}}>
                    {
                    /*Dynamicly loads in the options provided by the question, different questions can have a different amount of answers*/
                    Question.Options.map((Option, index) =>
                        <div style={{
                            backgroundColor : OptionColorList[index], marginBottom : 0.1+"rem",
                            width : 90+"vw", height : 12+"vh", borderRadius: 1+"rem", transition: 'background-color 0.3s ease-in-out', position : 'relative', left : 3+"vw"}}  key={index} onClick={() => {if (AnsweredCorrect !== true) {ValidateAnswer(Option, index); }}}>
                            <div style={{borderRadius : 360+"rem", color : "#ffffff", fontSize : 1.5+"rem" , width : 1.5+"rem", height : 1.5+"rem", textAlign : 'center'}}>{index+1}</div>
                            <p style={{textAlign : 'center', fontSize : 1+"rem", position : 'relative', top : -2+"vh"}}>{Option}</p>
                        </div>
                        )
                    }
                    </div>
                    <div style={{justifyContent: "center"}}><img onClick={() => {SetAtHintScreen(true)}} src={HintIcon} alt="InfoToAnswerButton" style={{height: 10+"vh", position: "relative", left: "37%", zIndex : 1000}}/></div>
                    
                </div>

                <div style={{position : 'relative', bottom : 70+"vh", left : ShowGoodJobScreen === true ? 0+"%" : 200+"%",opacity : ShowGoodJobScreen === true ? 1 : 0 ,transition : 'left 1s ease-in-out, opacity 1700ms ease-in-out',}}>
                    <h1 style={{textAlign : 'center'}}>{props.TotalPoints} + {Score}</h1>
                    {AnsweredCorrect === true ?
                    <>
                        <p style={{textAlign : 'center'}}>{Math.floor(props.TimeSpent) > 0 ? Math.floor(props.TimeSpent/60) + `${props.TimeSpent/60 > 1 || props.TimeSpent/60 === 0 ? " minuut en " : " minuten en "}` : ""}{props.TimeSpent % 60} {props.TimeSpent % 60 > 1 || props.TimeSpent % 60 === 0 ? "seconden" : "seconde" } bezig</p>
                        <hr></hr>
                        <p style={{textAlign : 'center'}}>Kijk bij <span><img style={{width : 1.5+"rem", height : 1.5+"rem", position : 'relative', top : 1+"vh"}} src={CompletedQuestionsButton} alt='CompletedQuestionsButton'></img></span> om je voortgang te volgen! Hier vind je ook leuke weetjes!</p>
                        <hr></hr>
                        <h2 style={{textAlign : 'center', fontWeight : 'bold', fontStyle : 'italic'}}>Goed gedaan!</h2>
                    </> 
                        : null}
                </div>
            </> 
                : 
            <> 
                <h2 style={{textAlign : 'center', fontSize : 5+"vh"}}>Wist je dat?</h2>
                <hr></hr>
                <p style={{fontSize : 3.5+"vh"}}>{Question.InfoToAnswer}</p>
                <div style={{justifyContent: "center"}}><img onClick={() => {SetAtHintScreen(false)}} src={BackArrow} alt="BackButton" style={{height: 10+"vh", position: "relative", left: "37%", zIndex : 1000}}/></div>
            </>}
        </>
    );
}