import { Button, Card, Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import { useAppSelector } from './app/hooks';
import { eAddSubsection, eDelSection, eHandleContentChange, eHandleInputFocus, eMoveSection } from './features/nfo/Nfo';
import { NfoFormSubsection } from './NfoFormSubsection';
import { NfoSubsection, nfoSectionOffset } from "./NfoWriter";


interface NfoFormSectionProps {
    minIndex: number,
    index: number,
    maxIndex: number,
}

export function NfoFormSection(props: NfoFormSectionProps) {
    const section = useAppSelector(state => state.nfoConfig.nfoData.content[props.index - nfoSectionOffset]);
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
                            onFocus={eHandleInputFocus}
                            className="nfo highlight off"
                            value={section.header}
                            readOnly={section.uiHeaderDisabled}
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
                        disabled={props.index === nfoSectionOffset}
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
