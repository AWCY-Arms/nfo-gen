import deepClone from "../../helpers";
import { NfoData } from "../../NfoWriter";
import defaultNfoSectionCredits from "../partials/credits";
import defaultNfoSectionReleaseNotes from "../partials/releaseNotes";
import packageJson from '../../../package.json';


const credits = deepClone(defaultNfoSectionCredits);
credits.sectionData.subsections[0].textStyle = "center"
credits.sectionData.subsections[0].text = ["dimmadong"]
credits.sectionData.subsections[1].text = ["recce"]
credits.sectionData.subsections[2].text = ["Mom", "Darren", "Ferus", "Edison"]

const releaseNotes = deepClone(defaultNfoSectionReleaseNotes)
releaseNotes.sectionData.subsections[0].text[0] = "Hello World!";
releaseNotes.uiRemoveDisabled = true;

export const nfoGen: NfoData = {
    dataVersion: 1,
    header: "Delta",
    headerAlign: "center",
    title: "AWCY? Readme Generator",
    description: "The Premium Triple-Distilled Enterprise-Grade NFO Generator for the Sweaty and Moist Yet Sophisticated Artist who needed their README done yesterday",
    version: packageJson.version,
    content: [
        releaseNotes,
        credits,
    ],
}

export default nfoGen;
