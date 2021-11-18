import { Button, Card, Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import { useAppSelector } from './app/hooks';
import { eAddSubsection, eDelSection, eHandleContentChange, eMoveSection } from './features/nfo/Nfo';
import { NfoFormSubsection } from './NfoFormSubsection';
import { NfoSubsection, sectionTypes } from './NfoWriter';


interface NfoFormSectionProps {
    index: number,
    maxIndex: number,
}

const sectionElements = Object.keys(sectionTypes).map((key: string, i: number) => {
    return <option key={i} value={key}>{sectionTypes[key]}</option>
});

export function NfoFormSection(props: NfoFormSectionProps) {
    const section = useAppSelector((state) => state.nfoConfig.nfoData.content[props.index]);
    const sectionData = section.sectionData;
    if (!section || !sectionData) return <div />;
    return <Card className="mb-2">
        <Card.Body>
            <Row className="mb-3">
                <Col>
                    <FloatingLabel label="Header">
                        <Form.Control
                            type="text"
                            name="header"
                            size="lg"
                            placeholder="Header"
                            data-index={props.index}
                            onChange={eHandleContentChange}
                            value={section.header}
                            disabled={section.uiHeaderDisabled}
                        />
                    </FloatingLabel>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Button
                        variant="danger"
                        size="sm"
                        data-index={props.index}
                        onClick={eDelSection}
                        disabled={section.uiRemoveDisabled}
                    >Remove Section</Button>
                    &nbsp;
                    <Button
                        variant="primary"
                        size="sm"
                        data-index={props.index}
                        data-direction="up"
                        onClick={eMoveSection}
                        disabled={props.index === 0}
                    >Move Up</Button>
                    &nbsp;
                    <Button
                        variant="primary"
                        size="sm"
                        data-index={props.index}
                        data-direction="down"
                        onClick={eMoveSection}
                        disabled={props.index === props.maxIndex}
                    >Move Down</Button>
                </Col>
            </Row>
            <Row className="mb-3">
                <Form.Label column="sm" lg="2">Section Type</Form.Label>
                <Col>
                    <Form.Select
                        name="sectionType"
                        size="sm"
                        data-index={props.index}
                        onChange={eHandleContentChange}
                        value={section.sectionType}
                        disabled={section.uiSectionTypeDisabled}
                    >
                        {sectionElements}
                    </Form.Select>
                </Col>
            </Row>
            {sectionData.uiTextHide ? "" : <div>
                <Row className="mb-3">
                    <Form.Label column="sm" lg="2">Text Align</Form.Label>
                    <Col>
                        <Form.Select
                            name="textAlign"
                            size="sm"
                            onChange={eHandleContentChange}
                            data-index={props.index}
                            value={sectionData.textAlign}
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
                        value={sectionData.text?.join('\n')}
                    ></Form.Control>
                    {props.index === 0 ? <Form.Text>Shift+Enter to start a new line</Form.Text> : ''}
                </Form.Group></div>
            }
            {
                sectionData.subsections?.map((_: NfoSubsection, i: number) => {
                    return <NfoFormSubsection key={i} index={props.index} subindex={i} maxSubindex={sectionData.subsections.length - 1} />
                })
            }
            {sectionData.uiAddSubsectionDisabled ? "" :
                <Row className={sectionData.subsections?.length || 0 ? "mt-3" : ""}>
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
        </Card.Body>
    </Card>
}
