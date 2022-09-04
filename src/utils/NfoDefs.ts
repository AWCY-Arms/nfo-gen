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
    | "ul"
    | "warning"

    | "credits1"
    | "credits2"
    | "credits3"
    | "credits4"
    | "none"
    | "end"
;

export interface BorderStyleDef {
    name: string,
    v: string,
    h: string,
    vhl: string,
    vhr: string,
    ctl: string,
    ctr: string,
    cbl: string,
    cbr: string,
}

export const borderStyles: IMap<BorderStyleDef> = { 
    classic: {
        name: "Classic",
        v: "#",
        h: "#",
        vhl: "#",
        vhr: "#",
        ctl: "#",
        ctr: "#",
        cbl: "#",
        cbr: "#",
    },
    box1: {
        name: "Box Drawings 1",
        v: "│",
        h: "─",
        vhl: "├",
        vhr: "┤",
        ctl: "┌",
        ctr: "┐",
        cbl: "└",
        cbr: "┘",
    },
    box2: {
        name: "Box Drawings 2",
        v: "║",
        h: "═",
        vhl: "╠",
        vhr: "╣",
        ctl: "╔",
        ctr: "╗",
        cbl: "╚",
        cbr: "╝",
    },
}

export interface Border {
    lineSep: string;
    lineEmpty: string;
    lineTop: string;
    lineBottom: string;
    borderChar: string;
}

export type BorderStyle =
    | "classic"
    | "box1"
    | "box2"
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
    borderStyle?: BorderStyle,
    _borders?: Border;
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
        ul: "Unordered List",
        warning: "Warning",
    },
    "Internal Use": {
        credits1: "Credits 1",
        credits2: "Credits 2",
        credits3: "Credits 3",
        credits4: "Credits 4",
        none: "None",
        end: "End",
    },
};
