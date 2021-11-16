import { Button, Card, Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import { useAppSelector } from './app/hooks';
import { eDelSection, eHandleContentChange } from './features/nfo/Nfo';
import { NfoFormSectionData } from './NfoFormSectionData';
import { sectionTypes } from './NfoWriter';


interface NfoFormSectionProps {
    index: number,
}

const sectionElements = Object.keys(sectionTypes).map((key: string, i: number) => {
    return <option key={i} value={key}>{sectionTypes[key]}</option>
});
export function NfoFormSection(props: NfoFormSectionProps) {
    const nfoData = useAppSelector((state) => state.nfoConfig.nfoData);
    const section = nfoData.content[props.index];
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
            <NfoFormSectionData
                index={props.index}
            />
        </Card.Body>
    </Card>
}
