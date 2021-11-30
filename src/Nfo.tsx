import { useAppSelector } from './app/hooks';
import { eHandleClickNfo } from "./features/nfo/Nfo";
import { convertToSections, getSeparators } from './NfoWriter';


interface NfoProps {
    id: string,
}

export function Nfo(props: NfoProps) {
    const sections = useAppSelector((state) => convertToSections(state.nfoConfig.nfoData));
    const visibleNfo = useAppSelector((state) => state.app.nfo);

    return <div id={props.id}>
        {
            ["header", "postheader", "title", "description", "version"].map((k, i) => {
                return <pre key={i} className="nfo highlight off" id={props.id + "-" + k} onClick={eHandleClickNfo}>{sections[k].join("\n")}</pre>
            })
        }
        {
            Object.keys(sections).filter(k => k.startsWith('section-')).map((k, i) => {
                let content = sections[k].join("\n");
                return <div key={i}>
                    {getSeparators(k, content !== "").map((sep, j) => <pre className="nfo" key={j}>{sep}</pre>)}
                    <pre
                        className="nfo highlight off"
                        id={props.id + "-" + k}
                        onClick={visibleNfo ? eHandleClickNfo : undefined}
                    >
                        {content}
                    </pre>
                </div>
            })
        }
        <pre className="nfo highlight off" id={props.id + "-footer"}>{sections["footer"].join("\n")}</pre>
    </div>
}

export default Nfo;
