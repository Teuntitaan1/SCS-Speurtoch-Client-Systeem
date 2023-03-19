import React from "react";
import QrReader from 'react-qr-scanner';

// image imports
import QrCodeButton from '../../Images/QrCodeButton.svg';

class SelectionScreen extends React.Component {
    render() {
        return(
            <>	
                {this.props.Scanning === true ? 
                    <div style={{display : 'flex', justifyContent : 'center', flexWrap : 'wrap',  width : 100+"%", height : 20+"rem"}}>
                    
                        <QrReader 
                            delay={0} 
                            style={{height: 16+"rem", width: 100+"%", borderRadius : 5+"px"}} 
                            onScan={this.props.HandleQrCodeScan} 
                            onError={this.props.HandleQrCodeError}
                        />

                        <button onClick={() => {this.props.ScanningOff();}} style={{height: 2+"rem", width: 50+"%", borderRadius : 5+"px", backgroundColor : "#457c1f", color : "#000000"}} >Stop met scannen</button>
                        <p style={{color : "red", height : 2+"rem"}}>{this.props.Warning}</p>

                    </div>
                    :
                    /*if not scanning display the image*/
                    <div style={{display : 'flex', justifyContent : 'center'}}>
                        <img onClick={() => {this.props.ScanningOn();}} src={QrCodeButton} alt="Qr code button"
                            style={{height: 20+"rem", width: 90+"%"}} />
                    </div>

                }
			</>
        );
    }   
}

export default SelectionScreen;