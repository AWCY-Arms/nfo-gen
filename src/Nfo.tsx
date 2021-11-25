import CopyNfo from './CopyNfo';
import { eHandleClickNfo } from "./features/nfo/Nfo";
import { IMap } from "./helpers";


interface NfoProps {
    id: string,
    sections: IMap<string[]>,
}

export function Nfo(props: NfoProps) {
    return <div className="pt-3" id={props.id}>
        <CopyNfo />
        <div className="container-nfo">
            <pre className="nfo highlight off" id={props.id + "-header"}>{props.sections["header"].join("\n")}</pre>
            <pre className="nfo highlight off" id={props.id + "-postheader"}>{props.sections["postheader"].join("\n")}</pre>
            <pre className="nfo highlight off" id={props.id + "-main"} onClick={eHandleClickNfo}>{props.sections["main"].join("\n")}</pre>
            {
                Object.keys(props.sections).filter(k => k.startsWith('section-')).map((k, i) => {
                    return <pre
                        className="nfo highlight off"
                        key={i}
                        id={props.id + "-" + k}
                        onClick={eHandleClickNfo}
                    >
                        {props.sections[k].join("\n")}
                    </pre>
                })
            }
            <pre className="nfo highlight off" id={props.id + "-footer"}>{props.sections["footer"].join("\n")}</pre>
        </div>
    </div >
}

export default Nfo;
