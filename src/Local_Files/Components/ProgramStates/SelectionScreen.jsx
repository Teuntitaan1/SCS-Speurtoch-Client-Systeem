import QrReader from 'react-qr-scanner-teun';
// image imports
import QrCodeButton from '../../Images/QrCodeButton.svg';

export default function SelectionScreen(props) {
    return(
        <>	
            {props.Scanning === true ? 
                <div style={{display : 'flex', justifyContent : 'center', flexWrap : 'wrap',  width : 100+"%", height : 20+"rem"}}>
                    
                    <QrReader 
                        constraints={{ video: { facingMode: "environment" }}} 
                        delay={0} onScan={props.HandleQrCodeScan} 
                        onError={props.HandleQrCodeError} 
                        style={{height: 16+"rem", width: 100+"%", borderRadius : 5+"px"}} 
                    />

                    <button onClick={() => {props.ScanningOff();}} style={{height: 2+"rem", width: 50+"%", borderRadius : 5+"px", backgroundColor : "#457c1f", color : "#000000", marginTop : -1+"vh"}} >Stop met scannen</button>
                    <p style={{color : "red", height : 2+"rem"}}>{props.Warning}</p>

                </div>
                :
                /*if not scanning display the image*/
                <div style={{display : 'flex', justifyContent : 'center'}}>
                    <img onClick={() => {props.ScanningOn();}} src={QrCodeButton} alt="Qr code button"
                        style={{height: 20+"rem", width: 90+"%"}} />
                </div>
            }
        </>
    );
};