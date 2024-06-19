import { useState, useEffect } from "react";


// if uuid is null the entire quiz reset.
if (window.localStorage.getItem("UUID") === null) {
    window.localStorage.setItem("UUID", crypto.randomUUID());
    window.localStorage.setItem("TimeSpent", 0);
    window.localStorage.setItem("QuestionsCompleted", 0);
    window.localStorage.setItem("TotalPoints", 0);
}


export default function StatManager(props) {

     // updates stats.
     const [Count, SetCount] = useState(0);
     useEffect(() => {
         const Timer = setInterval(() => {
            window.localStorage.setItem("TimeSpent", parseInt(window.localStorage.getItem("TimeSpent")) + 1);
            SetCount(Count + 1);
         }, 1000);
 
         return () => {clearInterval(Timer);}
     }, [Count]);


    return (<>{props.children}</>);
}