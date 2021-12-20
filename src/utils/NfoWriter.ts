import headers, { Header } from "../headers";
import deepClone, { IMap } from "./helpers";
import {
    creditsAdjustedWidth,
    creditsNameLeft,
    creditsNameRight,
    currentDataVersion,
    defaultBorderChar,
    defaultBorderPaddingWidth,
    defaultNfoWidth,
    defaultTextWidth,
    headerBorderEnd,
    headerBorderStart,
    lineBlank,
    lineBottom,
    lineEmpty,
    lineSep,
    lineTop,
    subSectionHeaderL,
    subSectionHeaderR
} from "./NfoWriterSettings";
import defaultNfoData from "../templates/examples/default";


export type TextAlign = "left" | "center" | "right";

export type TextStyle = "left" | "center" | "right" | "twoCol" | "numList" | "credits1" | "credits2" | "credits3" | "credits4" | "none" | "warning";

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

export interface NfoSection extends IMap {
    header: string,
    sectionData: NfoSectionData,
    uiRemoveDisabled?: boolean,
    uiHeaderDisabled?: boolean,
}

export interface NfoSubsection {
    subheader: string,
    text: string[],
    textStyle: TextStyle,
    uiRemoveDisabled?: boolean,
    uiSubheaderDisabled?: boolean,
    uiSubheaderHide?: boolean,
    uiTextStyleDisabled?: boolean,
    uiTextStyleHide?: boolean,
}

export interface NfoSectionData {
    subsections: NfoSubsection[],
    uiAddSubsectionDisabled?: boolean,
}

export interface NfoData extends IMap {
    dataVersion: number,
    headerArt: Header,
    headerAlign: TextAlign,
    title: string,
    description: string,
    version: string,
    content: NfoSection[],
}


export function readConfig(config: any): NfoData {
    switch (config.dataVersion) {
        default:
            break;
    }
    config.dataVersion = currentDataVersion;
    return Object.assign(deepClone(defaultNfoData), config);
}

export function formatText(text: string, lineLength: number): string[] {
    let outputRowIndex = 0;
    const outputRows: string[][] = [];
    const inputRows = text.split("\n");
    inputRows.forEach((rowtext) => {
        outputRows.push([]);
        // Split into words, rejoin up to lineLength
        const words = rowtext.split(" ");
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (outputRows[outputRowIndex].join(" ").length + word.length + (words.length > 1 ? 1 : 0) > lineLength) {
                outputRowIndex++;
                outputRows.push([word]);
            } else {
                outputRows[outputRowIndex].push(word);
            }
        }
        outputRowIndex++;
    });
    return outputRows.map((textArray) => {
        return textArray.join(" ")
    });
}

function leftText(text: string, format = true, length = defaultTextWidth): string[] {
    return (format ? formatText(text, length) : text.split("\n")).map((rowText) => {
        return rowText.padEnd(length);
    });
}

function centerText(text: string, format = true, length = defaultTextWidth): string[] {
    return (format ? formatText(text, length) : text.split("\n")).map((rowText) => {
        return rowText.padStart((length + rowText.length) / 2).padEnd(length)
    });
}

function rightText(text: string, format = true, length = defaultTextWidth): string[] {
    return (format ? formatText(text, length) : text.split("\n")).map((rowText) => {
        return rowText.padStart(length);
    });
}

function horizontalAlign(text: string, align: TextAlign = "center", length?: number, format?: boolean): string[] {
    switch (align) {
        case "center":
            return centerText(text, format, length);
        case "right":
            return rightText(text, format, length);
        default:
            return leftText(text, format, length);
    }
}

function borderText(textRows: string[], borderStart: string = defaultBorderChar, borderEnd: string | undefined = undefined, borderPaddingWidth: number = defaultBorderPaddingWidth): string[] {
    borderEnd = borderEnd ? borderEnd : defaultBorderChar;
    const padding = " ".repeat(borderPaddingWidth);
    return textRows.map((text) => {
        return borderStart + padding + text + padding + borderEnd;
    });
}

function centerHeader(text: string, borderStart = headerBorderStart, borderEnd = headerBorderEnd, length?: number): string[] {
    return borderText([text], borderStart, borderEnd, 1).flatMap(line => centerText(line, true, length));
}

const lMax = 30;
function renderTwoCol(lines: string[], sec: NfoSubsection): void {
    const lColText = sec.text[0] + ":";
    const lColWidth = Math.min(lColText.length, lMax);
    const lCol = leftText(lColText, true, lColWidth);
    const rCol = leftText(sec.text.slice(1).join("\n"), true, defaultTextWidth - 1 - lColWidth);
    const rowCount = Math.max(lCol.length, rCol.length);
    for (let i = 0; i < rowCount; i++) {
        const row = (lCol[i] || " ".repeat(lColWidth)) + " " + (rCol[i] || " ".repeat(defaultTextWidth - 1 - lColWidth));
        lines.push(...borderText([row]));
    }
}

function renderList(lines: string[], sec: NfoSubsection): void {
    const lColWidth = Math.floor(Math.log10(sec.text.length)) + 1;
    for (let listCounter = 1; listCounter <= sec.text.length; listCounter++) {
        const lColText = listCounter.toString().padStart(lColWidth, " ");
        const lCol = leftText(lColText, false, lColWidth);
        const rCol = leftText(sec.text[listCounter - 1], true, defaultTextWidth - 2 - lColWidth);
        rCol.forEach((_, rColIndex) => {
            const row = (rColIndex ? " ".repeat(lColWidth + 2) : (lCol[rColIndex] + ": ")) + rCol[rColIndex];
            lines.push(...borderText([row]));
        });
        if (listCounter < sec.text.length) lines.push(lineEmpty);
    }
}

export function formatCredits2(text: string, lineLength: number = defaultTextWidth): string {
    const words = text.split("\n");
    const textLines: string[] = [words[0]];
    let textLineIndex = 0;
    words.slice(1).forEach(word => {
        if (!word) return;
        const tll = textLines[textLineIndex].length
        if (tll + (tll > 0 ? 1 : 0) + word.length <= lineLength) {
            textLines[textLineIndex] += (tll > 0 ? " " : "") + word;
        } else {
            textLineIndex++;
            textLines.push(word);
        }
    })
    return textLines.join("\n");
}

function addSection(sections: IMap<string[]>, content: NfoSection, cIndex: number): void {
    // Header
    sections[cIndex + "-h"] = content.header ? [...borderText(centerHeader(content.header))] : [];
    // Subsections
    content.sectionData.subsections?.forEach((el, sIndex) => {
        // Subheader
        sections[cIndex + "-" + sIndex + "-h"] = (el.subheader && typeof el.subheader === "string") ? [...borderText(centerHeader(el.subheader, subSectionHeaderL, subSectionHeaderR))] : [];
        // Text
        const lines: string[] = [];
        if (el.text && typeof el.text === "object" && el.text.join() !== "") {
            switch (el.textStyle) {
                case "twoCol":
                    renderTwoCol(lines, el);
                    break;
                case "numList":
                    renderList(lines, el);
                    break;
                case "credits1":
                    el.text.forEach((name) => {
                        lines.push(...borderText(centerText(centerHeader(name, creditsNameLeft, creditsNameRight, creditsAdjustedWidth).join(""), undefined, creditsAdjustedWidth)));
                    });
                    break;
                case "credits2":
                    const credits2 = [];
                    switch (el.text.length) {
                        case 1:
                            credits2.push(...el.text);
                            break;
                        case 2:
                            credits2.push(el.text[0], "and", el.text[1]);
                            break;
                        default:
                            el.text.slice(0, -1).forEach(t => credits2.push(t + ","));
                            credits2.push("and", el.text[el.text.length - 1]);
                            break;
                    }
                    lines.push(...borderText(centerText(formatCredits2(credits2.join("\n")), false)));
                    break;
                case "credits3":
                    const credits3 = [];
                    const credits4 = (
                        content.sectionData.subsections[sIndex + 1]?.textStyle === "credits4" &&
                        content.sectionData.subsections[sIndex + 1]?.text.join("") !== ""
                    );
                    switch (el.text.length) {
                        case 1:
                            credits3.push(...el.text);
                            if (credits4) {
                                credits3.push("and");
                            }
                            break;
                        case 2:
                            if (credits4) {
                                credits3.push(...el.text.map(name => name + ","), "and");
                            } else {
                                credits3.push(el.text[0], "and", el.text[1]);
                            }
                            break;
                        default:
                            if (credits4) {
                                credits3.push(...el.text.map(name => name + ","), "and");
                            } else {
                                credits3.push(...el.text.slice(0, -1).map(name => name + ","), "and", el.text[el.text.length - 1]);
                            }
                            break;
                    }
                    lines.push(...borderText(centerText(formatCredits2(credits3.join("\n")), false)));
                    break;
                case "credits4":
                    lines.push(...el.text.flatMap((textRow) => {
                        return borderText(centerText(textRow))
                    }));
                    break;
                case "none":
                    lines.push(...el.text);
                    break;
                case "warning":
                    lines.push(...borderText(["!".repeat(defaultNfoWidth - 4)], undefined, undefined, 1));
                    lines.push(...el.text.flatMap(textRow => borderText(borderText(centerText(textRow, undefined, defaultTextWidth - 8), "!!!", "!!!"), undefined, undefined, 1)));
                    lines.push(...borderText(["!".repeat(defaultNfoWidth - 4)], undefined, undefined, 1));
                    break;
                default:
                    lines.push(...el.text.flatMap((textRow) => {
                        return borderText(horizontalAlign(textRow, el.textStyle as TextAlign))
                    }));
                    break;
            }
        }
        sections[cIndex + "-" + sIndex] = lines;
    });
}

export const getSection0 = (headerArt: Header, headerAlign: TextAlign): NfoSection => {
    return {
        header: "",
        sectionData: {
            subsections: [
                {
                    subheader: "",
                    text: horizontalAlign((headers)[headerArt] || "", headerAlign, defaultNfoWidth, false),
                    textStyle: "none",
                },
                {
                    subheader: "",
                    text: [
                        lineBlank,
                        ...centerText("-*- Are We Cool Yet? Presents -*-", false, defaultNfoWidth),
                        lineBlank,
                    ],
                    textStyle: "none",
                }
            ],
        }
    }
}

export const getSection1 = (title: string, description: string, version: string): NfoSection => {
    return {
        header: "",
        sectionData: {
            subsections: [
                {
                    subheader: "",
                    text: [title || " "],
                    textStyle: "center",
                },
                {
                    subheader: "",
                    text: [description],
                    textStyle: "center",
                },
                {
                    subheader: "",
                    text: [version],
                    textStyle: "center",
                }
            ],
        }
    };
}

export const sectionFooter: NfoSection = {
    header: "",
    sectionData: {
        subsections: [
            {
                subheader: "",
                textStyle: "center",
                text: [
                    "-`-,-{@  AWCY? - Stronger Together  @}-,-`-",
                    "(oven appreciation group)",
                    "Join us at: https://www.AreWeCoolYet.WTF",
                ],
            },
            {
                subheader: "",
                textStyle: "none",
                text: [lineBottom],
            }
        ]
    }
}

/**
 *  Number of sections before `options.content` in `getNfoSections()`.
 */
export const nfoSectionOffset = 2;
export function getNfoSections(options: NfoData): NfoSection[] {
    try {
        return [
            getSection0(options.headerArt, options.headerAlign),
            getSection1(options.title, options.description, options.version),
            ...options.content,
            sectionFooter,
        ];
    } catch {
        return [];
    }
}

export function convertToSectionMap(nfoData: NfoData): IMap<string[]> {
    const content = getNfoSections(nfoData);
    const sections: IMap<string[]> = {};
    content?.forEach((content, index) => {
        addSection(sections, content, index);
    });
    return sections;
}

export function getSepPre(sectionKey: string, hasContent?: boolean): string[] {
    const [i1, i2, h] = sectionKey.split("-");
    if (i1 === "0") {
        // Header image
        if (i2 === "0") {
            if (h === "h") {
                return []
            } else {
                if (hasContent) {
                    return [lineBlank]
                }
            }
        }
    } else if (i1 === "1") {
        // Title, description, version
        if (i2 === "0") {
            if (h === "h") {
                return [lineTop]
            } else {
                if (hasContent) {
                    return [lineEmpty]
                }
            }
        }
    } else {
        if (i2 === "0") {
            if (h === "h") {
                if (hasContent) {
                    return [lineSep, lineEmpty]
                }
                return [lineSep]
            } else {
                if (hasContent) {
                    return [lineEmpty]
                }
                return []
            }
        } else if (i2 === "h") {
            if (hasContent) {
                return [lineEmpty, lineSep]
            }
            return [lineEmpty]
        } else {
            if (h === "h") {
                if (hasContent) {
                    return [lineEmpty]
                }
                return []
            } else {
                if (hasContent) {
                    return [lineEmpty]
                }
                return []
            }
        }
    }
    return [];
}

export function renderToLines(textSection: string[], k: string): string[] {
    const hasContent = textSection.join("\n") !== "";
    return [
        ...getSepPre(k, hasContent),
        ...textSection
    ];
}

export function renderAllToLines(textSections: IMap<string[]>): string[] {
    return Object.keys(textSections).flatMap(k => renderToLines(textSections[k], k));
}

export function renderNfo(nfoData: NfoData): string {
    return renderAllToLines(convertToSectionMap(nfoData)).join("\n");
}

export function formatJson(obj: any): string {
    return JSON.stringify(obj, undefined, 2);
}

export const exportedForTesting = {
    formatText,
}
