import { useState, useEffect } from "react";
import Leaderboard from "../Leaderboard";

export default function LeaderboardScreen(props) {
    
    const [Username, SetUsername] = useState("");
    const [SendResults, SetSendResults] = useState(false);

    useEffect(() => {
        if (window.localStorage.getItem("Username") !== null) {
            SetUsername(window.localStorage.getItem("Username"));
            SetSendResults(window.localStorage.getItem("SendResults"));
        }

    }, []); 

    function PushLeaderBoard() {
		// statistics to sent to the server
		var Body = {
			method: 'POST',
			headers: {"Content-Type": "text/plain; charset=UTF-8"},
			body: JSON.stringify({
				UserName : Username !== "" ? Username : "Anoniem",
				TimeSpent : parseInt(window.localStorage.getItem("TimeSpent")),
				TotalPoints : parseInt(window.localStorage.getItem("TotalPoints")),
				Uuid : window.localStorage.getItem("UUID")})};
		
		// sends the Body array to the server
		fetch(import.meta.env.VITE_LeaderboardIP, Body).catch((error) => {console.error('Error:', error);}).then(() => {SetSendResults(true);});
	}

    // timer functionality
    const [Count, SetCount] = useState(0);
    useEffect(() => {
        // Saves sendresult and username
        const Save = setInterval(() => {
            SetCount(Count + 1);
            window.localStorage.setItem("Username", Username);
            window.localStorage.setItem("SendResults", SendResults);
        }, 1000);
        return () => {clearInterval(Save);}

    }, [Count]);

    return(
        <>	
            <h2 style={{textAlign : 'center'}}>{"Bekijk je resultaten!"}</h2>
            <div style={{display : 'flex', justifyContent : 'center'}}>
                {SendResults !== true ?
                <input style={{width : 15+"rem", height : 2+"rem", fontSize : 1.2+"rem", borderTopStyle : 'hidden', borderRightStyle : 'hidden', borderLeftStyle : 'hidden'}}
                    type={'text'} onChange={(event) => {SetUsername(event.target.value)}} value={Username}/> : null}
                <button style={{backgroundColor : "#56a222", color : "#000000", borderRadius : 0.1+"rem", width : 7+"rem", height : 2+"rem"}}
                    onClick={() => {if(!SendResults) {PushLeaderBoard();} else {props.SwitchProgramState("FinalScreen", true);}}}>Verzenden</button>
            </div>

            <Leaderboard/>
        </>
    );
};