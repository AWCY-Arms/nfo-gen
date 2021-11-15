import FileSaver from 'file-saver';
import React, { ChangeEventHandler } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { NfoData } from './NfoWriter';
import sampleTemplates from './templates/examples';


interface OptionsJsonProps {
    nfoData: NfoData,
    nfoJson: string | null,
    handleUpload: ChangeEventHandler,
    handleChange: ChangeEventHandler,
    loadTemplate: ChangeEventHandler,
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
        const templates = Object.keys(sampleTemplates).map((templateId, i) => {
            const [templateName] = sampleTemplates[templateId];
            return <option key={i} value={templateId}>{templateName}</option>
        });
        return <div>
            <Row>
                <Col>
                    <Alert variant="info">Upload or paste a valid <code>readme.json</code>, or select a sample template.</Alert>
                </Col>
            </Row>
            <Row>
                <Col xs="12" sm="6">
                    <Form.Group className="mb-3">
                        <Form.Label>Templates</Form.Label>
                        <Form.Select name="loadTemplate" size="sm" onChange={this.props.loadTemplate} value="">
                            <option value=""/>
                            {templates}
                        </Form.Select>
                    </Form.Group>
                </Col>
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
