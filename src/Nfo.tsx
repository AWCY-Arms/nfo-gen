import React from 'react';
import { AppState } from './App';
import { renderNfo } from './NfoWriter';


type NfoProps = {
    options: AppState,
}

export class Nfo extends React.Component<NfoProps> {
    render() {
        const style = {
            lineHeight: 'initial'
        };
        const text = renderNfo(this.props.options);
        return <pre id="content" style={style}>{text}</pre>
    }
}

export default Nfo;
