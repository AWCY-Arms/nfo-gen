import { useAppSelector } from "./app/hooks";
import { renderNfo } from "./NfoWriter";


export const CopyNfoText = () => {
    const nfoText = useAppSelector((state) => renderNfo(state.nfoConfig.nfoData));
    return <pre id="nfoText" style={{ position: "absolute", transform: "scale(0)", zIndex: -1 }}>{nfoText}</pre>
}

export default CopyNfoText;
