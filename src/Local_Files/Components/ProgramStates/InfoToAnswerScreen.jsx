export default function InfoToAnswerScreen(props) {
    return(
        <>
            <h2 style={{textAlign : 'center', fontSize : 5+"vh"}}>Wist je dat?</h2>
            <hr></hr>
            <p style={{fontSize : 3.5+"vh"}}>{props.InfoToAnswer}</p>
        </>
        );
};