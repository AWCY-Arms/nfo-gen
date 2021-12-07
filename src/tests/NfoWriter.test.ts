import { exportedForTesting } from '../utils/NfoWriter';
import { defaultTextWidth } from '../utils/NfoWriterSettings';


const { formatText } = exportedForTesting;

const loremIpsum = `Excepturi dolor dolorem adipisci voluptate sint fugit vitae totam. Aspernatur velit alias earum dolorem cum quam.
Quam sunt quis quia sunt ullam et. Accusamus illo temporibus et illum mollitia. Accusantium quis deserunt ut.`;

test('formatText 1', () => {
    const input = loremIpsum;
    expect(formatText(input, 76)).toStrictEqual([
        "Excepturi dolor dolorem adipisci voluptate sint fugit vitae totam.",
        "Aspernatur velit alias earum dolorem cum quam.",
        "Quam sunt quis quia sunt ullam et. Accusamus illo temporibus et illum",
        "mollitia. Accusantium quis deserunt ut.",
    ]);
});

test('formatText 2', () => {
    const input = "#".repeat(defaultTextWidth);
    expect(formatText(input, defaultTextWidth)).toStrictEqual([input]);
});
