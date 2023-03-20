import React from 'react';

class InfoToAnswerScreen extends React.Component {
    render() {
        return(
        <>
            <h2 style={{textAlign : 'center', fontSize : 5+"vh"}}>Wist je dat?</h2>
            <hr></hr>
            <p style={{fontSize : 3.5+"vh"}}>{this.props.InfoToAnswer}</p>
        </>
        );
    }
}

export default InfoToAnswerScreen;