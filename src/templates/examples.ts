import { IMap } from '../helpers';
import defaultNfoData from './examples/default';
import loremIpsum from "./examples/loremIpsum";
import nfoGen from './examples/nfoGen';


export const sampleTemplates: IMap = {
    "default": ["Default", defaultNfoData],
    "loremIpsum": ["Lorem Ipsum", loremIpsum],
    "gen": ["AWCY? NFO Generator", nfoGen],

}

export default sampleTemplates;
