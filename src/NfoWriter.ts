import headers, { Header } from './headers';
import deepClone, { IMap } from './helpers';
import { currentDataVersion, defaultNfoWidth, defaultTextWidth } from './NfoWriterSettings';
import defaultNfoData from './templates/examples/default';


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
    const inputRows = text.split('\n');
    inputRows.forEach((rowtext) => {
        outputRows.push([]);
        // Split into words, rejoin up to lineLength
        const words = rowtext.split(' ');
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (outputRows[outputRowIndex].join(' ').length + word.length + (words.length > 1 ? 1 : 0) > lineLength) {
                outputRowIndex++;
                outputRows.push([word]);
            } else {
                outputRows[outputRowIndex].push(word);
            }
        }
        outputRowIndex++;
    });
    return outputRows.map((textArray) => {
        return textArray.join(' ')
    });
}

function leftText(text = '', length = defaultTextWidth) {
    return formatText(text, length).map((rowText) => {
        return rowText.padEnd(length, ' ');
    });
}

function centerText(text = '', length = defaultTextWidth): string[] {
    return formatText(text, length).map((rowText) => {
        const spaces = length - rowText.length;
        const padStartLen = (spaces / 2) + rowText.length;
        return rowText.padStart(padStartLen, ' ').padEnd(length, ' ');
    });
}

function rightText(text = "", length = defaultTextWidth): string[] {
    return formatText(text, length).map((rowText) => {
        return rowText.padStart(length);
    });
}

function horizontalAlign(text: string, align: TextAlign = "center", length?: number): string[] {
    switch (align) {
        case 'center':
            return centerText(text, length);
        case "right":
            return rightText(text, length);
        default:
            return leftText(text, length);
    }
}

function borderText(textRows: string[], borderStart: string = "#  ", borderEnd: string | undefined = undefined) {
    borderEnd = borderEnd ? borderEnd : "  #";
    return textRows.map((text) => {
        return borderStart + ' ' + text + ' ' + borderEnd;
    });
}

function centerHeader(text: string, borderStart = "/X>", borderEnd = "<X\\", length?: number) {
    return centerText(...borderText([text], borderStart, borderEnd), length);
}

const lineBlank = " ".repeat(defaultNfoWidth);
const lineSep = "#".repeat(defaultNfoWidth);
const lineEmpty = borderText(centerText("")).join("");
const lineIntro = centerText(...borderText(["Are We Cool Yet? Presents"], "-*-", "-*-"), defaultNfoWidth).join('');

const subSectionHeaderL = "[-+";
const subSectionHeaderR = "+-]";

const creditsNameLeft = "︻╦╤─";
const creditsNameRight = "─╤╦︻";
// 4 characters, but they are ~5 wide.
const adjustedWidth = defaultTextWidth - 1;

function renderTwoCol(lines: string[], sec: NfoSubsection) {
    const lct = sec.text[0] + ":";
    const lcw = Math.min(lct.length, 30);
    const lc = leftText(lct, lcw);
    const rc = leftText(sec.text.slice(1).join("\n"), defaultTextWidth - 1 - lcw);
    const rows = Math.max(lc.length, rc.length);
    for (let i = 0; i < rows; i++) {
        const row = (lc[i] || " ".repeat(lcw)) + " " + (rc[i] || " ".repeat(defaultTextWidth - 1 - lcw));
        lines.push(...borderText([row]));
    }
}

function renderList(lines: string[], sec: NfoSubsection) {
    const lcw = Math.floor(sec.text.length / 10) + 1;
    for (let i = 1; i <= sec.text.length; i++) {
        const lct = i.toString().padStart(lcw, " ");
        const lc = leftText(lct, lcw);
        const rc = leftText(sec.text[i - 1], defaultTextWidth - 2 - lcw);
        rc.forEach((_, i) => {
            const row = (i ? " ".repeat(lcw + 2) : (lc[i] + ": ")) + rc[i];
            lines.push(...borderText([row]));
        });
        if (i < sec.text.length) lines.push(lineEmpty);
    }
}

function renderSection(lines: string[], content: NfoSection): void {
    const data = content.sectionData as NfoSectionData;
    if (!data) return;
    if (typeof content.header !== 'string') return;

    data.subsections?.forEach((el, i) => {
        if (el.subheader && typeof el.subheader === "string") {
            lines.push(lineEmpty);
            lines.push(...borderText(centerHeader(el.subheader, subSectionHeaderL, subSectionHeaderR)));
        }
        if (el.text && typeof el.text === "object" && el.text.join() !== "") {
            if (typeof el.textStyle !== "string") return;
            lines.push(lineEmpty);

            switch (el.textStyle) {
                case "twoCol":
                    renderTwoCol(lines, el);
                    break;
                case "numList":
                    renderList(lines, el);
                    break;
                case "credits1":
                    el.text.forEach((name) => {
                        lines.push(...borderText(horizontalAlign(centerHeader(name, creditsNameLeft, creditsNameRight, adjustedWidth).join(''), undefined, adjustedWidth)));
                    });
                    break;
                case "credits2":
                    switch (el.text.length) {
                        case 1:
                            lines.push(...borderText(centerText(el.text[0])));
                            break;
                        case 2:
                            lines.push(...borderText(centerText(el.text.join(' and '))));
                            break;
                        default:
                            lines.push(...borderText(centerText(el.text.slice(0, -1).join(', ') + ", and " + el.text.slice(-1))));
                            break;
                    }
                    break;
                case "credits3":
                    let additionalCreditsText;
                    const credits4 = (data.subsections[i + 1]?.textStyle === "credits4");
                    switch (el.text.length) {
                        case 1:
                            additionalCreditsText = el.text[0];
                            if (credits4) {
                                additionalCreditsText += ' and';
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
                                additionalCreditsText = el.text.join(', ') + ", and";
                            } else {
                                additionalCreditsText = el.text.slice(0, -1).join(', ') + ", and " + el.text.slice(-1);
                            }
                            break;
                    }
                    lines.push(...borderText(horizontalAlign(additionalCreditsText)));
                    break;
                case "credits4":
                    lines.push(...el.text.flatMap((textRow) => {
                        return borderText(horizontalAlign(textRow, "center"))
                    }));
                    break;
                default:
                    lines.push(...el.text.flatMap((textRow) => {
                        return borderText(horizontalAlign(textRow, el.textStyle as TextAlign))
                    }));
                    break;
            }
        }
    });

    lines.push(lineEmpty);
}

export function renderNfo(options: NfoData) {
    let lines: string[] = [
        lineBlank,
        ...horizontalAlign((headers)[options.header], options.headerAlign, defaultNfoWidth),
        lineBlank,
        lineIntro,
        lineBlank,

        lineSep,
        lineEmpty,
        ...borderText(centerText(options.title)),
        ...borderText(centerText(options.description)),
        ...borderText(centerText(options.version)),
        lineEmpty,
        lineSep,
    ];

    options.content?.forEach((content) => {
        lines.push(...borderText(centerHeader(content.header || "")));
        lines.push(lineSep);
        renderSection(lines, content);
        lines.push(lineSep);
    });

    // Footer
    lines.push(...borderText(centerText('')));
    lines.push(...borderText(centerText('-`-,-{@  AWCY? - Stronger Together  @}-,-`-')));
    lines.push(...borderText(centerText('(oven appreciation group)')));
    lines.push(...borderText(centerText('Join us at: https://www.AreWeCoolYet.WTF')));
    lines.push(...borderText(centerText('')));
    lines.push(lineSep);

    return lines.join('\n');
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
