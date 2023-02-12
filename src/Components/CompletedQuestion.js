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
			<div>
				<h3>{this.props.Question.Title}</h3>
                {this.state.Expanded === true ? 
                    <>
                        <h4>{this.props.Question.Description}</h4>
                        <ul>
                            {
                                this.props.Question.Options.map((Option, index) => 
                                Option === this.props.Question.CorrectAnswer ?
                                <li style={{color : 'green'}}key={index}>{Option}</li> : 
                                <li key={index}>{Option}</li>)
                            }
                        </ul>

                        <h3>Wist je dat?</h3>
                        <p>{this.props.Question.ExtraInfo}</p>
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