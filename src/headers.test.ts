import { exportedForTesting } from './headers';


const { clean } = exportedForTesting;

test('clean, empty string', () => {
    const input = '';
    expect(clean(input, 20)).toStrictEqual(
        '                    '
    );
});

test('clean, single line', () => {
    const input = 'test';
    expect(clean(input, 20)).toStrictEqual(
        'test                '
    );
});

test('clean, multiple lines', () => {
    const input = 'test\ntest';
    expect(clean(input, 20)).toStrictEqual(
        'test                \n'
        + 'test                ');
});
