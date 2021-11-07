import React from 'react';
import { NfoConfig, renderNfo } from './NfoWriter';


type NfoProps = {
    nfoConfig: NfoConfig,
}

export class Nfo extends React.Component<NfoProps> {
    render() {
        const style = {
            lineHeight: 'initial',
            fontFamily: "Liberation Mono, Courier New, Consolas",
        };
        const text = renderNfo(this.props.nfoConfig);
        return <pre id="content" style={style}>{text}</pre>
    }
}

export default Nfo;
