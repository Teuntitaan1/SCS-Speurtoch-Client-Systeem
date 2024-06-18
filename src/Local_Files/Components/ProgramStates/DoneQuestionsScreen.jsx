import { useState } from 'react';

export default function DoneQuestionsScreen(props) {
    
    const [ActiveQuestion, SetActiveQuestion] = useState(null);

    function SetActiveQuestionFunction(index) {
        if (index !== null) {
            if (ActiveQuestion !== index) {
                SetActiveQuestion(index);
            }
            else {
                SetActiveQuestion(null);
            }
        }
        else {
            SetActiveQuestion(null);
        }
    }

    return(
        <>
            <div style={{display : 'flex', flexWrap : 'wrap'}}>
                {props.QuestionList.map((Question, index) => 
                    <button key={index} onClick={() => {Question.Completed ? SetActiveQuestionFunction(index) : SetActiveQuestionFunction(null);}} style={{borderRadius : 360+"rem", width : 3+"rem", height : 3+"rem", backgroundColor : Question.Completed ? "#7ed957" : "#a6a6a6", textAlign : 'center', color : "#ffffff"}}>{index+1}</button> 
                )}
            </div>

            <div style={{marginTop : -5+"%", opacity : ActiveQuestion !== null ? 1 : 0, transition : 'opacity 500ms ease-in-out'}}>
               
                {ActiveQuestion !== null ?
                    <>
                        <h2 style={{textAlign : 'center'}}>{props.QuestionList[ActiveQuestion].Description}</h2>
                        <div style={{display : 'flex', flexWrap : 'wrap', justifyContent : 'center'}}>
                            {props.QuestionList[ActiveQuestion].Options.map((Option, index) => 
                                <div key={index} style={
                                    {
                                        backgroundColor : Option === props.QuestionList[ActiveQuestion].CorrectAnswer ? "#7ed957" : "#e14747",
                                        width : 2.5+"rem",
                                        height : 2.5+"rem",
                                        borderRadius : 15+"px",
                                        textAlign : 'center'
                                    }}><p style={{position : 'relative', bottom : 15+"%"}}>{index+1}</p></div>)
                            }
                            
                        </div>
                        
                        <hr></hr>

                        <p><span style={{fontStyle : 'italic', fontWeight : 'bold'}}>{props.QuestionList[ActiveQuestion].CorrectAnswer}</span> was het goede antwoord!</p>
                        
                        <div style={{marginTop : 0+"vh"}}>
                            <h2 style={{textAlign : 'center'}}>Wist je dat?</h2>
                            <p>{props.QuestionList[ActiveQuestion].ExtraInfo}</p>
                        </div>
                    </>
                    : null
                }
            </div>
        </>
    );
};