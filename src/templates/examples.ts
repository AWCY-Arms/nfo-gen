import { IMap } from '../helpers';
import defaultNfoData from './examples/default';
import nfoGen from './examples/nfoGen';


export const sampleTemplates : IMap = {
    "default": ["Default", defaultNfoData],
    "gen": ["AWCY? NFO Generator", nfoGen],

}

export default sampleTemplates;
