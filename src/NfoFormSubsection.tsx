import { Button, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useAppSelector } from "./app/hooks";
import { eDelSubsection, eHandleContentChange } from "./features/nfo/Nfo";


interface NfoFormSubsectionProps {
    index: number,
    subindex: number,
    maxSubindex: number,
}

export function NfoFormSubsection(props: NfoFormSubsectionProps) {
    const subsection = useAppSelector(state => state.nfoConfig.nfoData.content[props.index].sectionData.subsections[props.subindex]);
    return <Card key={props.subindex} className={props.maxSubindex === props.subindex ? "" : "mb-3"}>
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
                                data-index2={props.subindex}
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
                        data-index2={props.subindex}
                        onClick={eDelSubsection}
                        disabled={subsection.uiRemoveDisabled}
                    >Remove Subsection</Button>
                </Col>
            </Row>
            {subsection.uiTextAlignHide ? "" :
                <Row className="mb-3">
                    <Form.Label column="sm" lg="2">Text Align</Form.Label>
                    <Col>
                        <Form.Select
                            name="textAlign"
                            size="sm"
                            onChange={eHandleContentChange}
                            data-index={props.index}
                            data-index2={props.subindex}
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
                    data-index2={props.subindex}
                    onChange={eHandleContentChange}
                    value={subsection.text?.join('\n')}
                ></Form.Control>
            </Form.Group>
        </Card.Body>
    </Card>
}

export default NfoFormSubsection;
