import bloody from './headers/bloody';
import chilled from './headers/chilled';
import delta from './headers/delta';
import poki from './headers/poki';
import royal from './headers/royal';
import vandal from './headers/vandal';
import { IMap } from './helpers';


// See https://github.com/patorjk/figlet.js and http://patorjk.com/software/taag/ for more
export const headers: IMap = {
    'Bloody': bloody,
    'Chilled': chilled,
    'Delta': delta,
    'Poki': poki,
    'Royal': royal,
    'Vandal': vandal,
};

export type Header = "Bloody" | "Chilled" | "Delta" | "Poki"| "Royal" | "Vandal";

export default headers;
