import React, { ChangeEvent, MouseEventHandler } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { headers } from './headers';
import { NfoFormSection, NfoFormSectionData } from './NfoFormSection';


interface NfoFormProps {
  handleChange: (e: ChangeEvent) => void,
  handleContentChange: (e: ChangeEvent) => void,
  delSection: MouseEventHandler<HTMLButtonElement>,
  addSection: MouseEventHandler<HTMLButtonElement>,
  header: string,
  header_align: string,
  title: string,
  description: string,
  version: string,
  content: Array<NfoFormSectionData>,
}

class NfoForm extends React.Component<NfoFormProps> {
  render() {
    const header_options = Object.keys(headers).map((e, i) => {
      return <option key={i} value={e}>{e}</option>
    })
    return <Form id="options">
      <Row className="mb-3">
        <Form.Group as={Col}>
          <Form.Label>Header Image</Form.Label>
          <Form.Select name="header" onChange={this.props.handleChange} value={this.props.header}>
            {header_options}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} >
          <Form.Label>Header Alignment</Form.Label>
          <Form.Select name="header_align" onChange={this.props.handleChange} value={this.props.header_align}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right" disabled>Right</option>
          </Form.Select>
        </Form.Group>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" name="title" placeholder="Title" onChange={this.props.handleChange} value={this.props.title} maxLength={76} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" name="description" placeholder="Description" onChange={this.props.handleChange} value={this.props.description} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label >Version</Form.Label>
        <Form.Control type="text" name="version" placeholder="1.0.0" onChange={this.props.handleChange} value={this.props.version} maxLength={76} />
      </Form.Group>
      <div className="mb-3">
        <Form.Label>Sections</Form.Label>
        <div id="sections">{
          this.props.content.map((e: NfoFormSectionData, i) => {
            return <NfoFormSection
              key={i}
              onChange={this.props.handleContentChange}
              delSection={this.props.delSection}
              index={i}
              header={e.header}
              text={e.text}
              text_align={e.text_align}
            />
          })
        }</div>
      </div>
      <div className="mb-3">
        <Button variant="primary" onClick={this.props.addSection}>Add a Section</Button>
      </div>
    </Form>
  }
}

export default NfoForm;
