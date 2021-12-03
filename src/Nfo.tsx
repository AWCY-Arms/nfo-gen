import { useAppSelector } from './app/hooks';
import NfoContent from './NfoContent';
import { convertToSections } from './NfoWriter';


interface NfoProps {
    id: string,
}

export function Nfo(props: NfoProps) {
    const sections = useAppSelector((state) => convertToSections(state.nfoConfig.nfoData));
    const nfoId = useAppSelector((state) => state.app.nfo);
    return <NfoContent id={props.id} sections={sections} isRightNfo={nfoId === 1} />
}

export default Nfo;
