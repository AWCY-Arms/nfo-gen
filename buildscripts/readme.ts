import fs from "fs";

import { renderNfo } from '../src/utils/NfoWriter';
import nfoGen from '../src/templates/examples/nfoGen';

export function run() {
    const nfoText = renderNfo(nfoGen);
    fs.writeFileSync(
        'README.txt',
        nfoText,
        { encoding: "utf8" }
    );

    const svgText = nfoText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const svgHeight = nfoText.split("\n").length * 15 + 48;
    
    const svgTemplate = fs.readFileSync(".github/README.template.svg", { encoding: 'utf8', flag: 'r' });
    const svgContent = svgTemplate.replace("{{ nfo }}", svgText).replace(/{{svgHeight}}/g, svgHeight.toString());
    fs.writeFileSync(
        '.github/README.svg',
        svgContent
    );

    const mdTemplate = fs.readFileSync(".github/README.template.md", { encoding: 'utf8', flag: 'r' });
    const mdContent = mdTemplate.replace(/{{svgHeight}}/g, svgHeight.toString());
    fs.writeFileSync(
        '.github/README.md',
        mdContent
    );
}

if (typeof window === "undefined" && require.main === module) {
    run();
}
