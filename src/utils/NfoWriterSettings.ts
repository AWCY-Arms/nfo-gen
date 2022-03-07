import { BorderStyle } from "./NfoDefs";

export const currentDataVersion = 1;

export const defaultNfoWidth = 80;
export const defaultBorderPaddingWidth = 3;
export const defaultTextWidth = defaultNfoWidth - ((defaultBorderPaddingWidth + 1) * 2);

export const sectionheaderStart = "/X>";
export const sectionheaderEnd = "<X\\";

export const lineBlank = " ".repeat(defaultNfoWidth);

export const subSectionHeaderStart = "[-+";
export const subSectionHeaderEnd = "+-]";

export const creditsNameStart = "︻╦╤─";
export const creditsNameEnd = "─╤╦︻";
// 4 characters, but they are ~5 wide.
export const creditsAdjustedWidth = defaultTextWidth - 1;

export const defaultBorderStyle: BorderStyle = "classic";
