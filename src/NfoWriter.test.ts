import { exportedForTesting } from './NfoWriter';


const { centerText, leftText } = exportedForTesting;

const loremIpsum = `Excepturi dolor dolorem adipisci voluptate sint fugit vitae totam. Aspernatur velit alias earum dolorem cum quam.
Quam sunt quis quia sunt ullam et. Accusamus illo temporibus et illum mollitia. Accusantium quis deserunt ut.`;

test('centerText, single line', () => {
  const input = `testing`;
  expect(centerText(input, 10)).toStrictEqual(['#  testing   #']);
});

test('centerText, multi line', () => {
  const input = loremIpsum;
  expect(centerText(input, 76)).toStrictEqual([
    "#      Excepturi dolor dolorem adipisci voluptate sint fugit vitae totam.      #",
    "#                Aspernatur velit alias earum dolorem cum quam.                #",
    "#    Quam sunt quis quia sunt ullam et. Accusamus illo temporibus et illum     #",
    "#                   mollitia. Accusantium quis deserunt ut.                    #",
  ]);
});

test('leftText, single line', () => {
  const input = `testing`;
  expect(leftText(input, 10)).toStrictEqual(['# testing    #']);
});

test('leftText, multi line', () => {
  const input = loremIpsum;
  expect(leftText(input, 76)).toStrictEqual([
    "# Excepturi dolor dolorem adipisci voluptate sint fugit vitae totam.           #",
    "# Aspernatur velit alias earum dolorem cum quam.                               #",
    "# Quam sunt quis quia sunt ullam et. Accusamus illo temporibus et illum        #",
    "# mollitia. Accusantium quis deserunt ut.                                      #",
  ]);
});
