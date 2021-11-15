import { NfoSection } from "../../NfoWriter";


export const defaultNfoSectionCredits: NfoSection = {
    header: "Credits",
    uiHeaderDisabled: true,
    sectionType: "credits",
    sectionData: {
        text: [],
        textAlign: "left",
        subsections: [
            {
                style: "credits1",
                subheader: "Brought to you by",
                text: ["You"],
                textAlign: "center",
                uiRemoveDisabled: true,
                uiSubheaderDisabled: true,
                uiTextAlignHide: true,
            },
            {
                style: "credits2",
                subheader: "With the help of",
                text: ["Thing 1", "Friend 2"],
                textAlign: "center",
                uiSubheaderDisabled: true,
                uiTextAlignHide: true,
            },
            {
                style: "credits3",
                subheader: "Additional thanks to",
                text: [],
                textAlign: "center",
                uiSubheaderDisabled: true,
                uiTextAlignHide: true,
            },
            {
                style: "credits4",
                subheader: "",
                text: ["the entire Are We Cool Yet? team"],
                textAlign: "center",
                uiSubheaderDisabled: true,
                uiSubheaderHide: true,
                uiTextAlignHide: true,
            },
        ],
        uiAddSubsectionDisabled: true,
        uiTextHide: true,
    }
}

export default defaultNfoSectionCredits;
