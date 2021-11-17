import fs from "fs";

import { renderNfo } from '../src/NfoWriter';
import nfoGen from '../src/templates/examples/nfoGen';

export function run() {
    fs.writeFileSync(
        'README.txt',
        renderNfo(nfoGen)
    );
}

if (typeof window === "undefined" && require.main === module) {
    run();
}
