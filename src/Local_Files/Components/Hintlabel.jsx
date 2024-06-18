// image imports
import HintIcon from '../Images/HintIcon.svg';

export default function HintLabel(props) {
    return (
        <>
            <div style={{backgroundColor : "#457c1f", width : 100+"%", height : 3.5+"rem", borderRadius : 1+"rem", display : 'flex'}}>
                <img src={HintIcon} alt='Hint icon' style={{width : 3+"rem", height : 3.5+"rem"}}></img>
                <p style={{ textAlign : 'center', fontSize : 1.1+"rem", position : 'relative', bottom : 0.5+"rem"}}>{props.CurrentHint}</p>
            </div>
        </>
    );
}