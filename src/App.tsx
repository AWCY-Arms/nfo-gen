import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Badge, Col, Container, Row, Stack, Tab, Tabs } from 'react-bootstrap';
import packageJson from '../package.json';
import CopyNfo from './CopyNfo';
import Nfo from './Nfo';
import NfoForm from './NfoForm';
import { defaultOptions, NfoConfig } from './NfoWriter';
import OptionsJson from './OptionsJson';


// Soon... https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
function deepClone(oldObject: Object) {
  return JSON.parse(JSON.stringify(oldObject));
}

interface AppProps {
}

export interface AppState {
  nfoConfig: NfoConfig,
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      nfoConfig: deepClone(defaultOptions)
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
      const newConfig = deepClone(state.nfoConfig);
      newConfig[target.name] = target.value;
      this.setState({
        nfoConfig: newConfig as NfoConfig,
      });
    });
  }
  handleContentChange(e: React.ChangeEvent<Element>) {
    this.setState((state) => {
      const target = (e.target as HTMLInputElement)
      const index =  Number.parseInt(target.dataset['index']!);
      const newConfig = deepClone(state.nfoConfig);
      newConfig.content[index][target.name] = target.value;
      return {
        nfoConfig: newConfig as NfoConfig,
      }
    });
  }
  handleJsonChange(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const config: NfoConfig = JSON.parse(e.target.value);
      this.setState({
        nfoConfig: config,
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
        const config: NfoConfig = Object.assign(deepClone(defaultOptions), JSON.parse(result));
        this.setState({
          nfoConfig: config
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
      const newConfig = deepClone(state.nfoConfig);
      newConfig.content.push({ 'header': '', 'text': '' });
      return {
        nfoConfig: newConfig,
      }
    });
  }
  delSection(e: React.MouseEvent): void {
    e.preventDefault();
    this.setState((state) => {
      const { index } = (e.target as HTMLButtonElement).dataset;
      const _index = Number.parseInt(index!);
      const newConfig = deepClone(state.nfoConfig);
      newConfig.content.splice(_index, 1);
      return {
        nfoConfig: newConfig,
      }
    });

  }
  render() {
    return (
      <Container fluid>
        <Row>
          <Col sm="12" xl="6" className="border-end">
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
                        nfoConfig={this.state.nfoConfig}
                      />
                    </Tab>
                    <Tab eventKey="json" title="Save/Load">
                      <OptionsJson
                        handleUpload={this.handleUpload}
                        handleChange={this.handleJsonChange}
                        nfoConfig={this.state.nfoConfig}
                      />
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            </div>
          </Col>
          <Col sm="12" xl="6" className="border-start">
            <div className="my-3">
              <Nfo nfoConfig={this.state.nfoConfig} />
              <CopyNfo />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
