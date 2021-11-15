import React, { ChangeEventHandler, MouseEventHandler } from 'react';
import { Button, Card, Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import deepClone from './helpers';
import { NfoSectionData } from './NfoWriter';
import { blankNfoSectionData } from './templates/partials/blank';


interface NfoFormSectionDataProps extends NfoSectionData {
    index: Number,
    onChange: ChangeEventHandler,
    addSubsection: MouseEventHandler,
    delSubsection: MouseEventHandler,
}

export class NfoFormSectionData extends React.Component<NfoFormSectionDataProps> {
    static defaultProps: NfoFormSectionDataProps = Object.assign(
        deepClone(blankNfoSectionData.sectionData),
        {
            index: 0,
            onChange: () => { },
            addSubsection: () => { },
            delSubsection: () => { },
        }
    );
    render() {
        const subsectionsLength = this.props.subsections?.length || 0;
        const subsections = this.props.subsections?.map((subsection, i) => {
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
                                        data-index={this.props.index}
                                        data-index2={i}
                                        onChange={this.props.onChange}
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
                                data-index={this.props.index}
                                data-index2={i}
                                onClick={this.props.delSubsection}
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
                                    onChange={this.props.onChange}
                                    data-index={this.props.index}
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
                            data-index={this.props.index}
                            data-index2={i}
                            onChange={this.props.onChange}
                            value={subsection.text.join('\n')}
                        ></Form.Control>
                    </Form.Group>
                </Card.Body>
            </Card>
        })
        return <div className="mb-2">
            {this.props.uiTextHide ? "" :
                <div>
                    <Row className="mb-3">
                        <Form.Label column="sm" lg="2">Text Align</Form.Label>
                        <Col>
                            <Form.Select
                                name="textAlign"
                                size="sm"
                                onChange={this.props.onChange}
                                data-index={this.props.index}
                                value={this.props.textAlign}
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
                            data-index={this.props.index}
                            onChange={this.props.onChange}
                            value={this.props.text.join('\n')}
                        ></Form.Control>
                        {this.props.index === 0 ? <Form.Text>Shift+Enter to start a new line</Form.Text> : ''}
                    </Form.Group>
                </div>
            }
            {subsections}
            {this.props.uiAddSubsectionDisabled ? "" :
                <Row className={subsectionsLength ? "mt-3" : ""}>
                    <Col>
                        <Button
                            variant="primary"
                            size="sm"
                            data-index={this.props.index}
                            onClick={this.props.addSubsection}
                        >Add Subsection</Button>
                    </Col>
                </Row>
            }
        </div>
    }
}

export default NfoFormSectionData
