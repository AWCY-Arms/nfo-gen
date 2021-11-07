import React from 'react';
import { NfoData, renderNfo } from './NfoWriter';


type NfoProps = {
    nfoData: NfoData,
}

export class Nfo extends React.Component<NfoProps> {
    render() {
        const style = {
            lineHeight: 'initial',
            fontFamily: "Liberation Mono, Courier New, Consolas",
        };
        const text = renderNfo(this.props.nfoData);
        return <pre id="content" style={style}>{text}</pre>
    }
}

export default Nfo;
