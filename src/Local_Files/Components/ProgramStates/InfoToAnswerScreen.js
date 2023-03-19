import React from 'react';

class InfoToAnswerScreen extends React.Component {
    render() {
        return(
        <>
            <hr></hr>
            <h3 style={{fontSize : 4+"vh"}}>{this.props.InfoToAnswer}</h3>
            <hr></hr>
        </>
        );
    }
}

export default InfoToAnswerScreen;