import { useAppSelector } from './app/hooks';
import { renderNfo } from './NfoWriter';


const style = {
    lineHeight: 'initial',
    fontFamily: "Liberation Mono, Courier New, Consolas",
};

export function Nfo() {
    const nfoData = useAppSelector((state) => state.nfoConfig.nfoData);
    const text = renderNfo(nfoData);
    return <pre id="content" style={style}>{text}</pre>
}

export default Nfo;
