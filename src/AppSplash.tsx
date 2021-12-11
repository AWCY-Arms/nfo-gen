import { useEffect } from "react";
import wordmark from "./images/awcy_wordmark_hwite.svg";


export const AppSplash = () => {
    useEffect(() => {
        setTimeout(() => {
            document.getElementById("splash")!.classList.add("off");
        }, 1500);
    });
    return <div id="splash">
        <div>
            <img src={wordmark} alt="AWCY? Wordmark"></img>
        </div>
    </div>
};

export default AppSplash;
