import { NfoSection, NfoSubsection } from "../../NfoWriter";


export const blankNfoSectionData: NfoSection = {
    header: "",
    sectionData: {
        textAlign: "center",
        text: [""],
        subsections: [],
    },
}

export const blankNfoSubsectionData: NfoSubsection = {
    subheader: "",
    text: [""],
    textAlign: "center",
}

const defaultExports = {blankNfoSectionData, blankNfoSubsectionData}

export default defaultExports;
