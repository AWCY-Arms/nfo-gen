import FileSaver from 'file-saver';
import React, { ChangeEventHandler } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { NfoData } from './NfoWriter';


interface OptionsJsonProps {
    nfoData: NfoData,
    nfoJson: string | null,
    handleUpload: ChangeEventHandler,
    handleChange: ChangeEventHandler,
}

interface OptionsJsonState {
    text: string | null,
}

class OptionsJson extends React.Component<OptionsJsonProps, OptionsJsonState> {
    jsonTextAreaStyle: Object;
    constructor(props: OptionsJsonProps) {
        super(props)
        this.state = {
            text: null,
        }
        this.save = this.save.bind(this);
        this.jsonTextAreaStyle = {
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            lineHeight: 'initial',
            height: '60vh'
        };
    }
    getText() {
        return this.props.nfoJson ? this.props.nfoJson : JSON.stringify(this.props.nfoData, undefined, 2);
    }
    save() {
        var blob = new Blob([this.getText()], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, "readme.json");
    }
    render() {
        return <div>
            <Row>
                <Col>
                    <Alert variant="info">To load, upload or paste a valid <code>readme.json</code> below.</Alert>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Upload</Form.Label>
                        <Form.Control type="file" size="sm" accept=".json" onChange={this.props.handleUpload} />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Control as="textarea" size="sm" style={this.jsonTextAreaStyle} value={this.getText()} onChange={this.props.handleChange}></Form.Control>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button id="save_nfo" variant="primary" onClick={this.save}>Download</Button>
                </Col>
            </Row>
        </div>;
    }
}

export default OptionsJson;
