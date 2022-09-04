import { nanoid } from "@reduxjs/toolkit";
import Ajv from "ajv";
import headers, { Header } from "../headers";
import schemaNfo from "../NfoSchema.json";
import { cleanText, deepClone, IMap } from "./helpers";
import { Border, borderStyles, NfoContentSection, NfoData, NfoSection, NfoSubsection, TextAlign } from "./NfoDefs";
import {
    creditsAdjustedWidth, creditsNameEnd, creditsNameStart, currentDataVersion,
    defaultBorderPaddingWidth, defaultBorderStyle, defaultNfoWidth,
    defaultTextWidth, lineBlank, sectionheaderEnd,
    sectionheaderStart, subSectionHeaderEnd, subSectionHeaderStart
} from "./NfoWriterSettings";


const ajv = new Ajv();
const validate = ajv.compile(schemaNfo);

export const importJson = (nfoData: string | NfoData): NfoData => {
    const nfoDataObj: NfoData = readConfig(typeof nfoData === "string" ? JSON.parse(cleanText(nfoData)) : deepClone(nfoData));
    if (!validate(nfoDataObj)) throw validate.errors;
    // Set viewDataOrder ids
    nfoDataObj.content.forEach(section => {
        section.oId = nanoid();
        section.sectionData.subsections.forEach(subsection => {
            subsection.oId1 = nanoid();
            subsection.oId2 = nanoid();
        });
    });
    const borderStyle = nfoDataObj.borderStyle || defaultBorderStyle;
    const borders = getBorders(borderStyle);
    const content = [
        getSection0(nfoDataObj.headerArt, nfoDataObj.headerAlign),
        getSection1(nfoDataObj.title, nfoDataObj.description, nfoDataObj.version),
        ...nfoDataObj.content,
        sectionFooter,
    ];
    return {
        dataVersion: currentDataVersion,
        headerArt: nfoDataObj.headerArt,
        headerAlign: nfoDataObj.headerAlign,
        title: nfoDataObj.title,
        description: nfoDataObj.description,
        version: nfoDataObj.version,
        borderStyle: borderStyle,
        _borders: borders,
        content: content,
    }
}

export const exportJson = (nfoData: NfoData): string => {
    const exportData = deepClone(nfoData);
    const content = exportData.content.slice(nfoSectionOffset, -1);
    content.forEach(section => {
        delete section.oId;
        section.sectionData.subsections.forEach(subsection => {
            delete subsection.oId1;
            delete subsection.oId2;
        });
    });
    exportData.content = content;
    delete exportData._borders;
    return formatJson(exportData);
}

export function readConfig(config: any): NfoData {
    switch (config.dataVersion) {
        default:
            break;
    }
    config.dataVersion = currentDataVersion;
    return config;
}

export function getBorders(borderStyle: string): Border {
    const chars = borderStyles[borderStyle];
    return {
        lineSep: chars.vhl + chars.h.repeat(defaultNfoWidth - 2) + chars.vhr,
        lineEmpty: chars.v + " ".repeat(defaultTextWidth + (defaultBorderPaddingWidth * 2)) + chars.v,
        lineTop: chars.ctl + chars.h.repeat(defaultNfoWidth - 2) + chars.ctr,
        lineBottom: chars.cbl + chars.h.repeat(defaultNfoWidth - 2) + chars.cbr,
        borderChar: chars.v,
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
        return textArray.join(" ");
    });
}

function leftText(text: string, format = true, length = defaultTextWidth): string[] {
    return (format ? formatText(text, length) : text.split("\n")).map((rowText) => {
        return rowText.padEnd(length);
    });
}

function centerText(text: string, format = true, length = defaultTextWidth): string[] {
    return (format ? formatText(text, length) : text.split("\n")).map((rowText) => {
        return rowText.padStart((length + rowText.length) / 2).padEnd(length);
    });
}

function rightText(text: string, format = true, length = defaultTextWidth): string[] {
    return (format ? formatText(text, length) : text.split("\n")).map((rowText) => {
        return rowText.padStart(length);
    });
}

export function horizontalAlign(text: string, align: TextAlign = "center", length?: number, format?: boolean): string[] {
    switch (align) {
        case "center":
            return centerText(text, format, length);
        case "right":
            return rightText(text, format, length);
        default:
            return leftText(text, format, length);
    }
}

function borderText(textRows: string[], borderStart?: string, borderEnd?: string, border?: Border, borderPaddingWidth: number = defaultBorderPaddingWidth): string[] {
    borderStart = (borderStart && borderEnd) ? borderStart : (border ? border.borderChar : "");
    borderEnd = (borderStart && borderEnd) ? borderEnd : (border ? border.borderChar : "");
    const padding = " ".repeat(borderPaddingWidth);
    return textRows.map((text) => {
        return borderStart + padding + text + padding + borderEnd;
    });
}

function centerHeader(text: string, borderStart = sectionheaderStart, borderEnd = sectionheaderEnd, length?: number): string[] {
    return borderText([text], borderStart, borderEnd, undefined, 1).flatMap(line => centerText(line, true, length));
}

const lMax = 30;
function renderTwoCol(border: Border, lines: string[], subsection: NfoSubsection): void {
    const lColText = subsection.text[0] + ":";
    const lColWidth = Math.min(lColText.length, lMax);
    const lCol = leftText(lColText, true, lColWidth);
    const rCol = leftText(subsection.text.slice(1).join("\n"), true, defaultTextWidth - 1 - lColWidth);
    const rowCount = Math.max(lCol.length, rCol.length);
    for (let i = 0; i < rowCount; i++) {
        const row = (lCol[i] || " ".repeat(lColWidth)) + " " + (rCol[i] || " ".repeat(defaultTextWidth - 1 - lColWidth));
        lines.push(...borderText([row], undefined, undefined, border));
    }
}

function renderOrderedList(border: Border, lines: string[], subsection: NfoSubsection): void {
    const lColWidth = Math.floor(Math.log10(subsection.text.length)) + 1;
    for (let listCounter = 1; listCounter <= subsection.text.length; listCounter++) {
        const lColText = listCounter.toString().padStart(lColWidth, " ");
        const lCol = leftText(lColText, false, lColWidth);
        const rCol = leftText(subsection.text[listCounter - 1], true, defaultTextWidth - 2 - lColWidth);
        rCol.forEach((_, rColIndex) => {
            const row = (rColIndex ? " ".repeat(lColWidth + 2) : (lCol[rColIndex] + ": ")) + rCol[rColIndex];
            lines.push(...borderText([row], undefined, undefined, border));
        });
        if (listCounter < subsection.text.length) lines.push(border.lineEmpty);
    }
}

function renderUnorderedList(border: Border, lines: string[], subsection: NfoSubsection, listStyleType: string = "*"): void {
    subsection.text.forEach((text, index) => {
        const rCol = leftText(text, true, defaultTextWidth - 1 - listStyleType.length);
        rCol.forEach((_, rColIndex) => {
            const row = (rColIndex ? " ".repeat(listStyleType.length + 1) : (listStyleType + " ")) + rCol[rColIndex];
            lines.push(...borderText([row], undefined, undefined, border));
        });
        if (index + 1 < subsection.text.length) lines.push(border.lineEmpty);
    });
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
    });
    return textLines.join("\n");
}

export function renderHeader(border: Border, text: string) {
    return borderText(centerHeader(text), undefined, undefined, border).join("\n");
}

export function renderSubheader(border: Border, text: string) {
    return borderText(centerHeader(text, subSectionHeaderStart, subSectionHeaderEnd), undefined, undefined, border).join("\n");
}

export function renderText(border: Border, el: NfoSubsection, section: NfoSection, i2: number) {
    const lines: string[] = [];
    if (el.text && typeof el.text === "object" && el.text.join() !== "") {
        switch (el.textStyle) {
            case "twoCol":
                renderTwoCol(border, lines, el);
                break;
            case "numList":
                renderOrderedList(border, lines, el);
                break;
            case "ul":
                renderUnorderedList(border, lines, el);
                break;
            case "credits1":
                el.text.forEach((name) => {
                    lines.push(...borderText(
                        centerText(centerHeader(name, creditsNameStart, creditsNameEnd, creditsAdjustedWidth).join(""), undefined, creditsAdjustedWidth),
                        undefined,
                        undefined,
                        border,
                    ));
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
                lines.push(...borderText(
                    centerText(formatCredits2(credits2.join("\n")), false),
                    undefined,
                    undefined,
                    border,
                ));
                break;
            case "credits3":
                const credits3 = [];
                if (section === undefined || i2 === undefined)
                    break;
                const credits4 = (
                    section.sectionData.subsections[i2 + 1]?.textStyle === "credits4" &&
                    section.sectionData.subsections[i2 + 1]?.text.join("") !== ""
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
                lines.push(...borderText(
                    centerText(formatCredits2(credits3.join("\n")), false),
                    undefined,
                    undefined,
                    border,
                ));
                break;
            case "credits4":
                lines.push(...el.text.flatMap((textRow) => {
                    return borderText(centerText(textRow), undefined, undefined, border);
                }));
                break;
            case "none":
                lines.push(...el.text);
                break;
            case "warning":
                lines.push(...borderText(["!".repeat(defaultNfoWidth - 4)], undefined, undefined, border, 1));
                lines.push(...el.text.flatMap(
                    textRow => borderText(
                        borderText(
                            centerText(textRow, undefined, defaultTextWidth - 8),
                            "!!!",
                            "!!!",
                        ),
                        undefined,
                        undefined,
                        border,
                        1
                    )
                ));
                lines.push(...borderText(["!".repeat(defaultNfoWidth - 4)], undefined, undefined, border, 1));
                break;
            case "end":
                lines.push(border.lineBottom);
                break;
            default:
                lines.push(...el.text.flatMap((textRow) => {
                    return borderText(
                        horizontalAlign(textRow, el.textStyle as TextAlign),
                        undefined,
                        undefined,
                        border,
                    );
                }));
                break;
        }
    }
    return lines;
}

export function getSubsectionNCS(border: Border, subsection: NfoSubsection, i1: number, i2: number, renderedText: string): NfoContentSection[] {
    return [
        {
            oId: subsection.oId1!,
            id: i1 + "-" + i2 + "-h",
            i1: i1,
            i2: i2,
            h: true,
            sepPre: getSepPre(border, i1 + "-" + i2 + "-h", subsection.subheader?.length > 0).join("\n"),
            text: (subsection.subheader && typeof subsection.subheader === "string") ? renderSubheader(border, subsection.subheader) : ''
        },
        {
            oId: subsection.oId2!,
            id: i1 + "-" + i2,
            i1: i1,
            i2: i2,
            h: false,
            sepPre: getSepPre(border, i1 + "-" + i2, renderedText.length > 0).join("\n"),
            text: renderedText
        }
    ]
}

export function getSectionNCS(border: Border, section: NfoSection, i1: number): NfoContentSection[] {
    // Header
    const viewData: NfoContentSection[] = [
        {
            oId: section.oId!,
            id: i1 + "-h",
            i1: i1,
            i2: null,
            h: true,
            sepPre: getSepPre(border, i1 + "-h", section.header?.length > 0).join("\n"),
            text: section.header ? renderHeader(border, section.header) : ''
        }
    ];
    // Subsections
    section.sectionData?.subsections?.forEach((subsection, i2) => {
        // Subheader
        // Text
        const text = renderText(border, subsection, section, i2).join("\n");
        viewData.push(...getSubsectionNCS(border, subsection, i1, i2, text));
    });
    return viewData;
}

export const getSection0 = (headerArt: Header, headerAlign: TextAlign): NfoSection => {
    return {
        oId: nanoid(),
        header: "",
        sectionData: {
            subsections: [
                {
                    oId1: nanoid(),
                    oId2: nanoid(),
                    subheader: "",
                    text: horizontalAlign((headers)[headerArt] || "", headerAlign, defaultNfoWidth, false),
                    textStyle: "none",
                },
                {
                    oId1: nanoid(),
                    oId2: nanoid(),
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
        oId: nanoid(),
        header: "",
        sectionData: {
            subsections: [
                {
                    oId1: nanoid(),
                    oId2: nanoid(),
                    subheader: "",
                    text: [title || " "],
                    textStyle: "center",
                },
                {
                    oId1: nanoid(),
                    oId2: nanoid(),
                    subheader: "",
                    text: [description],
                    textStyle: "center",
                },
                {
                    oId1: nanoid(),
                    oId2: nanoid(),
                    subheader: "",
                    text: [version],
                    textStyle: "center",
                }
            ],
        }
    };
}

export const sectionFooter: NfoSection = {
    oId: nanoid(),
    header: "",
    sectionData: {
        subsections: [
            {
                oId1: nanoid(),
                oId2: nanoid(),
                subheader: "",
                textStyle: "center",
                text: [
                    "-`-,-{@  AWCY? - Stronger Together  @}-,-`-",
                    "(oven appreciation group)",
                    "Join us at: https://www.AreWeCoolYet.WTF",
                ],
            },
            {
                oId1: nanoid(),
                oId2: nanoid(),
                subheader: "",
                textStyle: "end",
                text: ["_"],
            }
        ]
    }
}

/**
 *  Number of sections before `options.content`.
 */
export const nfoSectionOffset = 2;

export function getNCS(nfoData: NfoData): [IMap<NfoContentSection>, string[]] {
    const viewData: IMap<NfoContentSection> = {};
    const viewDataOrder: string[] = [];
    nfoData.content?.forEach((content, index) => {
        getSectionNCS(nfoData._borders!, content, index).forEach(ncs => {
            viewData[ncs.oId] = ncs;
            viewDataOrder.push(ncs.oId);
        });
    });
    return [viewData, viewDataOrder];
}

export function getSepPre(border: Border, sectionKey: string, hasContent?: boolean): string[] {
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
                return [border.lineTop]
            } else {
                if (hasContent) {
                    return [border.lineEmpty]
                }
            }
        } else {
            if (h !== "h" && i2 !== "h") {
                return [border.lineEmpty]
            }
        }
    } else {
        if (i2 === "0") {
            if (h === "h") {
                if (hasContent) {
                    return [border.lineSep, border.lineEmpty]
                }
                return [border.lineSep]
            } else {
                if (hasContent) {
                    return [border.lineEmpty]
                }
                return []
            }
        } else if (i2 === "h") {
            if (hasContent) {
                return [border.lineEmpty, border.lineSep]
            }
            return [border.lineEmpty]
        } else {
            if (h === "h") {
                if (hasContent) {
                    return [border.lineEmpty]
                }
                return []
            } else {
                if (hasContent) {
                    return [border.lineEmpty]
                }
                return []
            }
        }
    }
    return [];
}

export function renderViewData(viewData: IMap<NfoContentSection>, viewDataOrder: string[]) {
    return viewDataOrder.flatMap(key => {
        const text = [];
        if (viewData[key].sepPre) text.push(viewData[key].sepPre);
        if (viewData[key].text) text.push(viewData[key].text);
        return text;
    }).join("\n");
}

export function renderNfo(nfoData: NfoData): string {
    return renderViewData(...getNCS(nfoData));
}

export function formatJson(obj: any): string {
    return JSON.stringify(obj, undefined, 2);
}

export const exportedForTesting = {
    formatText,
}
