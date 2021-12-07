import { NfoSection } from "../../utils/NfoWriter";


export const defaultNfoSectionReleaseNotes: NfoSection = {
    header: "Release Notes",
    sectionData: {
        subsections: [
            {
                subheader: "",
                textStyle: "center",
                text: ["Release Notes"],
            }
        ],
    },
}

export default defaultNfoSectionReleaseNotes;
