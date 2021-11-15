import React, { ChangeEventHandler, MouseEventHandler } from 'react';
import { Button, Card, Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import deepClone from './helpers';
import { NfoFormSectionData } from './NfoFormSectionData';
import { NfoSection, sectionTypes } from './NfoWriter';
import { blankNfoSectionData } from './templates/partials/blank';


interface NfoFormSectionProps extends NfoSection {
    index: number,
    onChange: ChangeEventHandler,
    delSection: MouseEventHandler<HTMLButtonElement>,
    addSubsection: MouseEventHandler,
    delSubsection: MouseEventHandler,
}

export class NfoFormSection extends React.Component<NfoFormSectionProps> {
    static defaultProps: NfoFormSectionProps = Object.assign(
        deepClone(blankNfoSectionData),
        {
            index: 0,
            onChange: () => { },
            delSection: () => { },
            addSubsection: () => { },
            delSubsection: () => { },
        }
    );
    render() {
        const sectionElements = Object.keys(sectionTypes).map((key: string, i: number) => {
            return <option key={i} value={key}>{sectionTypes[key]}</option>
        });
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
                                data-index={this.props.index}
                                onChange={this.props.onChange}
                                value={this.props.header}
                                disabled={this.props.uiHeaderDisabled}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Button
                            variant="danger"
                            size="sm"
                            data-index={this.props.index}
                            onClick={this.props.delSection}
                            disabled={this.props.uiRemoveDisabled}
                        >Remove Section</Button>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Form.Label column="sm" lg="2">Section Type</Form.Label>
                    <Col>
                        <Form.Select
                            name="sectionType"
                            size="sm"
                            data-index={this.props.index}
                            onChange={this.props.onChange}
                            value={this.props.sectionType}
                            disabled={this.props.uiSectionTypeDisabled}
                        >
                            {sectionElements}
                        </Form.Select>
                    </Col>
                </Row>
                <NfoFormSectionData
                    onChange={this.props.onChange}
                    addSubsection={this.props.addSubsection}
                    delSubsection={this.props.delSubsection}
                    index={this.props.index}
                    text={this.props.sectionData.text}
                    textAlign={this.props.sectionData.textAlign}
                    subsections={this.props.sectionData.subsections}
                    uiAddSubsectionDisabled={this.props.sectionData.uiAddSubsectionDisabled}
                    uiTextHide={this.props.sectionData.uiTextHide}
                />
            </Card.Body>
        </Card>
    }
}
