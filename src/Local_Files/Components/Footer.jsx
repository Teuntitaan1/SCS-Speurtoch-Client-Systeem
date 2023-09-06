import '../StyleSheets/App.css';

export default function Footer(props) {
    return(
        <>
            <div style={{backgroundColor : "#56a222", width : 100+"%", height : 8+"vh", position : 'absolute', bottom : 0+"%", left : props.ProgramState !== "StartScreen" ? 0+"%" : -100+"%", transition : 'left 500ms ease-in-out'}}>
                
                {/*Progress bar*/}
                <div style={{width : 100+"%", height : 75+"%", position : 'absolute', bottom : 3.5+"vh"}}>
                    <div style={{backgroundColor : 'green', height : 100+"%", width : (props.QuestionsCompleted * (100 / props.QuestionListLength))+"%", transition: 'width 1s ease-in-out', borderRadius : 5+"px"}}>
                        <p style={{fontWeight : 'bold', textAlign : 'end', position : 'relative', top : 30+"%"}}>{props.QuestionsCompleted}/{props.QuestionListLength}</p>
                    </div>
                </div>

            </div>
        </>);
};
