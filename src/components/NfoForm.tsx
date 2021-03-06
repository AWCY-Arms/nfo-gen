import { Button, Card, Col, Form, Row, Stack } from 'react-bootstrap';
import { useAppSelector } from '../app/hooks';
import { eAddSection, eHandleBorderChange, eHandleInputChange, eHandleInputFocus } from '../features/nfo/Nfo';
import { headerKeys } from '../headers';
import { borderStyles, NfoSection } from '../utils/NfoDefs';
import { nfoSectionOffset } from '../utils/NfoWriter';
import { defaultTextWidth } from '../utils/NfoWriterSettings';
import { NfoFormSection } from './NfoFormSection';


const headerOptions = headerKeys.map((e, i) => {
    return <option key={i} value={e}>{e}</option>
});

const borderOptions = Object.keys(borderStyles).map((e, i) => {
    return <option key={i} value={e}>{borderStyles[e].name}</option>
});

function NfoForm() {
    const nfoData = useAppSelector((state) => state.nfoConfig.nfoData);
    return <Form id="options">
        <Stack gap={3}>
            <Card>
                <Card.Header as="h5">Header</Card.Header>
                <Card.Body>
                    <Row>
                        <Col xs={12} md={6}>
                            <Form.Group as={Col}>
                                <Row className="mb-3">
                                    <Form.Label>Image</Form.Label>
                                    <Col>
                                        <Form.Select
                                            name="headerArt"
                                            size="sm"
                                            onChange={eHandleInputChange}
                                            onFocus={eHandleInputFocus}
                                            value={nfoData.headerArt}
                                            data-index={0}
                                            data-index2={0}
                                            className="nfo highlight off"
                                        >
                                            {headerOptions}
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group as={Col}>
                                <Row className="mb-3">
                                    <Form.Label>Alignment</Form.Label>
                                    <Col>
                                        <Form.Select name="headerAlign" size="sm" onChange={eHandleInputChange} value={nfoData.headerAlign}>
                                            <option value="left">Left</option>
                                            <option value="center">Center</option>
                                            <option value="right">Right</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header as="h5">Main</Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Form.Label column="sm" lg={2}>Title</Form.Label>
                        <Col>
                            <Form.Control
                                type="text"
                                size="sm"
                                name="title"
                                placeholder="Title"
                                onChange={eHandleInputChange}
                                onFocus={eHandleInputFocus}
                                data-index={1}
                                data-index2={0}
                                value={nfoData.title}
                                maxLength={defaultTextWidth}
                                className="nfo highlight off"
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Form.Label column="sm" lg={2}>Description</Form.Label>
                        <Col>
                            <Form.Control
                                as="textarea"
                                size="sm"
                                name="description"
                                placeholder="Description"
                                onChange={eHandleInputChange}
                                onFocus={eHandleInputFocus}
                                data-index={1}
                                data-index2={1}
                                value={nfoData.description}
                                className="nfo highlight off"
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Form.Label column="sm" lg={2}>Version</Form.Label>
                        <Col>
                            <Form.Control
                                type="text"
                                size="sm"
                                name="version"
                                placeholder="1.0.0"
                                onChange={eHandleInputChange}
                                onFocus={eHandleInputFocus}
                                data-index={1}
                                data-index2={2}
                                value={nfoData.version}
                                maxLength={defaultTextWidth}
                                className="nfo highlight off"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Form.Label column="sm" lg={2}>Border Style</Form.Label>
                        <Col>
                            <Form.Select
                                name="borderStyle"
                                size="sm"
                                onChange={eHandleBorderChange}
                                value={nfoData.borderStyle}
                            >
                                {borderOptions}
                            </Form.Select>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header as="h5">Sections</Card.Header>
                <Card.Body>
                    {
                        nfoData.content?.slice(nfoSectionOffset, -1).map((section: NfoSection, i: number) => (
                            <Row key={section.oId}>
                                <Col>
                                    <NfoFormSection
                                        index={nfoSectionOffset + i}
                                        minIndex={nfoSectionOffset}
                                        maxIndex={nfoData.content.length - 2} // nfoSectionOffset + (nfoData.content.length - 3) - 1
                                    />
                                </Col>
                            </Row>
                        ))
                    }
                    <Row>
                        <Col>
                            <Button variant="primary" size="sm" onClick={eAddSection}>Add a Section</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Stack>
    </Form>
}

export default NfoForm;
