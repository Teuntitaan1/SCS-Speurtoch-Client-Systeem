import React from 'react';
import '../StyleSheets/App.css';

class Footer extends React.Component {
    render() {
        return (
            <>
                <div style={{backgroundColor : "#56a222", width : 100+"%", height : 12+"vh", position : 'absolute', bottom : 0+"%", left : 0+"%"}}>
					
					{/*Progress bar*/}
					<div style={{width : 100+"%", height : 75+"%", position : 'absolute', bottom : 4.5+"vh"}}>
						<div style={{backgroundColor : 'green', height : 100+"%", width : (this.props.QuestionsCompleted * (100 / this.props.QuestionListLength))+"%", transition: 'width 1s ease-in-out', borderRadius : 5+"px"}}>
							<p style={{fontWeight : 'bold', textAlign : 'end', position : 'relative', top : 30+"%"}}>{this.props.QuestionsCompleted}/{this.props.QuestionListLength}</p>
						</div>
					</div>

				</div>
            </>
        );
    }
}

export default Footer;