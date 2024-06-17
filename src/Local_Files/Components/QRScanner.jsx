import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

export default function QrReader(props) {
    // QR code variables
    const QRScanner = useRef();
    const VideoElement = useRef(null);
    // Error handling
    const [Error, SetError] = useState(false);

    // Initializes the qr code scanner
    useEffect(() => {
        if (VideoElement.current && !QRScanner.current) {
        // Initiates qr code scanner
        QRScanner.current = new QrScanner(VideoElement.current, props.OnScanSuccess, {
        preferredCamera: "environment",
        highlightCodeOutline: true,});

        // Starts the scanner with error handling
        QRScanner.current.start().catch(() => {SetError(true);});
        }

        // Cleanup
        return () => {
            if (!VideoElement.current) {
            QRScanner.current.stop();
            }
        };
    }, []);

    // Handle no camera permission
    useEffect(() => {
        if (Error) {
            props.OnScanFail()
        }
    }, [Error]);

    // What to render
    return (
        <div style={props.style}>
            <video ref={VideoElement}></video>
        </div>
    );
};
