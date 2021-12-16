import NfoContent from "./NfoContent";
import { convertToSectionMap } from "../utils/NfoWriter";
import nfoGen from "../templates/examples/nfoGen";


const aboutSections = convertToSectionMap(nfoGen);

export default function About() {
    return <div className="mx-auto nfo-container">
        <NfoContent id="credits" sections={aboutSections} isRightNfo={false} />
    </div>
}
