import { useState, useEffect } from "react";

const Version = import.meta.env.VITE_Version;

// if uuid is null the entire quiz reset.
if (window.localStorage.getItem("Version") === null) {
    window.localStorage.setItem("CompletedQuiz", false);
    window.localStorage.setItem("StartedQuiz", false);
    window.localStorage.setItem("Version", Version);
    window.localStorage.setItem("LastVisited", Date.now());
}


export default function TechnicalManager(props) {
     // timer functionality
     const [Count, SetCount] = useState(0);
     useEffect(() => {
         const Timer = setInterval(() => {
            SetCount(Count + 1);
            window.localStorage.setItem("LastVisited", Date.now());
         }, 1000);
 
         return () => {clearInterval(Timer);}
     }, [Count]);

    return (<>{props.children}</>);
}