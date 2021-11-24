import { useEffect } from 'react';
import { Badge, Col, Container, Row, Stack, Tab, Tabs } from 'react-bootstrap';
import packageJson from '../package.json';
import './App.scss';
import { useAppSelector } from './app/hooks';
import store from './app/store';
import CopyNfo from './CopyNfo';
import { updateDarkMode } from './features/app/appSlice';
import Nfo from './Nfo';
import NfoForm from './NfoForm';
import { renderNfo } from './NfoWriter';
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

const tabsId = "tabs";

function updateCurrentTab(e: any) {
    // if (e.matches) {}
    const tabIsNfo = document.getElementById(tabsId + '-tab-nfo')!.classList.contains('active');
    if (tabIsNfo) {
        document.getElementById(tabsId + '-tab-form')!.click();
    }
}

function App() {
    useEffect(() => {
        updateDarkColorScheme();
        if (window.matchMedia) {
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateDarkColorScheme);
            window.matchMedia("(min-width: 1200px)").addEventListener("change", updateCurrentTab);
        }
    });
    const nfoData = useAppSelector((state) => state.nfoConfig.nfoData);
    const nfoText = renderNfo(nfoData);
    return <Container fluid>
        <Row>
            <Col sm="12" xl="6" style={{ height: "100vh", overflowY: "scroll" }}>
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
                            <Tabs defaultActiveKey="form" id={tabsId} className="mb-3">
                                <Tab eventKey="form" title="Form">
                                    <NfoForm />
                                </Tab>
                                <Tab eventKey="json" title="Save/Load">
                                    <OptionsJson />
                                </Tab>
                                <Tab eventKey="nfo" title="NFO" tabClassName="d-xl-none">
                                    <div className="d-xl-none mx-auto" style={{ width: "fit-content" }}>
                                        <Nfo id="content0" text={nfoText} />
                                        <CopyNfo contentId="content0" />
                                    </div>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </div>
            </Col>
            <Col sm="12" xl="6" className="d-none d-xl-block" style={{ height: "100vh", overflowY: "scroll" }}>
                <div className="my-3 mx-auto" style={{ width: "fit-content" }}>
                    <Nfo id="content1" text={nfoText} />
                    <CopyNfo contentId="content1" />
                </div>
            </Col>
        </Row>
    </Container>
}

export default App;
