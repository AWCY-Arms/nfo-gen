import ClipboardJS from "clipboard";
import FileSaver from 'file-saver';
import React from 'react';
import { Button } from "react-bootstrap";
import store from "../app/store";
import { renderNfo } from "../utils/NfoWriter";


interface CopyNfoProps {
    copy: string,
    copied: string,
}

interface CopyNfoState {
    clipboard: ClipboardJS | null,
    text: string,
}

function getNfoText(): string {
    return renderNfo(store.getState().nfoConfig.nfoData);
}

class CopyNfo extends React.Component<CopyNfoProps, CopyNfoState> {
    static defaultProps = {
        'copy': 'Copy NFO',
        'copied': 'Copied!'
    }
    constructor(props: CopyNfoProps) {
        super(props);
        this.state = {
            clipboard: null,
            text: this.props.copy,
        }
        this.save = this.save.bind(this);
    }
    componentDidMount() {
        const clipboard = new ClipboardJS('#copy_nfo', {
            text: getNfoText,
        });
        const _t = this;
        clipboard.on('success', function (e) {
            _t.setState({
                text: _t.props.copied,
            })
            setTimeout(() => {
                _t.setState({
                    text: _t.props.copy,
                })
            }, 2500);
            e.clearSelection();
        });
        this.setState({
            clipboard,
        });
    }
    save() {
        var blob = new Blob([getNfoText()], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, "README.txt");
    }
    componentWillUnmount() {
        if (this.state.clipboard) this.state.clipboard.destroy();
    }
    render() {
        return <div className="mb-3">
            <Button id="copy_nfo" variant="primary" data-action="copy" className="me-1">{this.state.text}</Button>
            <Button variant="primary" onClick={this.save}>Download</Button>
        </div>
    }
}

export default CopyNfo;
