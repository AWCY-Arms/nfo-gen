import ClipboardJS from "clipboard";
import FileSaver from 'file-saver';
import React from 'react';
import { Button } from "react-bootstrap";


interface CopyNfoProps {
    copy: string,
    copied: string,
}

interface CopyNfoState {
    clipboard: ClipboardJS | null,
    text: string,
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
        const clipboard = new ClipboardJS('#copy_nfo');
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
        var blob = new Blob([document.getElementById('nfoText')?.textContent || ''], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, "README.txt");
    }
    componentWillUnmount() {
        if (this.state.clipboard) this.state.clipboard.destroy();
    }
    render() {
        return <div className="mb-3">
            <Button id="copy_nfo" variant="primary" data-action="copy" data-clipboard-target="#nfoText" className="me-1">{this.state.text}</Button>
            <Button variant="primary" onClick={this.save}>Download</Button>
        </div>
    }
}

export default CopyNfo;
