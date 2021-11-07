import './App.scss';
import React from 'react';
import { Badge, Col, Container, Row, Stack, Tab, Tabs } from 'react-bootstrap';
import packageJson from '../package.json';
import CopyNfo from './CopyNfo';
import Nfo from './Nfo';
import NfoForm from './NfoForm';
import { defaultNfoData, defaultNfoSectionData, NfoData } from './NfoWriter';
import OptionsJson from './OptionsJson';
import deepClone from './functions';


interface AppProps {
}

export interface AppState {
  nfoData: NfoData,
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      nfoData: deepClone(defaultNfoData)
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleJsonChange = this.handleJsonChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.addSection = this.addSection.bind(this);
    this.delSection = this.delSection.bind(this);
  }
  handleInputChange(e: React.ChangeEvent<Element>) {
    const target = e.target as HTMLInputElement;
    this.setState((state) => {
      const newData = deepClone(state.nfoData);
      newData[target.name] = target.value;
      this.setState({
        nfoData: newData as NfoData,
      });
    });
  }
  handleContentChange(e: React.ChangeEvent<Element>) {
    this.setState((state) => {
      const target = (e.target as HTMLInputElement)
      const index = Number.parseInt(target.dataset['index']!);
      const newData = deepClone(state.nfoData);
      newData.content[index][target.name] = target.value.split('\n');
      return {
        nfoData: newData as NfoData,
      }
    });
  }
  handleJsonChange(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const config: NfoData = JSON.parse(e.target.value);
      this.setState({
        nfoData: config,
      });
    } catch {
      // TODO allow invalid json so user can edit it in the textarea input
    }
  }
  handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event?.target?.result?.toString();
      if (!result) return;
      try {
        const config: NfoData = Object.assign(deepClone(defaultNfoData), JSON.parse(result));
        this.setState({
          nfoData: config
        });
      } catch (e) {
        console.error('Invalid JSON');
      }
      e.target.value = '';
    };
    const target = e.target as HTMLInputElement;
    const selectedFile = target.files![0]
    if (selectedFile !== null)
      reader.readAsText(selectedFile);

  }
  addSection(e: React.MouseEvent) {
    e.preventDefault();
    this.setState((state) => {
      const newData = deepClone(state.nfoData);
      newData.content.push(deepClone(defaultNfoSectionData));
      return {
        nfoData: newData,
      }
    });
  }
  delSection(e: React.MouseEvent): void {
    e.preventDefault();
    this.setState((state) => {
      const { index } = (e.target as HTMLButtonElement).dataset;
      const _index = Number.parseInt(index!);
      const newData = deepClone(state.nfoData);
      newData.content.splice(_index, 1);
      return {
        nfoData: newData,
      }
    });
  }
  render() {
    return (
      <Container fluid>
        <Row>
          <Col sm="12" xl="6" className="border-end" style={{ minHeight: "100vh" }}>
            <div className="mx-3 my-3">
              <Row className="mb-3">
                <Col>
                  <Stack direction="horizontal" style={{ alignItems: 'baseline' }} gap={3}>
                    <h1>AWCY? Readme Generator</h1>
                    <Badge bg="light" text="dark">v{packageJson.version}</Badge>
                  </Stack>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Tabs defaultActiveKey="form" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="form" title="Form">
                      <NfoForm
                        handleChange={this.handleInputChange}
                        handleContentChange={this.handleContentChange}
                        addSection={this.addSection}
                        delSection={this.delSection}
                        nfoData={this.state.nfoData}
                      />
                    </Tab>
                    <Tab eventKey="json" title="Save/Load">
                      <OptionsJson
                        handleUpload={this.handleUpload}
                        handleChange={this.handleJsonChange}
                        nfoData={this.state.nfoData}
                      />
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            </div>
          </Col>
          <Col sm="12" xl="6" className="border-start" style={{ minHeight: "100vh" }}>
            <div className="my-3">
              <Nfo nfoData={this.state.nfoData} />
              <CopyNfo />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
