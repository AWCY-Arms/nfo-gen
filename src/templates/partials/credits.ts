import { NfoSection } from "../../NfoWriter";


export const defaultNfoSectionCredits: NfoSection = {
    header: "Credits",
    uiHeaderDisabled: true,
    sectionData: {
        subsections: [
            {
                subheader: "Brought to you by",
                text: ["You"],
                textStyle: "credits1",
                uiRemoveDisabled: true,
                uiSubheaderDisabled: true,
                uiTextStyleHide: true,
            },
            {
                subheader: "With the help of",
                text: ["Thing 1", "Friend 2"],
                textStyle: "credits2",
                uiRemoveDisabled: true,
                uiSubheaderDisabled: true,
                uiTextStyleHide: true,
            },
            {
                subheader: "Additional thanks to",
                text: [],
                textStyle: "credits3",
                uiRemoveDisabled: true,
                uiSubheaderDisabled: true,
                uiTextStyleHide: true,
            },
            {
                subheader: "",
                text: ["the entire Are We Cool Yet? team"],
                textStyle: "credits4",
                uiRemoveDisabled: true,
                uiSubheaderDisabled: true,
                uiSubheaderHide: true,
                uiTextStyleHide: true,
            },
        ],
        uiAddSubsectionDisabled: true,
    }
}

export default defaultNfoSectionCredits;
