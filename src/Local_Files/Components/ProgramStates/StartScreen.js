import React from "react";

// image imports
import QrCodeScannerImage from '../../Images/QrCodeButton.svg';
import HintIcon from '../../Images/HintIcon.svg';
import CheckListIcon from '../../Images/checklist-alt-svgrepo-com.svg';
import SoundOnIcon from '../../Images/sound-loud-svgrepo-com.svg';

class StartScreen extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            Loaded : false
        }
    }

    render() {
        return(
            <div style={{position : 'relative', left : this.state.Loaded ? 0+"%" : -200+"%", transition : 'left 1s ease-in-out', textAlign : "center"}}>
                
                <div style={{textAlign : "center"}}>
                    <h1 style={{fontSize : 3.5+"vh"}}>Hé bezzzzig bijtje!</h1>
                    <p style={{fontSize : 2+"vh"}}>Welkom bij deze supercoole speurtocht! beantwoord mijn vragen en kom veel te weten over mijn soorten!</p>
                </div>

                <div style={{display : "flex", flexWrap : "wrap", flexDirection : "row", textAlign : "left", fontStyle : "italic", fontWeight : "bold", fontSize : 2+"vh"}}>
                    <div style={{display : "flex", width : 100+"%"}}>
                        <img src={SoundOnIcon} alt="InstructionIcon" style={{width : 10+"vw", height : 10+"vh"}}/>
                        <p>Zet je telefoon op trillen en zet je geluid aan! Zo kun je de speurtocht namelijk beter maken.</p>
                    </div>
                    <div style={{display : "flex", width : 100+"%"}}>
                        <img src={QrCodeScannerImage} alt="InstructionIcon" style={{width : 10+"vw", height : 10+"vh"}}/>
                        <p>Heb je een bordje gevonden? Scan dan de qr-code door op het icoontje te drukken, dan kun je de vraag beantwoorden!</p>
                    </div>
                    <div style={{display : "flex", width : 100+"%"}}>
                        <img src={HintIcon} alt="InstructionIcon" style={{width : 10+"vw", height : 10+"vh"}}/>
                        <p>Bovenaan zie je de hint naar een bordje in de buurt, heb je onderweg een ander bordje gevonden? Dan kun je deze ook gewoon scannen.</p>
                    </div>
                    <div style={{display : "flex", width : 100+"%"}}>
                        <img src={CheckListIcon} alt="InstructionIcon" style={{width : 10+"vw", height : 10+"vh"}}/>
                        <p>Wil je zien hoe ver je bent of wil je wel wat meer weten over de bijen en zijn soorten? Druk op het knopje rechtsbovenin om je voortgang te bekijken.</p>
                    </div>
                </div>

                <div style={{display : 'flex', justifyContent : 'center'}}>
                    <button onClick={() => {this.props.OnQuizStart();}} style={{backgroundColor : "#457c1f", width : 90+"vw", height : 7+"vh", borderRadius : 1+"rem", fontSize : 4+"vh", color : "#000000"}}>Begin!</button>
                </div>

            </div>);
    }

    componentDidMount() {
        setTimeout(() => {this.setState({Loaded : true});}, 500);
    }
}
export default StartScreen;