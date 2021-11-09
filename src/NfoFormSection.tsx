import React, { ChangeEventHandler, MouseEventHandler } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import deepClone from './functions';
import { defaultNfoSectionData, NfoSectionData } from './NfoWriter';


interface NfoFormSectionProps extends NfoSectionData {
    index: Number,
    onChange: ChangeEventHandler,
    delSection: MouseEventHandler<HTMLButtonElement>,
}

export class NfoFormSection extends React.Component<NfoFormSectionProps> {
    static defaultProps: NfoFormSectionProps = Object.assign(
        deepClone(defaultNfoSectionData),
        {
            index: 0,
            onChange: () => { },
            delSection: () => { },
        }
    );
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
                    <Form.Select name="text_align" onChange={this.props.onChange} data-index={this.props.index} value={this.props.text_align}>
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
                        value={this.props.text.join('\n')}></Form.Control>
                    {this.props.index === 0 ? <div className="form-text">Shift+Enter to start a new line</div> : ''}
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
