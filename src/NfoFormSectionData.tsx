import { Button, Card, Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import { useAppSelector } from './app/hooks';
import { eAddSubsection, eDelSubsection, eHandleContentChange } from './features/nfo/Nfo';
import { NfoSubsection } from './NfoWriter';


interface NfoFormSectionDataProps {
    index: number,
}

export function NfoFormSectionData(props: NfoFormSectionDataProps) {
    const section = useAppSelector((state) => state.nfoConfig.nfoData.content[props.index].sectionData);
    const subsectionsLength = section.subsections?.length || 0;
    const subsections = section.subsections?.map((subsection: NfoSubsection, i: number) => {
        return <Card key={i} className={subsectionsLength === i + 1 ? "" : "mb-3"}>
            <Card.Body>
                {subsection.uiSubheaderHide ? "" :
                    <Row className="mb-3">
                        <Col>
                            <FloatingLabel label="Subheader">
                                <Form.Control
                                    type="text"
                                    name="subheader"
                                    size="sm"
                                    placeholder="Subheader"
                                    data-index={props.index}
                                    data-index2={i}
                                    onChange={eHandleContentChange}
                                    value={subsection.subheader}
                                    disabled={subsection.uiSubheaderDisabled}
                                />
                            </FloatingLabel>
                        </Col>
                    </Row>
                }
                <Row className="mb-3">
                    <Col>
                        <Button
                            variant="danger"
                            size="sm"
                            data-index={props.index}
                            data-index2={i}
                            onClick={eDelSubsection}
                            disabled={subsection.uiRemoveDisabled}
                        >Remove Subsection</Button>
                    </Col>
                </Row>
                {subsection.uiTextAlignHide ? "" :
                    <Row>
                        <Form.Label column="sm" lg="2">Text Align</Form.Label>
                        <Col>
                            <Form.Select
                                name="textAlign"
                                size="sm"
                                onChange={eHandleContentChange}
                                data-index={props.index}
                                data-index2={i}
                                value={subsection.textAlign}
                                disabled={subsection.uiTextAlignDisabled}
                            >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right" disabled>Right</option>
                            </Form.Select>
                        </Col>
                    </Row>
                }
                <Form.Group>
                    <Form.Label>Text</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="text"
                        size="sm"
                        placeholder="Text"
                        data-index={props.index}
                        data-index2={i}
                        onChange={eHandleContentChange}
                        value={subsection.text.join('\n')}
                    ></Form.Control>
                </Form.Group>
            </Card.Body>
        </Card>
    })
    return <div className="mb-2">
        {section.uiTextHide ? "" :
            <div>
                <Row className="mb-3">
                    <Form.Label column="sm" lg="2">Text Align</Form.Label>
                    <Col>
                        <Form.Select
                            name="textAlign"
                            size="sm"
                            onChange={eHandleContentChange}
                            data-index={props.index}
                            value={section.textAlign}
                        >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right" disabled>Right</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Label>Text</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="text"
                        size="sm"
                        placeholder="Text"
                        data-index={props.index}
                        onChange={eHandleContentChange}
                        value={section.text.join('\n')}
                    ></Form.Control>
                    {props.index === 0 ? <Form.Text>Shift+Enter to start a new line</Form.Text> : ''}
                </Form.Group>
            </div>
        }
        {subsections}
        {section.uiAddSubsectionDisabled ? "" :
            <Row className={subsectionsLength ? "mt-3" : ""}>
                <Col>
                    <Button
                        variant="primary"
                        size="sm"
                        data-index={props.index}
                        onClick={eAddSubsection}
                    >Add Subsection</Button>
                </Col>
            </Row>
        }
    </div>
}

export default NfoFormSectionData
