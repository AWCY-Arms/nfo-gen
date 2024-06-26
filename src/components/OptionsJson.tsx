import Editor, { Monaco } from "@monaco-editor/react";
import FileSaver from 'file-saver';
import { editor, Position } from "monaco-editor";
import { Alert, Button, Card, Col, Form, Modal, Row, Stack } from 'react-bootstrap';
import { useAppSelector } from '../app/hooks';
import { eHandleJsonChange, eHandleUpload, eShowConfirmLoadTemplate } from '../features/nfo/Nfo';
import NfoSchema from '../NfoSchema.json';
import sampleTemplates from '../templates/examples';
import { exportJson } from "../utils/NfoWriter";
import store from "../app/store";
import { cancelLoadTemplate, confirmLoadTemplate } from "../features/nfo/nfoSlice";


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

const onMount = (editor: editor.IStandaloneCodeEditor, _monaco: Monaco) => {
    editor.updateOptions({
        fontSize: 12,
    });
    // Set position to previous position
    editor.onDidChangeModelContent(_ => {
        if (position) editor.setPosition(position);
    });
    editor.onDidChangeCursorPosition(_ => {
        position = editor.getPosition();
    });
}

function OptionsJson() {
    const nfoJson = useAppSelector((state) => exportJson(state.nfoConfig.nfoData));
    const editorTheme = useAppSelector((state) => state.app.darkMode === "dark" ? "vs-dark" : "light");
    const isModalShow = useAppSelector(state => state.nfoConfig.isModalShow);
    const handleCancel = () => { store.dispatch(cancelLoadTemplate()) };
    const handleConfirm = () => { store.dispatch(confirmLoadTemplate()) };
    return <Stack gap={3}>
        <Card>
            <Card.Header>Load JSON</Card.Header>
            <Card.Body>
                <Alert variant="info">Import or paste a valid <code>readme.json</code>, or select a sample template.</Alert>
                <Row>
                    <Col xs="12" sm="6">
                        <Form.Group className="mb-3">
                            <Form.Label>Sample Templates</Form.Label>
                            <Form.Select name="loadTemplate" size="sm" onChange={eShowConfirmLoadTemplate} value="">
                                <option value="" />
                                {templates}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Import</Form.Label>
                            <Form.Control type="file" size="sm" accept=".json" onChange={eHandleUpload} />
                        </Form.Group>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
        <Card>
            <Card.Header>
                <Stack direction="horizontal" gap={3}>
                    <div>Edit JSON</div>
                    <div className="ms-auto">
                        <Button id="save_nfo" variant="primary" size="sm" className="pull-right" onClick={() => { save(nfoJson) }}>Save JSON</Button>
                    </div>
                </Stack>
            </Card.Header>
            <Card.Body style={{ padding: 0 }}>
                <Editor
                    language="json"
                    value={nfoJson}
                    onChange={eHandleJsonChange}
                    beforeMount={beforeMount}
                    onMount={onMount}
                    height="50vh"
                    theme={editorTheme}
                />
            </Card.Body>
        </Card>
        <Modal show={isModalShow} backdrop="static" keyboard={true} onHide={handleCancel}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>Any unsaved changes will be lost!</Modal.Body>
            <Modal.Footer>
                <Button size="sm" variant="secondary" onClick={handleCancel}>Close</Button>
                <Button size="sm" variant="danger" onClick={handleConfirm}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    </Stack>;
}

export default OptionsJson;
