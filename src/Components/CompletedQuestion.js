import React from 'react';
import '../StyleSheets/App.css';

class CompletedQuestion extends React.Component {
	
    constructor (props){
        super(props);
        this.state = {
            Expanded : false
        }
    }

    render() {
		return(
			<div className='CompletedQuestionDiv'>
				<h3 className='CompletedQuestionTitle'>{this.props.Question["Title"]}</h3>
                {this.state.Expanded === true ? 
                    <>
                        <h4 className='CompletedQuestionDescription'>{this.props.Question["Description"]}</h4>
                        <ul>
                            {
                                this.props.Question["Options"].map((Option, index) => 
                                Option === this.props.Question["CorrectAnswer"] ?
                                <li key={index} className='CorrectAnswer'>{Option}</li> : 
                                <li key={index} className='IncorrectAnswer'>{Option}</li>)
                            }
                        </ul>

                        <h3>Wist je dat?</h3>
                        <p className='ExtraInfo'>{this.props.Question["ExtraInfo"]}</p>
                    </>
                
                    :
                    null
                }
                <button onClick={() => {this.setState({Expanded : !this.state.Expanded})}}>{this.state.Expanded !== true ? "Uitvouwen" : "Invouwen"}</button>
			</div>
		);
	}
} 

export default CompletedQuestion;