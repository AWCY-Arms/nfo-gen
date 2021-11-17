import { IMap } from './helpers';

import bloody from './headers/bloody';
import chilled from './headers/chilled';
import poki from './headers/poki';
import royal from './headers/royal';
import vandal from './headers/vandal';


export const headers: IMap = {
    'Bloody': bloody,
    'Chilled': chilled,
    'Poki': poki,
    'Royal': royal,
    'Vandal': vandal,
};

export type Header = "Bloody" | "Chilled" | "Poki" | "Royal" | "Vandal";

export default headers;
