import React from "react";

class StartScreen extends React.Component {
    render() {
        return(
            <>
                <h1 style={{textAlign : 'center'}}>Welkom bij de bijenspeurtocht!</h1>
                <p style={{textAlign : 'center'}}>Loop door het park en beantwoord spannende vragen over leuke bijen te vinden in het Archeon!</p>
                <div style={{display : 'flex', justifyContent : 'center', marginTop : 25+"vh"}}>
                    <button onClick={() => {this.props.OnQuizStart();}} style={{backgroundColor : "#457c1f", width : 90+"vw", height : 12+"vh", borderRadius : 1+"rem", fontSize : 3+"rem", color : "#000000"}}>Begin!</button>
                </div>
            </>);
    }
}
export default StartScreen;