import { useAppSelector } from '../app/hooks';
import NfoContent from './NfoContent';
import { convertToSectionMap } from "../utils/NfoWriter";


interface NfoProps {
    id: string,
}

export function Nfo(props: NfoProps) {
    const sections = useAppSelector(state => convertToSectionMap(state.nfoConfig.nfoData));
    const isRightNfo = useAppSelector(state => state.app.isRightNfo);
    return <NfoContent id={props.id} sections={sections} isRightNfo={isRightNfo} />
}

export default Nfo;
