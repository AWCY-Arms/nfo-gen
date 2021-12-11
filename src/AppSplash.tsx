import { useEffect } from "react";
import headers from "./headers";


export const AppSplash = () => {
    useEffect(() => {
        setTimeout(() => {
            document.getElementById("splash")!.classList.add("off");
        }, 1500);
    });
    return <div id="splash">
        <div>
            <pre>{headers['Delta']}</pre>
        </div>
    </div>
};

export default AppSplash;
