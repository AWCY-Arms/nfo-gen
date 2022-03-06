import { Header } from "../headers";
import { IMap } from "./helpers";


export type TextAlign =
    | "left"
    | "center"
    | "right"
;

export type TextStyle =
    | "left"
    | "center"
    | "right"
    | "twoCol"
    | "numList"
    | "credits1"
    | "credits2"
    | "credits3"
    | "credits4"
    | "none"
    | "warning"
;

export interface NfoSection extends IMap {
    oId?: string;
    header: string;
    sectionData: NfoSectionData;
    uiRemoveDisabled?: boolean;
    uiHeaderDisabled?: boolean;
}

export interface NfoSubsection {
    oId1?: string;
    oId2?: string;
    subheader: string;
    text: string[];
    textStyle: TextStyle;
    uiRemoveDisabled?: boolean;
    uiSubheaderDisabled?: boolean;
    uiSubheaderHide?: boolean;
    uiTextStyleDisabled?: boolean;
    uiTextStyleHide?: boolean;
}

export interface NfoSectionData {
    subsections: NfoSubsection[];
    uiAddSubsectionDisabled?: boolean;
}

export interface NfoData extends IMap {
    dataVersion: number;
    headerArt: Header;
    headerAlign: TextAlign;
    title: string;
    description: string;
    version: string;
    content: NfoSection[];
}

export interface NfoContentSection extends IMap {
    oId: string;
    id: string;
    i1: number;
    i2: number | null;
    h: boolean;
    sepPre: string;
    text: string;
}

export const textStyles: IMap<IMap> = {
    Regular: {
        left: "Left",
        center: "Center",
        right: "Right",
        twoCol: "Q & A",
        numList: "Numbered List",
        warning: "Warning",
    },
    "Internal Use": {
        credits1: "Credits 1",
        credits2: "Credits 2",
        credits3: "Credits 3",
        credits4: "Credits 4",
        none: "None",
    },
};
