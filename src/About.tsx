import { renderNfo } from "./NfoWriter";
import nfoGen from "./templates/examples/nfoGen";


const aboutText = renderNfo(nfoGen);

export default function About() {
    return <div className="my-3 mx-auto text-center" style={{ width: "fit-content" }}>
        <pre className="nfo">{aboutText}</pre>
    </div>
}
