import NfoContent from "./NfoContent";
import { convertToSections } from "./NfoWriter";
import nfoGen from "./templates/examples/nfoGen";


const aboutSections = convertToSections(nfoGen);

export default function About() {
    return <div className="mx-auto" style={{ width: "fit-content" }}>
        <NfoContent id="credits" sections={aboutSections} isRightNfo={false} />
    </div>
}
