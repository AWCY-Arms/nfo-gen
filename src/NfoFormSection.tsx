import React, { ChangeEvent, MouseEventHandler } from 'react';
import { Button, Card, Form } from 'react-bootstrap';


export interface NfoFormSectionData {
    header: string,
    text: string,
    text_align: string,
}

interface NfoFormSectionProps extends NfoFormSectionData {
    index: Number,
    onChange: (e: ChangeEvent) => void,
    delSection: MouseEventHandler<HTMLButtonElement>,
}

export class NfoFormSection extends React.Component<NfoFormSectionProps> {
    static defaultProps: NfoFormSectionProps = {
        header: '',
        text: '',
        text_align: 'center',
        index: 0,
        onChange: () => { },
        delSection: () => { },
    }
    render() {
        return <Card className="mb-2">
            <Card.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Header</Form.Label>
                    <Form.Control
                        type="text"
                        name="header"
                        placeholder="Header"
                        data-index={this.props.index}
                        onChange={this.props.onChange}
                        value={this.props.header} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Text Align</Form.Label>
                    <Form.Select name="align" onChange={this.props.onChange} data-index={this.props.index} value={this.props.text_align}>
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right" disabled>Right</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Text</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="text"
                        placeholder="Text"
                        data-index={this.props.index}
                        onChange={this.props.onChange}
                        value={this.props.text}></Form.Control>
                </Form.Group>
                <div className="d-grid mt-2">
                    <Button
                        variant="danger"
                        data-index={this.props.index}
                        onClick={this.props.delSection}
                        disabled={this.props.index === 0 ? true : false}>Remove</Button>
                </div>
            </Card.Body>
        </Card>
    }
}
