import { useState, useEffect } from "react";

const Version = import.meta.env.VITE_Version;

export default function TechnicalManager(props) {

    const [LastVisited, SetLastVisited] = useState(Date.now());

    function Save() {
        window.localStorage.setItem("LastVisited", LastVisited);
        window.localStorage.setItem("Version", Version);
    }

     // timer functionality
     const [Count, SetCount] = useState(0);
     useEffect(() => {
         const Timer = setInterval(() => {
            SetCount(Count + 1);
            SetLastVisited(Date.now());
            Save();
         }, 1000);
 
         return () => {clearInterval(Timer);}
     }, [Count]);

    return (<>{props.children}</>);
}