import fs from "fs";

import { renderNfo } from '../src/NfoWriter';
import nfoGen from '../src/templates/examples/nfoGen';

export function run() {
    const nfoText = renderNfo(nfoGen);
    fs.writeFileSync(
        'README.txt',
        nfoText,
        { encoding: "utf8" }
    );

    const githubTemplate = fs.readFileSync(".github/README.template.svg", { encoding: 'utf8', flag: 'r' });
    const svgText = nfoText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const githubSvg = githubTemplate.replace("{{ nfo }}", svgText);
    fs.writeFileSync(
        '.github/README.svg',
        githubSvg
    );
}

if (typeof window === "undefined" && require.main === module) {
    run();
}
