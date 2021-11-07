import { exportedForTesting } from './NfoWriter';


const { formatText } = exportedForTesting;

const loremIpsum = `Excepturi dolor dolorem adipisci voluptate sint fugit vitae totam. Aspernatur velit alias earum dolorem cum quam.
Quam sunt quis quia sunt ullam et. Accusamus illo temporibus et illum mollitia. Accusantium quis deserunt ut.`;

test('formatText', () => {
  const input = loremIpsum;
  expect(formatText(input, 76)).toStrictEqual([
    "Excepturi dolor dolorem adipisci voluptate sint fugit vitae totam.",
    "Aspernatur velit alias earum dolorem cum quam.",
    "Quam sunt quis quia sunt ullam et. Accusamus illo temporibus et illum",
    "mollitia. Accusantium quis deserunt ut.",
  ]);
});
