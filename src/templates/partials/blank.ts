import { NfoSection, NfoSubsection } from "../../NfoWriter";


export const blankNfoSectionData: NfoSection = {
    header: "",
    sectionData: {
        subsections: [],
    },
}

export const blankNfoSubsectionData: NfoSubsection = {
    subheader: "",
    text: [""],
    textStyle: "center",
}

const defaultExports = {blankNfoSectionData, blankNfoSubsectionData}

export default defaultExports;
