import deepClone from "../../helpers";
import { NfoData } from "../../NfoWriter";
import { currentDataVersion } from "../../NfoWriterSettings";
import defaultNfoSectionCredits from "../partials/credits";
import defaultNfoSectionReleaseNotes from "../partials/releaseNotes";


export const defaultNfoData: NfoData = {
    dataVersion: currentDataVersion,
    headerArt: "Bloody",
    headerAlign: "center",
    title: "Title",
    description: "Short Description",
    version: "1.0.0",
    content: [
        deepClone(defaultNfoSectionReleaseNotes),
        deepClone(defaultNfoSectionCredits),
    ],
}

export default defaultNfoData;
