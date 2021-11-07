import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Badge, Col, Container, Row, Stack, Tab, Tabs } from 'react-bootstrap';
import packageJson from '../package.json';
import CopyNfo from './CopyNfo';
import Nfo from './Nfo';
import NfoForm from './NfoForm';
import { NfoFormSectionData } from './NfoFormSection';
import { defaultOptions } from './NfoWriter';
import OptionsJson from './OptionsJson';


// Soon... https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
function deepClone(oldObject: Object) {
  return JSON.parse(JSON.stringify(oldObject));
}

interface AppProps {
}

interface IObjectKeys {
  [key: string]: string | Array<Object>;
}

export interface AppState extends IObjectKeys {
  header: string,
  header_align: string,
  title: string,
  description: string,
  version: string,
  content: Array<NfoFormSectionData>,
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = deepClone(defaultOptions);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleJsonChange = this.handleJsonChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.addSection = this.addSection.bind(this);
    this.delSection = this.delSection.bind(this);
  }
  handleInputChange(e: React.ChangeEvent<Element>) {
    const newState = {} as AppState;
    const target = e.target as HTMLInputElement;
    newState[target.name] = target.value;
    this.setState(newState);
  }
  handleContentChange(e: React.ChangeEvent<Element>) {
    this.setState((state) => {
      const target = e.target as HTMLInputElement;
      const { index } = target.dataset;
      const newContent = deepClone(state.content);
      newContent[index!][target.name] = target.value;
      return {
        content: newContent,
      }
    });
  }
  handleJsonChange(e: React.ChangeEvent<Element>) {
    try {
      const target = e.target as HTMLInputElement;
      const newState = JSON.parse(target.value);
      this.setState(newState);
    } catch {
      // TODO allow invalid json so user can edit it in the textarea input
    }
  }
  handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event?.target?.result?.toString();
      if (!result) return;
      const newState = JSON.parse(result);
      this.setState(newState);
    };
    const target = e.target as HTMLInputElement;
    const selectedFile = target.files![0]
    if (selectedFile !== null)
      reader.readAsText(selectedFile);

  }
  addSection(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    this.setState((state) => {
      const newContent = deepClone(state.content);
      newContent.push({ 'header': '', 'text': '' });
      return {
        content: newContent,
      }
    });
  }
  delSection(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    this.setState((state) => {
      const { index } = (e.target as HTMLButtonElement).dataset;
      const _index = Number.parseInt(index!);
      const newContent = deepClone(state.content);
      newContent.splice(_index, 1);
      return {
        content: newContent,
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
                        header={this.state.header}
                        header_align={this.state.header_align}
                        title={this.state.title}
                        description={this.state.description}
                        version={this.state.version}
                        content={this.state.content}
                      />
                    </Tab>
                    <Tab eventKey="json" title="Save/Load">
                      <OptionsJson
                        handleUpload={this.handleUpload}
                        handleChange={this.handleJsonChange}
                        options={this.state}
                      />
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            </div>
          </Col>
          <Col sm="12" xl="6" className="border-start">
            <div className="my-3">
              <Nfo options={this.state} />
              <CopyNfo />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
