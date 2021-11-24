interface NfoProps {
    id: string,
    text: string,
}

const style = {
    lineHeight: 'initial',
    fontFamily: "Courier New, monospace",
    width: "fit-content",
};

export function Nfo(props: NfoProps) {
    return <pre id={props.id} style={style}>{props.text}</pre>
}

export default Nfo;
