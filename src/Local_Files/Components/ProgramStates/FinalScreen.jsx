// image imports
import PartyImage from '../../Images/party-popper-svgrepo-com.svg';

export default function FinalScreen(props) {
    return( 
    <>
        <h1 style={{textAlign : 'center', fontSize : 4+"vh"}}>Goed gedaan! Loop naar de kassa, laat dit zien en krijg een cool prijsje!</h1>
        <p>Heb je verbeterpunten voor deze speurtocht of wil je gewoon je mening kwijt? klik dan op <a href='https://forms.gle/8rNUsFQGhMDpVgX77' target='_blank' rel='noreferrer'>deze link</a> en vul de enquete in!</p>
        <div style={{display : 'flex', justifyContent : 'center'}}>
            <button style={{backgroundColor : "#56a222", color : "#000000", borderRadius : 0.5+"rem", width : 12+"rem", height : 3+"rem"}} onClick={() => {props.ResetQuiz(); navigator.vibrate(10);}}>Ik heb mijn prijs gekregen!</button>
        </div>
        <div style={{display : 'flex', justifyContent : 'center'}}>
            <img src={PartyImage} alt='Goed gedaan!' style={{width : 80+"vw", height : 40+"vh"}}></img>
        </div>
    </>);
};