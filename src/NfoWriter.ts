import headers, { Header } from "./headers";
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
    subSectionHeaderL,
    subSectionHeaderR
} from "./NfoWriterSettings";
import defaultNfoData from "./templates/examples/default";


export type TextAlign = "left" | "center" | "right";

export type TextStyle = "left" | "center" | "right" | "twoCol" | "numList" | "credits1" | "credits2" | "credits3" | "credits4";

interface TextStyleObj {
    name: string,
    hidden?: boolean,
}

export const textStyles: IMap<TextStyleObj> = {
    left: {
        name: "Left",
    },
    center: {
        name: "Center",
    },
    right: {
        name: "Right",
    },
    twoCol: {
        name: "Q & A",
    },
    numList: {
        name: "Numbered List",
    },
    credits1: {
        name: "Credits 1",
        hidden: true,
    },
    credits2: {
        name: "Credits 2",
        hidden: true,
    },
    credits3: {
        name: "Credits 3",
        hidden: true,
    },
    credits4: {
        name: "Credits 4",
        hidden: true,
    },
}

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
    header: Header,
    headerAlign: TextAlign,
    title: string,
    description: string,
    version: string,
    content: NfoSection[],
}

export function readConfig(config: any): NfoData {
    switch (config.dataVersion) {
        case currentDataVersion:
            return Object.assign(deepClone(defaultNfoData), config);
        default:
            return deepClone(defaultNfoData);
    }
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

function leftText(text: string, format = true, length = defaultTextWidth) {
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

function borderText(textRows: string[], borderStart: string = defaultBorderChar, borderEnd: string | undefined = undefined, borderPaddingWidth: number = defaultBorderPaddingWidth) {
    borderEnd = borderEnd ? borderEnd : defaultBorderChar;
    const padding = " ".repeat(borderPaddingWidth);
    return textRows.map((text) => {
        return borderStart + padding + text + padding + borderEnd;
    });
}

function centerHeader(text: string, borderStart = headerBorderStart, borderEnd = headerBorderEnd, length?: number) {
    return centerText(borderText([text], borderStart, borderEnd, 1)[0], true, length);
}

const lineBlank = " ".repeat(defaultNfoWidth);
const lineSep = defaultBorderChar.repeat(defaultNfoWidth);
const lineEmpty = borderText(centerText("")).join("");
const lineIntro = centerText(borderText(["Are We Cool Yet? Presents"], "-*-", "-*-", 1)[0], false, defaultNfoWidth).join("");

const lMax = 30;
function renderTwoCol(lines: string[], sec: NfoSubsection) {
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

function renderList(lines: string[], sec: NfoSubsection) {
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
    sections["section-" + cIndex + "-h"] = [...borderText(centerHeader(content.header || ""))];
    // Subsections
    content.sectionData.subsections?.forEach((el, sIndex) => {
        // Subheader
        sections["section-" + cIndex + "-" + sIndex + "-h"] = (el.subheader && typeof el.subheader === "string") ? [...borderText(centerHeader(el.subheader, subSectionHeaderL, subSectionHeaderR))] : [];
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
                    let additionalCreditsText;
                    const credits4 = (content.sectionData.subsections[sIndex + 1]?.textStyle === "credits4");
                    switch (el.text.length) {
                        case 1:
                            additionalCreditsText = el.text[0];
                            if (credits4) {
                                additionalCreditsText += " and";
                            }
                            break;
                        case 2:
                            if (credits4) {
                                additionalCreditsText = el.text.join(", ") + ", and";
                            } else {
                                additionalCreditsText = el.text.join(" and ");
                            }
                            break;
                        default:
                            if (credits4) {
                                additionalCreditsText = el.text.join(", ") + ", and";
                            } else {
                                additionalCreditsText = el.text.slice(0, -1).join(", ") + ", and " + el.text.slice(-1);
                            }
                            break;
                    }
                    lines.push(...borderText(centerText(additionalCreditsText)));
                    break;
                case "credits4":
                    lines.push(...el.text.flatMap((textRow) => {
                        return borderText(centerText(textRow))
                    }));
                    break;
                default:
                    lines.push(...el.text.flatMap((textRow) => {
                        return borderText(horizontalAlign(textRow, el.textStyle as TextAlign))
                    }));
                    break;
            }
        }
        if (lines.length) {
            sections["section-" + cIndex + "-" + sIndex] = lines;
        }
    });
}

export function convertToSections(options: NfoData) {
    const sections: IMap<string[]> = {
        "header": [
            lineBlank,
            ...horizontalAlign((headers)[options.header], options.headerAlign, defaultNfoWidth, false),
            lineBlank,
        ],
        "postheader": [
            lineIntro,
            lineBlank,
            lineSep,
            lineEmpty,
        ],
        "title": [
            ...borderText(centerText(options.title)),
        ],
        "description": [
            ...borderText(centerText(options.description)),
        ],
        "version": [
            ...borderText(centerText(options.version)),
        ],
        "footer": [
            lineEmpty,
            lineSep,
            lineEmpty,
            ...borderText(centerText("-`-,-{@  AWCY? - Stronger Together  @}-,-`-")),
            ...borderText(centerText("(oven appreciation group)")),
            ...borderText(centerText("Join us at: https://www.AreWeCoolYet.WTF")),
            lineEmpty,
            lineSep,
        ]
    };

    options.content?.forEach((content, index) => {
        addSection(sections, content, index);
    });

    return sections;
}

export function getSeparators(sectionKey: string, hasContent: boolean) {
    const [, , i2, h] = sectionKey.split("-");
    if (i2 === "h") {
        return [lineEmpty, lineSep];
    } else if (i2 === "0") {
        if (h === "h") {
            if (hasContent) {
                return [lineSep, lineEmpty];
            }
            return [lineSep];
        }
        if (hasContent) {
            return [lineEmpty];
        }
    } else {
        if (hasContent) {
            return [lineEmpty];
        }
    }
    return [];
}

export function renderToLines(subsection: string[], k: string) {
    const hasContent = subsection.join("\n") !== ""
    const lines = [...getSeparators(k, hasContent)];
    if (hasContent) lines.push(...subsection);
    return lines;
}

export function renderAllToLines(sections: IMap<string[]>) {
    return [
        ...sections["header"],
        ...sections["postheader"],
        ...sections["title"],
        ...sections["description"],
        ...sections["version"],
        ...Object.keys(sections).filter(k => k.startsWith("section-")).flatMap(k => renderToLines(sections[k], k)),
        ...sections["footer"],
    ]
}

export function renderNfo(nfoData: NfoData) {
    return renderAllToLines(convertToSections(nfoData)).join("\n");
}

export function formatJson(obj: any) {
    return JSON.stringify(obj, undefined, 2);
}

export const exportedForTesting = {
    formatText,
}

const defaultExports = {
    renderNfo,
};

export default defaultExports;
