export const currentDataVersion = 1;

export const defaultNfoWidth = 80;
export const defaultTextWidth = defaultNfoWidth - 8;

export const defaultBorderChar = "#";
export const defaultBorderPaddingWidth = 3;

export const headerBorderStart = "/X>";
export const headerBorderEnd = "<X\\";

export const lineBlank = " ".repeat(defaultNfoWidth);
export const lineSep = defaultBorderChar.repeat(defaultNfoWidth);
export const lineEmpty = defaultBorderChar + " ".repeat(defaultTextWidth + (defaultBorderPaddingWidth * 2)) + defaultBorderChar;

export const subSectionHeaderL = "[-+";
export const subSectionHeaderR = "+-]";

export const creditsNameLeft = "︻╦╤─";
export const creditsNameRight = "─╤╦︻";
// 4 characters, but they are ~5 wide.
export const creditsAdjustedWidth = defaultTextWidth - 1;

const defaultExports = {
    currentDataVersion,
    defaultNfoWidth,
    defaultTextWidth,
    defaultBorderChar,
    defaultBorderPaddingWidth,
    headerBorderStart,
    headerBorderEnd,
    subSectionHeaderL,
    subSectionHeaderR,
    creditsNameLeft,
    creditsNameRight,
    creditsAdjustedWidth,
}

export default defaultExports;
