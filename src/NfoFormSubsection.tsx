import { Button, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useAppSelector } from "./app/hooks";
import { eDelSubsection, eHandleContentChange } from "./features/nfo/Nfo";
import { textStyles } from "./NfoWriter";


interface NfoFormSubsectionProps {
    index: number,
    subindex: number,
    maxSubindex: number,
}

const styles = Object.keys(textStyles).filter((x: string) => { return textStyles[x].hidden !== true }).map((key: string, i: number) => {
    return <option key={i} value={key}>{textStyles[key]["name"]}</option>
});

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
            {subsection.uiTextStyleHide ? "" :
                <Row className="mb-3">
                    <Form.Label column="sm" lg="2">Text Style</Form.Label>
                    <Col>
                        <Form.Select
                            name="textStyle"
                            size="sm"
                            onChange={eHandleContentChange}
                            data-index={props.index}
                            data-index2={props.subindex}
                            value={subsection.textStyle}
                            disabled={subsection.uiTextStyleDisabled}
                        >
                            {styles}
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
                {props.index === 0 && props.subindex === 0 ? <Form.Text>Shift+Enter to start a new line</Form.Text> : ""}
            </Form.Group>
        </Card.Body>
    </Card>
}

export default NfoFormSubsection;
