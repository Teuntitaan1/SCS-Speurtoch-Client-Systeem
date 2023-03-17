import React from 'react';
import '../StyleSheets/App.css';

// image imports
import HintIcon from '../Images/HintIcon.svg';

class Hintlabel extends React.Component {
    render() {
        return (
            <>
                <div style={{backgroundColor : "#457c1f", width : 100+"%", height : 3.5+"rem", borderRadius : 1+"rem", display : 'flex'}}>
                    <img src={HintIcon} alt='Hint icon' style={{width : 3+"rem", height : 3.5+"rem"}}></img>
                    <p style={{ textAlign : 'center', fontSize : 1.1+"rem", position : 'relative', bottom : 0.5+"rem"}}>{this.props.CurrentHint}</p>
                    </div>
            </>
        );
    }
}

export default Hintlabel;