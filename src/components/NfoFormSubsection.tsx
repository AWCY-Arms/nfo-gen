import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import TextareaAutosize from 'react-textarea-autosize';
import { useAppSelector } from "../app/hooks";
import { eDelSubsection, eHandleContentChange, eHandleInputFocus, eMoveSubsection } from "../features/nfo/Nfo";
import { defaultCredits4 } from "../templates/partials/credits";
import { textStyles } from "../utils/NfoDefs";
import { nfoSectionOffset } from "../utils/NfoWriter";


interface NfoFormSubsectionProps {
    index: number,
    subindex: number,
    maxSubindex: number,
}

const styles = Object.keys(textStyles).map((optgroupLabel, i) => (
    <optgroup label={optgroupLabel} key={i}>
        {Object.keys(textStyles[optgroupLabel]).map((optname, j) => (
            <option key={j} value={optname}>
                {textStyles[optgroupLabel][optname]}
            </option>
        ))}
    </optgroup>
));

function getTextStyleHelp(style: string): string {
    let helpText = "";
    if (style.indexOf("credits") === 0) {
        if (style === "credits4") {
            return defaultCredits4;
        }
        helpText = "One name per line.";
    }
    switch (style) {
        case "twoCol":
            helpText = "Text for the left column goes on the first line.\nText for the right column starts on the second line.\n";
            break;
        case "numList":
            helpText = "Each list item should go on its own line.";
            break;
    }
    return (helpText ? helpText + " " : "") + "Press Shift+Enter to start a new line.";
}

export function NfoFormSubsection(props: NfoFormSubsectionProps) {
    const subsection = useAppSelector(state => state.nfoConfig.nfoData.content[props.index].sectionData.subsections[props.subindex]);
    return <div key={subsection.oId1!}>
        <h6 className="h6">Section {(props.index + 1 - nfoSectionOffset) + "." + (props.subindex + 1)}</h6>
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
                            onFocus={eHandleInputFocus}
                            className="nfo highlight off"
                            value={subsection.subheader}
                            readOnly={subsection.uiSubheaderDisabled}
                        />
                    </FloatingLabel>
                </Col>
            </Row>
        }
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
                placeholder={getTextStyleHelp(subsection.textStyle || "")}
                data-index={props.index}
                data-index2={props.subindex}
                onChange={eHandleContentChange}
                onFocus={eHandleInputFocus}
                className="nfo highlight off"
                value={subsection.text?.join('\n')}
            ></Form.Control>
        </Form.Group>
        <Row className="mt-3">
            <Col>
                <Button
                    variant="danger"
                    size="sm"
                    data-index={props.index}
                    data-index2={props.subindex}
                    onClick={eDelSubsection}
                    disabled={subsection.uiRemoveDisabled || (0 === props.subindex && props.subindex === props.maxSubindex)}
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
        <hr />
    </div>
}

export default NfoFormSubsection;
