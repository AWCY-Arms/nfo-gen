import headers, { Header } from './headers';
import deepClone, { IMap } from './helpers';
import { currentDataVersion, defaultNfoWidth, defaultTextWidth } from './NfoWriterSettings';
import defaultNfoData from './templates/examples/default';


export type TextAlign = "left" | "center" | "right";

export type SectionType = "default" | "credits";

export const sectionTypes: IMap = {
    "default": "Default",
    "credits": "Credits",
}

export type TextStyle = "credits1" | "credits2" | "credits3" | "credits4";

export const textStyles: IMap = {
    "credits1": "Credits 1",
    "credits2": "Credits 2",
    "credits3": "Credits 3",
    "credits4": "Credits 4",
}

export interface NfoSection extends IMap {
    header: string,
    sectionType?: SectionType,
    sectionData: NfoSectionData,
    uiRemoveDisabled?: boolean,
    uiHeaderDisabled?: boolean,
    uiSectionTypeDisabled?: boolean,
}

export interface NfoSubsection {
    style?: TextStyle,
    subheader: string,
    text: string[],
    textAlign: TextAlign,
    uiRemoveDisabled?: boolean,
    uiSubheaderDisabled?: boolean,
    uiSubheaderHide?: boolean,
    uiTextAlignDisabled?: boolean,
    uiTextAlignHide?: boolean,
}

export interface NfoSectionData {
    text: string[],
    textAlign: TextAlign,
    subsections: NfoSubsection[],
    uiAddSubsectionDisabled?: boolean,
    uiTextHide?: boolean,
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

function padEnd(text: string, length: number): string {
    return text.padEnd(length, ' ');
}

function leftText(text = '', length = defaultTextWidth) {
    return formatText(text, length).map((rowText) => {
        return padEnd(rowText, length);
    });
}

function centerText(text = '', length = defaultTextWidth): string[] {
    return formatText(text, length).map((rowText) => {
        const spaces = length - rowText.length;
        const padStartLen = (spaces / 2) + rowText.length;
        return rowText.padStart(padStartLen, ' ').padEnd(length, ' ');
    });
}

function horizontalAlign(text: string, align: TextAlign = "center", length?: number): string[] {
    switch (align) {
        case 'center':
            return centerText(text, length);
        default:
            return leftText(text, length);
    }
}

function borderText(textRows: string[], borderStart: string = "#", borderEnd: string | undefined = undefined) {
    borderEnd = borderEnd ? borderEnd : borderStart;
    return textRows.map((text) => {
        return borderStart + ' ' + text + ' ' + borderEnd;
    });
}

function centerHeader(text: string, borderStart = "/X>", borderEnd = "<X\\", length?: number) {
    return centerText(...borderText([text], borderStart, borderEnd), length);
}

// function centerCreditHeader(text) {
//   return centerHeader(text, "[-+", "+-]");
// }

const lineBlank = " ".repeat(defaultNfoWidth);
const lineSep = "#".repeat(defaultNfoWidth);
const lineEmpty = borderText(centerText("")).join("");
const lineIntro = centerText(...borderText(["Are We Cool Yet? Presents"], "-*-"), defaultNfoWidth).join('');

const subSectionHeaderL = "[-+";
const subSectionHeaderR = "+-]";

const creditsNameLeft = "︻╦╤─";
const creditsNameRight = "─╤╦︻";
// 4 characters, but they are 5 wide.
const adjustedWidth = defaultTextWidth - 1;

function renderSection(lines: string[], content: NfoSection): void {
    const data = content.sectionData as NfoSectionData;
    if (!data) return;
    if (typeof content.header !== 'string') return;

    if (
        typeof data.textAlign === 'string' &&
        typeof data.text === 'object' &&
        data.text.length &&
        data.text.join() !== ""
    ) {
        lines.push(lineEmpty);
        lines.push(...data.text.flatMap((textRow) => {
            return borderText(horizontalAlign(textRow, data.textAlign))
        }));
    }

    data.subsections?.forEach((el, i) => {
        if (el.subheader && typeof el.subheader === "string") {
            lines.push(lineEmpty);
            lines.push(...borderText(centerHeader(el.subheader, subSectionHeaderL, subSectionHeaderR)));
        }
        if (el.text && typeof el.text === "object" && el.text.join() !== "") {
            if (typeof el.textAlign !== "string") return;
            lines.push(lineEmpty);

            if (!el.style) {
                lines.push(...el.text.flatMap((textRow) => {
                    return borderText(horizontalAlign(textRow, el.textAlign))
                }));
                return;
            }

            switch (el.style) {
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
                    switch (el.text.length) {
                        case 1:
                            additionalCreditsText = el.text[0];
                            break;
                        case 2:
                            additionalCreditsText = el.text.join(' and ');
                            break;
                        default:
                            additionalCreditsText = el.text.slice(0, -1).join(', ') + ", and " + el.text.slice(-1);
                            break;
                    }
                    // Check if the next section is credits4
                    if (data.subsections[i + 1]?.style === "credits4") {
                        additionalCreditsText += ", and"
                    }
                    lines.push(...borderText(horizontalAlign(additionalCreditsText)));
                    break;
                default:
                    lines.push(...el.text.flatMap((textRow) => {
                        return borderText(horizontalAlign(textRow, el.textAlign))
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
        ...borderText(centerText(options.title)),
        ...borderText(centerText(options.description)),
        ...borderText(centerText(options.version)),
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
