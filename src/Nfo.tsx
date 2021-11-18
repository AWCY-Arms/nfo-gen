interface NfoProps {
    id: string,
    text: string,
}

const style = {
    lineHeight: 'initial',
    fontFamily: "Courier New, monospace",
    textShadow: "0px 0px 40px #7F7F7F40"
};

export function Nfo(props: NfoProps) {
    return <pre id={props.id} style={style}>{props.text}</pre>
}

export default Nfo;
