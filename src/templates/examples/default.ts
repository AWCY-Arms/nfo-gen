import deepClone from "../../helpers";
import { NfoData, NfoSection } from "../../NfoWriter";
import { currentDataVersion } from "../../NfoWriterSettings";
import defaultNfoSectionCredits from "../partials/credits";
import defaultNfoSectionReleaseNotes from "../partials/releaseNotes";


export const defaultNfoData: NfoData = {
    dataVersion: currentDataVersion,
    header: "Bloody",
    headerAlign: "center",
    title: "Title",
    description: "Short Description",
    version: "1.0.0",
    content: [
        deepClone(defaultNfoSectionReleaseNotes) as NfoSection,
        deepClone(defaultNfoSectionCredits) as NfoSection,
    ],
}

export default defaultNfoData;
