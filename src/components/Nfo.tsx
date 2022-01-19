import { useAppSelector } from '../app/hooks';
import NfoContent from './NfoContent';


interface NfoProps {
    id: string,
}

export function Nfo(props: NfoProps) {
    const viewData = useAppSelector(state => state.nfoConfig.viewData);
    const dataOrder = useAppSelector(state => state.nfoConfig.viewDataOrder);
    const isRightNfo = useAppSelector(state => state.app.isRightNfo);
    return <NfoContent id={props.id} data={viewData} dataOrder={dataOrder} isRightNfo={isRightNfo} />
}

export default Nfo;
