import React from 'react';
import { Badge, Col, Container, Row, Stack, Tab, Tabs } from 'react-bootstrap';
import packageJson from '../package.json';
import './App.scss';
import CopyNfo from './CopyNfo';
import deepClone from './helpers';
import Nfo from './Nfo';
import NfoForm from './NfoForm';
import {
  NfoData,
  NfoSection,
  NfoSubsection,
  readConfig,
  TextAlign
} from './NfoWriter';
import OptionsJson from './OptionsJson';
import { blankNfoSectionData, blankNfoSubsectionData } from './templates/partials/blank';
import defaultNfoSectionCredits from './templates/partials/credits';
import defaultNfoData from './templates/examples/default';
import sampleTemplates from './templates/examples';


interface AppProps {
}

export interface AppState {
  nfoData: NfoData,
  nfoJson: string | null,
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      nfoData: deepClone(defaultNfoData),
      nfoJson: null,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleJsonChange = this.handleJsonChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.addSection = this.addSection.bind(this);
    this.delSection = this.delSection.bind(this);
    this.addSubsection = this.addSubsection.bind(this);
    this.delSubsection = this.delSubsection.bind(this);
    this.loadTemplate = this.loadTemplate.bind(this);
  }
  handleInputChange(e: React.ChangeEvent<Element>) {
    const target = e.target as HTMLInputElement;
    this.setState((state) => {
      const newData = deepClone(state.nfoData);
      newData[target.name] = target.value;
      this.setState({
        nfoData: newData as NfoData,
        nfoJson: null,
      });
    });
  }
  handleContentChange(e: React.ChangeEvent<Element>) {
    this.setState((state) => {
      const target = (e.target as HTMLInputElement)
      const index = Number.parseInt(target.dataset['index']!);
      const _subindex = Number.parseInt(target.dataset['index2']!);
      const subindex = isNaN(_subindex) ? null : _subindex;
      const newData = deepClone(state.nfoData);
      let section;
      switch (target.name) {
        case "sectionType":
          switch (target.value) {
            case "credits":
              section = defaultNfoSectionCredits;
              break;
            default:
              section = blankNfoSectionData;
              break;
          }
          newData.content[index] = deepClone(section);
          break;
        case "subheader":
          if (subindex !== null) {
            section = newData.content[index].sectionData.subsections![subindex] as NfoSubsection;
            section[target.name] = target.value;
          }
          break;
        case "text":
          if (subindex !== null) {
            section = newData.content[index].sectionData.subsections![subindex] as NfoSubsection;
            section[target.name] = target.value.split('\n')
          } else {
            section = newData.content[index] as NfoSection;
            section.sectionData[target.name] = target.value.split('\n');
          }
          break;
        case "textAlign":
          if (subindex !== null) {
            section = newData.content[index].sectionData.subsections![subindex] as NfoSubsection;
            section[target.name] = target.value as TextAlign;
          } else {
            section = newData.content[index] as NfoSection;
            section.sectionData[target.name] = target.value as TextAlign;
          }
          break;
        default:
          section = newData.content[index] as NfoSection
          section[target.name] = target.value;
          break;
      }
      return {
        nfoData: newData as NfoData,
        nfoJson: null,
      }
    });
  }
  handleJsonChange(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const config: NfoData = JSON.parse(e.target.value);
      this.setState({
        nfoData: config,
        nfoJson: null,
      });
    } catch {
      this.setState({
        nfoJson: e.target.value,
      });
    }
  }
  handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event?.target?.result?.toString();
      if (!result) return;
      try {
        const config: NfoData = readConfig(JSON.parse(result));
        this.setState({
          nfoData: config,
          nfoJson: null,
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
      newData.content.push(deepClone(blankNfoSectionData));
      return {
        nfoData: newData,
        nfoJson: null,
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
        nfoJson: null,
      }
    });
  }
  addSubsection(e: React.MouseEvent) {
    e.preventDefault();
    this.setState((state) => {
      const { index } = (e.target as HTMLButtonElement).dataset;
      const _index = Number.parseInt(index!);
      const newData = deepClone(state.nfoData);
      newData.content[_index]!.sectionData!.subsections!.push(deepClone(blankNfoSubsectionData));
      return {
        nfoData: newData,
        nfoJson: null,
      }
    });
  }
  delSubsection(e: React.MouseEvent) {
    e.preventDefault();
    this.setState((state) => {
      const { index, index2 } = (e.target as HTMLButtonElement).dataset;
      const _index = Number.parseInt(index!);
      const _subindex = Number.parseInt(index2!);
      const newData = deepClone(state.nfoData);
      newData.content[_index]!.sectionData!.subsections!.splice(_subindex, 1);
      return {
        nfoData: newData,
        nfoJson: null,
      }
    });
  }
  loadTemplate(e: React.ChangeEvent) {
    const target = e.target as HTMLInputElement;
    const config: NfoData = sampleTemplates[target.value][1];
    this.setState({
      nfoData: config,
      nfoJson: null,
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
                        addSubsection={this.addSubsection}
                        delSubsection={this.delSubsection}
                        nfoData={this.state.nfoData}
                      />
                    </Tab>
                    <Tab eventKey="json" title="Save/Load">
                      <OptionsJson
                        handleUpload={this.handleUpload}
                        handleChange={this.handleJsonChange}
                        loadTemplate={this.loadTemplate}
                        nfoData={this.state.nfoData}
                        nfoJson={this.state.nfoJson}
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
