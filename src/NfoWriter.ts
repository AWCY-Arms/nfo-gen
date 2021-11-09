import headers from './headers';


export interface NfoSectionData {
  header: string,
  text: string[],
  text_align: string,
}

export interface NfoData {
  data_version: number,
  header: string,
  header_align: string,
  title: string,
  description: string,
  version: string,
  content: NfoSectionData[],
}

export function formatText(text: string, line_length: number): string[] {
  let outputRowIndex = 0;
  const outputRows: string[][] = [];
  const inputRows = text.split('\n');
  inputRows.forEach((rowtext) => {
    outputRows.push([]);
    // Split into words, rejoin up to line_length
    const words = rowtext.split(' ');
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (outputRows[outputRowIndex].join(' ').length + 1 + word.length > line_length) {
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

function leftText(text = '', length = 76) {
  return formatText(text, length).map((rowText) => {
    return padEnd(rowText, length);
  });
}

function centerText(text = '', length = 76): string[] {
  return formatText(text, length).map((rowText) => {
    const spaces = length - rowText.length;
    const padStartLen = (spaces / 2) + rowText.length;
    return rowText.padStart(padStartLen, ' ').padEnd(length, ' ');
  });
}

function horizontalAlign(text: string, align: string, length?: number): string[] {
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

function centerHeader(text: string, borderStart = "/X>", borderEnd = "<X\\") {
  return centerText(...borderText([text], borderStart, borderEnd));
}

// function centerCreditHeader(text) {
//   return centerHeader(text, "[-+", "+-]");
// }

const line_blank = " ".repeat(80);
const line_sep = "#".repeat(80);
const post_logo = centerText(...borderText(["Are We Cool Yet? Presents"], "-*-"), 80).join('');

// TODO make options a sub of AppState instead of using AppState directly
export function renderNfo(options: NfoData) {
  let lines: string[] = [
    line_blank,
    ...horizontalAlign((headers)[options.header], options.header_align, 80),
    line_blank,
    post_logo,
    line_blank,

    line_sep,
    ...borderText(centerText(options.title)),
    ...borderText(centerText(options.description)),
    ...borderText(centerText(options.version)),
    line_sep,
  ];

  options.content?.forEach((content) => {
    if (!(
      typeof content.header === 'string' &&
      typeof content.text_align  === 'string'&&
      typeof content.text === 'object'
      )) return;
    lines.push(...borderText(centerHeader(content.header)));
    lines.push(line_sep);
    lines.push(...content.text.flatMap((textRow) => {
      return borderText(horizontalAlign(textRow, content.text_align))
    }));
    lines.push(line_sep);
  });

  // Footer
  lines.push(...borderText(centerText('')))
  lines.push(...borderText(centerText('-`-,-{@  AWCY? - Stronger Together  @}-,-`-')))
  lines.push(...borderText(centerText('(oven appreciation group)')))
  lines.push(...borderText(centerText('Join us at: https://www.AreWeCoolYet.WTF')))
  lines.push(...borderText(centerText('')))
  lines.push(line_sep);

  return lines.join('\n');
}

export const defaultNfoSectionData: NfoSectionData = {
  "header": "",
  "text_align": "center",
  "text": [""],
}

export const defaultNfoData: NfoData = {
  data_version: 1,
  header: 'Bloody',
  header_align: 'center',
  title: '',
  description: '',
  version: '',
  content: [
    {
      "header": "Release Notes",
      "text_align": "center",
      "text": [""],
    },
  ],
};

export const exportedForTesting = {
  formatText,
}

const defaultExports = { defaultNfoData, defaultNfoSectionData, renderNfo };

export default defaultExports;
