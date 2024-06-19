import { useState, useEffect } from "react";

var UUID = crypto.randomUUID();

export default function StatManager(props) {

    const [TimeSpent, SetTimeSpent] = useState(0);

    useEffect(() => {
        // Saving functionality
        if (window.localStorage.getItem("UUID") !== null ) {
            SetTimeSpent(window.localStorage.getItem("TimeSpent"));
            UUID = window.localStorage.getItem("UUID");
        }
        else {
            window.localStorage.setItem("TotalPoints", 0);
        }
    }, []);

    function Save() {
        window.localStorage.setItem("TimeSpent", TimeSpent);
        window.localStorage.setItem("UUID", UUID);
    }

     // timer functionality
     const [Count, SetCount] = useState(0);
     useEffect(() => {
         const Timer = setInterval(() => {
            SetCount(Count + 1);
            SetTimeSpent(TimeSpent + 1);
            Save();
         }, 1000);
 
         return () => {clearInterval(Timer);}
     }, [Count]);


    return (<>{props.children}</>);
}