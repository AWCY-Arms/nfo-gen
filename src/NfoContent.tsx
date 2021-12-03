import { eHandleClickNfo } from "./features/nfo/Nfo";
import { IMap } from "./helpers";
import { getSeparators } from './NfoWriter';


interface NfoContentProps {
    id: string,
    sections: IMap<string[]>,
    isRightNfo: boolean,
}

const NfoContent = (props: NfoContentProps) => {
    return <div id={props.id}>
        <div id={props.id + "-header-container"}>
            <pre className="nfo highlight off" id={props.id + "-header"} onClick={props.isRightNfo ? eHandleClickNfo : undefined}>{props.sections["header"].join("\n")}</pre>
        </div>
        {
            ["postheader", "title", "description", "version"].map((k, i) => {
                return <pre key={i} className="nfo highlight off" id={props.id + "-" + k} onClick={props.isRightNfo ? eHandleClickNfo : undefined}>{props.sections[k].join("\n")}</pre>
            })
        }
        {
            Object.keys(props.sections).filter(k => k.startsWith('section-')).map((k, i) => {
                let content = props.sections[k].join("\n");
                return <div key={i}>
                    {getSeparators(k, content !== "").map((sep, j) => <pre className="nfo" key={j}>{sep}</pre>)}
                    <pre
                        className="nfo highlight off"
                        id={props.id + "-" + k}
                        onClick={props.isRightNfo ? eHandleClickNfo : undefined}
                    >
                        {content}
                    </pre>
                </div>
            })
        }
        <pre className="nfo highlight off" id={props.id + "-footer"}>{props.sections["footer"].join("\n")}</pre>
    </div>
}

export default NfoContent;
