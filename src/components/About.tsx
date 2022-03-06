import NfoContent from "./NfoContent";
import nfoGen from "../templates/examples/nfoGen";
import { getNCS, importJson } from "../utils/NfoWriter";


const [about, aboutO] = getNCS(importJson(nfoGen));

export default function About() {
    return <div className="mx-auto nfo-container">
        <NfoContent id="credits" data={about} dataOrder={aboutO} isRightNfo={false} />
    </div>
}
