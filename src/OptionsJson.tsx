import Editor, { Monaco } from "@monaco-editor/react";
import FileSaver from 'file-saver';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useAppSelector } from './app/hooks';
import { eHandleJsonChange, eHandleUpload, eLoadTemplate } from './features/nfo/Nfo';
import sampleTemplates from './templates/examples';
import NfoSchema from './NfoSchema.json';
import { editor, Position } from "monaco-editor";


const templates = Object.keys(sampleTemplates).map((templateId, i) => {
    const [templateName] = sampleTemplates[templateId];
    return <option key={i} value={templateId}>{templateName}</option>
});

function save(text: string) {
    var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, "readme.json");
}

const beforeMount = (monaco: Monaco) => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [{
            uri: "http://myserver/foo-schema.json",
            fileMatch: ["*"],
            schema: NfoSchema
        }]
    });
}

let position: Position | null;

const onMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    // Set position to previous position
    editor.onDidChangeModelContent((e) => {
        if (position) editor.setPosition(position);
    });
    editor.onDidChangeCursorPosition(e => {
        position = editor.getPosition();
    });
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
                <Card>
                    <Card.Body style={{ padding: 0 }}>
                        <Editor
                            language="json"
                            value={text}
                            onChange={eHandleJsonChange}
                            beforeMount={beforeMount}
                            onMount={onMount}
                            height="60vh"
                            theme="vs-dark"
                        />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col>
                <Button id="save_nfo" variant="primary" onClick={() => { save(text) }}>Download</Button>
            </Col>
        </Row>
    </div>;
}

export default OptionsJson;
