import { eHandleClickNfo } from "./features/nfo/Nfo";
import { IMap } from "./helpers";
import { getSepPre } from "./NfoWriter";


interface NfoContentProps {
    id: string,
    sections: IMap<string[]>,
    isRightNfo: boolean,
}

const NfoContent = (props: NfoContentProps) => {
    return <div id={props.id}>
        {
            Object.keys(props.sections).map((k, i) => {
                const content = props.sections[k].join("\n");
                return <div key={i} id={"p-" + props.id + "-" + k}>
                    {getSepPre(k, content !== "").map((sep, j) => <pre className="nfo" key={j}>{sep}</pre>)}
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
    </div>
}

export default NfoContent;
