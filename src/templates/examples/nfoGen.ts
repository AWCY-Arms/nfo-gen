import deepClone from "../../helpers";
import { NfoData } from "../../NfoWriter";
import defaultNfoSectionCredits from "../partials/credits";
import defaultNfoSectionReleaseNotes from "../partials/releaseNotes";
import packageJson from '../../../package.json';


const credits = deepClone(defaultNfoSectionCredits);
credits.sectionData.subsections[0].style = undefined
credits.sectionData.subsections[0].text = ["dimmadong"]
credits.sectionData.subsections[1].text = ["recce"]
credits.sectionData.subsections[2].text = ["Mom"]

const releaseNotes = deepClone(defaultNfoSectionReleaseNotes)
releaseNotes.sectionData.text = ["Hello World!"]

export const nfoGen: NfoData = {
    dataVersion: 1,
    header: "Bloody",
    headerAlign: "center",
    title: "AWCY? NFO Generator",
    description: "The Premium Enterprise-Grade NFO Generator",
    version: packageJson.version,
    content: [
        releaseNotes,
        credits,
    ],
}

export default nfoGen;
