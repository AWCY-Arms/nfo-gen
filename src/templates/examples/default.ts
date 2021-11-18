import deepClone from "../../helpers";
import { NfoData } from "../../NfoWriter";
import { currentDataVersion } from "../../NfoWriterSettings";
import defaultNfoSectionCredits from "../partials/credits";
import defaultNfoSectionReleaseNotes from "../partials/releaseNotes";


const releaseNotes = deepClone(defaultNfoSectionReleaseNotes)
releaseNotes.uiRemoveDisabled = false;

export const defaultNfoData: NfoData = {
    dataVersion: currentDataVersion,
    header: "Bloody",
    headerAlign: "center",
    title: "Title",
    description: "Short Description",
    version: "1.0.0",
    content: [
        releaseNotes,
        deepClone(defaultNfoSectionCredits),
    ],
}

export default defaultNfoData;
