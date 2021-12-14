import { NfoSection } from "../../utils/NfoWriter";


export const defaultCredits4 = "the entire Are We Cool Yet? team";

export const defaultNfoSectionCredits: NfoSection = {
    header: "Credits",
    sectionData: {
        subsections: [
            {
                subheader: "Brought to you by",
                text: [],
                textStyle: "credits1",
            },
            {
                subheader: "With the help of",
                text: [],
                textStyle: "credits2",
            },
            {
                subheader: "Additional thanks to",
                text: [],
                textStyle: "credits3",
            },
            {
                subheader: "",
                text: [defaultCredits4],
                textStyle: "credits4",
            },
        ],
    },
};

export default defaultNfoSectionCredits;
