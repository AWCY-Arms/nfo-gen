import { eHandleClickNfo } from "../features/nfo/Nfo";
import { NfoContentSection as NfoContentSectionI } from "../utils/NfoDefs";


interface NfoContentSectionProps {
    id: string,
    content: NfoContentSectionI,
    isRightNfo: boolean,
}

export function NfoContentSection(props: NfoContentSectionProps) {
    return <div key={props.content.oId} id={"p-" + props.id + "-" + props.content.id}>
        <pre className="nfo">
            {props.content.sepPre}</pre>
        <pre
            className="nfo highlight off"
            id={props.id + "-" + props.content.id}
            onClick={props.isRightNfo ? eHandleClickNfo : undefined}
        >
            {props.content.text}
        </pre>
    </div>
}

export default NfoContentSection;
