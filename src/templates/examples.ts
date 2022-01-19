import { IMap } from '../utils/helpers';
import { NfoData } from '../utils/NfoDefs';
import defaultNfoData from './examples/default';
import loremIpsum from "./examples/loremIpsum";
import nfoGen from './examples/nfoGen';


export const sampleTemplates: IMap<[string, NfoData | Function]> = {
    "default": ["Default", defaultNfoData],
    "loremIpsum": ["Lorem ipsum", loremIpsum],
    "gen": ["AWCY? NFO Generator", nfoGen],

}

export default sampleTemplates;
