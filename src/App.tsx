import { useEffect } from 'react';
import { Badge, Col, Container, Row, Stack, Tab, Tabs } from 'react-bootstrap';
import packageJson from '../package.json';
import './App.scss';
import store from './app/store';
import CopyNfo from './CopyNfo';
import { updateDarkMode } from './features/app/appSlice';
import Nfo from './Nfo';
import NfoForm from './NfoForm';
import OptionsJson from './OptionsJson';


function updateDarkColorScheme() {
    const html = document.getElementsByTagName('html')[0];
    let mode;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        html.classList.remove('light');
        html.classList.add("dark");
        mode = 'dark';
    } else {
        html.classList.remove('dark');
        html.classList.add("light");
        mode = 'light';
    }
    store.dispatch(updateDarkMode({ mode }))
}

function App() {
    useEffect(() => {
        updateDarkColorScheme();
        if (window.matchMedia) {
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateDarkColorScheme);
        }
    });
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
