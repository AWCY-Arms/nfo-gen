import React, { ChangeEventHandler, MouseEventHandler } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { headers } from './headers';
import { NfoFormSection } from './NfoFormSection';
import { NfoData, NfoSection } from './NfoWriter';


interface NfoFormProps {
  handleChange: ChangeEventHandler,
  handleContentChange: ChangeEventHandler,
  delSection: MouseEventHandler,
  addSection: MouseEventHandler,
  addSubsection: MouseEventHandler,
  delSubsection: MouseEventHandler,
  nfoData: NfoData,
}

class NfoForm extends React.Component<NfoFormProps> {
  render() {
    const headerOptions = Object.keys(headers).map((e, i) => {
      return <option key={i} value={e}>{e}</option>
    })
    return <Form id="options">
      <Row className="mb-3">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>
                <Row>
                  <Col>
                    Header
                  </Col>
                </Row>
              </Card.Title>
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group as={Col}>
                    <Row className="mb-3">
                      <Form.Label >Image</Form.Label>
                      <Col>
                        <Form.Select name="header" size="sm" onChange={this.props.handleChange} value={this.props.nfoData.header}>
                          {headerOptions}
                        </Form.Select>
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group as={Col}>
                    <Row className="mb-3">
                      <Form.Label>Alignment</Form.Label>
                      <Col>
                        <Form.Select name="headerAlign" size="sm" onChange={this.props.handleChange} value={this.props.nfoData.headerAlign}>
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right" disabled>Right</option>
                        </Form.Select>
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row >
      <Row className="mb-3">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>
                <Row>
                  <Col>
                    Main
                  </Col>
                </Row>
              </Card.Title>
              <Row className="mb-3">
                <Form.Label column="sm" lg={2}>Title</Form.Label>
                <Col>
                  <Form.Control type="text" size="sm" name="title" placeholder="Title" onChange={this.props.handleChange} value={this.props.nfoData.title} maxLength={76} />
                </Col>
              </Row>
              <Row className="mb-3">
                <Form.Label column="sm" lg={2}>Description</Form.Label>
                <Col>
                  <Form.Control type="text" size="sm" name="description" placeholder="Description" onChange={this.props.handleChange} value={this.props.nfoData.description} />
                </Col>
              </Row>
              <Row>
                <Form.Label column="sm" lg={2}>Version</Form.Label>
                <Col>
                  <Form.Control type="text" size="sm" name="version" placeholder="1.0.0" onChange={this.props.handleChange} value={this.props.nfoData.version} maxLength={76} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>
                <Row className="mb-3">
                  <Col>
                    Sections
                  </Col>
                </Row>
              </Card.Title>
              <div id="sections">
                {
                  this.props.nfoData.content.map((e: NfoSection, i: number) => {
                    return <NfoFormSection
                      key={i}
                      onChange={this.props.handleContentChange}
                      delSection={this.props.delSection}
                      addSubsection={this.props.addSubsection}
                      delSubsection={this.props.delSubsection}
                      index={i}
                      header={e.header}
                      sectionType={e.sectionType}
                      sectionData={e.sectionData}
                      uiHeaderDisabled={e.uiHeaderDisabled}
                      uiSectionTypeDisabled={e.uiSectionTypeDisabled}
                    />
                  })
                }
              </div>
              <Row>
                <Col>
                  <Button variant="primary" size="sm" onClick={this.props.addSection}>Add a Section</Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Form >
  }
}

export default NfoForm;
