import bloody from './headers/bloody';
import chilled from './headers/chilled';
import poki from './headers/poki';
import royal from './headers/royal';
import vandal from './headers/vandal';


const clean = (text: string, length: number = 80) => {
  return text.split('\n').map((line: string) => { return line.padEnd(length, ' ') }).join('\n');
}

export const headers: { [char: string]: string } = {
  'Bloody': clean(bloody),
  'Chilled': clean(chilled),
  'Poki': clean(poki),
  'Royal': clean(royal),
  'Vandal': clean(vandal),
};

export const exportedForTesting = {
  clean
}

export default headers;
