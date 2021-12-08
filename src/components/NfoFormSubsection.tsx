import { Button, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import TextareaAutosize from 'react-textarea-autosize';
import { useAppSelector } from "../app/hooks";
import { eDelSubsection, eHandleContentChange, eHandleInputFocus, eMoveSubsection } from "../features/nfo/Nfo";
import { nfoSectionOffset, textStyles } from "../utils/NfoWriter";


interface NfoFormSubsectionProps {
    index: number,
    subindex: number,
    maxSubindex: number,
}

const styles = Object.keys(textStyles).filter((x: string) => textStyles[x].hidden !== true).map((key: string, i: number) => <option key={i} value={key}>{textStyles[key]["name"]}</option>);

function getTextStyleHelp(style: string): string {
    if (style.indexOf("credits") === 0)
        return "One name per line. ";
    if (style === "twoCol")
        return "Text for the left column goes on the first line.\nText for the right column starts on the second line.\n";
    if (style === "numList")
        return "Each list item should go on its own line. ";
    return "";
}

export function NfoFormSubsection(props: NfoFormSubsectionProps) {
    const subsection = useAppSelector(state => state.nfoConfig.nfoData.content[props.index - nfoSectionOffset].sectionData.subsections[props.subindex]);
    return <Card key={props.subindex} className={props.maxSubindex === props.subindex ? "" : "mb-3"}>
        <Card.Body>
            {subsection.uiSubheaderHide ? "" :
                <Row className="mb-3">
                    <Col>
                        <FloatingLabel label={(props.index + 1 - nfoSectionOffset) + "." + (props.subindex + 1) + ": Subheader"}>
                            <Form.Control
                                type="text"
                                name="subheader"
                                size="sm"
                                placeholder="Subheader"
                                data-index={props.index}
                                data-index2={props.subindex}
                                onChange={eHandleContentChange}
                                onFocus={eHandleInputFocus}
                                className="nfo highlight off"
                                value={subsection.subheader}
                                readOnly={subsection.uiSubheaderDisabled}
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
                        disabled={subsection.uiRemoveDisabled || props.subindex === 0}
                    >Remove Subsection</Button>
                    &nbsp;
                    <Button
                        variant="primary"
                        size="sm"
                        data-index={props.index}
                        data-index2={props.subindex}
                        data-direction="up"
                        onClick={eMoveSubsection}
                        disabled={props.subindex === 0}
                    >Move Up</Button>
                    &nbsp;
                    <Button
                        variant="primary"
                        size="sm"
                        data-index={props.index}
                        data-index2={props.subindex}
                        data-direction="down"
                        onClick={eMoveSubsection}
                        disabled={props.subindex === props.maxSubindex}
                    >Move Down</Button>
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
                    as={TextareaAutosize}
                    minRows={2}
                    name="text"
                    size="sm"
                    placeholder={getTextStyleHelp(subsection.textStyle) + "Press Shift+Enter to start a new line."}
                    data-index={props.index}
                    data-index2={props.subindex}
                    onChange={eHandleContentChange}
                    onFocus={eHandleInputFocus}
                    className="nfo highlight off"
                    value={subsection.text?.join('\n')}
                ></Form.Control>
            </Form.Group>
        </Card.Body>
    </Card>
}

export default NfoFormSubsection;
