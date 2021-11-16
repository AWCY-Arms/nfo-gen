import { Badge, Col, Container, Row, Stack, Tab, Tabs } from 'react-bootstrap';
import packageJson from '../package.json';
import './App.scss';
import CopyNfo from './CopyNfo';
import Nfo from './Nfo';
import NfoForm from './NfoForm';
import OptionsJson from './OptionsJson';


function App() {
    return <Container fluid>
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
                                    <NfoForm />
                                </Tab>
                                <Tab eventKey="json" title="Save/Load">
                                    <OptionsJson />
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </div>
            </Col>
            <Col sm="12" xl="6" className="border-start" style={{ minHeight: "100vh" }}>
                <div className="my-3">
                    <Nfo />
                    <CopyNfo />
                </div>
            </Col>
        </Row>
    </Container>
}

export default App;
