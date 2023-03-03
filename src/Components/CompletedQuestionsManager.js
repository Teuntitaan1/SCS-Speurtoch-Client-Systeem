import React from 'react';
import '../StyleSheets/App.css';

class CompletedQuestionsManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ActiveQuestion : null
        }
    }

    SetActiveQuestion(index) {
        if (this.state.ActiveQuestion !== index) {
            this.setState({ActiveQuestion : index});
        }
        else {
            this.setState({ActiveQuestion : null});
        }
    }
    render() {
        return(
            <>
                <div style={{display : 'flex'}}>
                {this.props.QuestionList.map((Question, index) => 
                    <button key={index} onClick={() => {Question.Completed ? this.SetActiveQuestion(index) : console.log("Vraag nog niet beantwoord")}} style={{borderRadius : 360+"rem", width : 3+"rem", height : 3+"rem", backgroundColor : Question.Completed ? "#7ed957" : "#a6a6a6", textAlign : 'center', color : "#ffffff"}}>{index}</button> 
                )}
                </div>
                {this.state.ActiveQuestion !== null ? 
                    <>
                        <h4>{this.props.QuestionList[this.state.ActiveQuestion].Description}</h4>
                        <div style={{display : 'flex'}}>
                        {this.props.QuestionList[this.state.ActiveQuestion].Options.map((Option, index) => 
                            <p key={index} style={
                                {
                                    backgroundColor : Option === this.props.QuestionList[this.state.ActiveQuestion].CorrectAnswer ? "#7ed957" : "#e14747",
                                    width : 2+"rem",
                                    height : 2+"rem",
                                    borderRadius : 360+"rem",
                                    textAlign : 'center'
                                }}>{index}</p>)
                        }
                        </div>
                        <h3>Wist je dat?</h3>
                        <p>{this.props.QuestionList[this.state.ActiveQuestion].ExtraInfo}</p>
                </>
                    :
                    null
                }
            </>
        );
    }
}

export default CompletedQuestionsManager;