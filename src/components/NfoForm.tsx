import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useAppSelector } from '../app/hooks';
import { eAddSection, eHandleInputChange, eHandleInputFocus } from '../features/nfo/Nfo';
import { headerKeys } from '../headers';
import { NfoFormSection } from './NfoFormSection';
import { NfoSection, nfoSectionOffset } from '../utils/NfoWriter';
import { defaultTextWidth } from '../utils/NfoWriterSettings';


const headerOptions = headerKeys.map((e, i) => {
    return <option key={i} value={e}>{e}</option>
})

function NfoForm() {
    const nfoData = useAppSelector((state) => state.nfoConfig.nfoData);
    return <Form id="options">
        <Row className="mb-3">
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <Row>
                                <Col>Header</Col>
                            </Row>
                        </Card.Title>
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
            </Col>
        </Row>
        <Row className="mb-3">
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <Row>
                                <Col>Main</Col>
                            </Row>
                        </Card.Title>
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
                        <Row>
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
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row className="mb-3">
            <Col>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <Row className="mb-3">
                                <Col>
                                    Sections
                                </Col>
                            </Row>
                        </Card.Title>
                        {
                            nfoData.content?.map((_: NfoSection, i: number) => {
                                return <NfoFormSection
                                    key={i}
                                    index={i + nfoSectionOffset}
                                    minIndex={nfoSectionOffset}
                                    maxIndex={nfoData.content.length - 1 + nfoSectionOffset}
                                />
                            })
                        }
                        <Row>
                            <Col>
                                <Button variant="primary" size="sm" onClick={eAddSection}>Add a Section</Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Form>
}

export default NfoForm;
