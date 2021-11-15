import { NfoSection } from "../../NfoWriter";


export const defaultNfoSectionReleaseNotes: NfoSection = {
    header: "Release Notes",
    sectionType: "default",
    sectionData: {
        textAlign: "center",
        text: [""],
        subsections: [],
    },
    uiRemoveDisabled: true,
    uiSectionTypeDisabled: true,
}

export default defaultNfoSectionReleaseNotes;
