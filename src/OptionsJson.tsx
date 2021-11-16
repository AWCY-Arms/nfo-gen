import FileSaver from 'file-saver';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { useAppSelector } from './app/hooks';
import { eHandleJsonChange, eHandleUpload, eLoadTemplate, } from './features/nfo/Nfo';
import sampleTemplates from './templates/examples';
import {Property} from 'csstype';

const templates = Object.keys(sampleTemplates).map((templateId, i) => {
    const [templateName] = sampleTemplates[templateId];
    return <option key={i} value={templateId}>{templateName}</option>
});

const jsonTextAreaStyle = {
    whiteSpace: 'pre' as Property.WhiteSpace,
    fontFamily: 'monospace',
    lineHeight: 'initial',
    height: '60vh',
}

function save(text: string) {
    var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, "readme.json");
}

function OptionsJson() {
    const nfoConfig = useAppSelector((state) => state.nfoConfig);
    const text = nfoConfig.nfoJson ? nfoConfig.nfoJson : JSON.stringify(nfoConfig.nfoData, undefined, 2);
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
                    <Form.Select name="loadTemplate" size="sm" onChange={eLoadTemplate} value="">
                        <option value="" />
                        {templates}
                    </Form.Select>
                </Form.Group>
            </Col>
            <Col>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload</Form.Label>
                    <Form.Control type="file" size="sm" accept=".json" onChange={eHandleUpload} />
                </Form.Group>
            </Col>
        </Row>
        <Row className="mb-3">
            <Col>
                <Form.Control as="textarea" size="sm" style={jsonTextAreaStyle} value={text} onChange={eHandleJsonChange}></Form.Control>
            </Col>
        </Row>
        <Row>
            <Col>
                <Button id="save_nfo" variant="primary" onClick={() => {save(text)}}>Download</Button>
            </Col>
        </Row>
    </div>;
}

export default OptionsJson;
