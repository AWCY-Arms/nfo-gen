import { AppState } from './App';
import headers from './headers';


function centerText(text = '', line_length = 76) {
  let outputRowIndex = 0;
  const outputRows: string[][] = [];
  const outputRowsFormatted: string[] = [];
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
  outputRows.forEach((textArray) => {
    const rowText = textArray.join(' ');
    const spaces = line_length - rowText.length;
    const padStartLen = (spaces / 2) + rowText.length;
    outputRowsFormatted.push("# " + rowText.padStart(padStartLen, ' ').padEnd(line_length, ' ') + " #");
  });
  return outputRowsFormatted;
}

function leftText(text = '', line_length = 76) {
  let outputRowIndex = 0;
  const outputRows: string[][] = [];
  const outputRowsFormatted: string[] = [];
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
  outputRows.forEach((textArray) => {
    const rowText = textArray.join(' ');
    outputRowsFormatted.push("# " + rowText.padEnd(line_length, ' ') + " #");
  });
  return outputRowsFormatted;
}

function centerHeader(text: string, left = "/X>", right = "<X\\") {
  return centerText(left + " " + text + " " + right);
}

// function centerCreditHeader(text) {
//   return centerHeader(text, "[-+", "+-]");
// }

const line_blank = "                                                                                ";
const line_sep = "################################################################################";
const post_logo = "                       -*- Are We Cool Yet? Presents -*-                        ";

export function renderNfo(options: AppState) {
  let lines: string[] = [
    line_blank,
    (headers)[options.header],
    line_blank,
    post_logo,
    line_blank,

    line_sep,
    ...centerText(options.title),
    ...centerText(options.description),
    ...centerText(options.version),
    line_sep,
  ];

  options.content?.forEach((content) => {
    lines.push(...centerHeader(content.header));
    lines.push(line_sep);
    switch (content.align) {
      case 'left':
        lines.push(...leftText(content.text));
        break;
      case 'right':
        // TODO
        break;
      default:
        lines.push(...centerText(content.text));
        break;
    }
    lines.push(line_sep);
  });

  // Footer
  lines.push(...centerText(''));
  lines.push(...centerText('-`-,-{@  AWCY? - Stronger Together  @}-,-`-'))
  lines.push(...centerText('(oven appreciation group)'))
  lines.push(...centerText('Join us at: https://www.AreWeCoolYet.WTF'))
  lines.push(...centerText(''));
  lines.push(line_sep);

  return lines.join('\n');
}

export const defaultOptions = {
  header: 'Bloody',
  title: '',
  description: '',
  version: '',
  content: [
    {
      "header": "Release Notes",
      "align": "center",
      "text": "",
    },
  ],
};

export const exportedForTesting = {
  centerText,
  leftText,
}

const defaultExports = { defaultOptions, headers, renderNfo };

export default defaultExports;
