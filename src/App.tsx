import { useEffect } from 'react';
import { Badge, Col, Container, Row, Stack, Tab, Tabs } from 'react-bootstrap';
import packageJson from '../package.json';
import './App.scss';
import { useAppSelector } from './app/hooks';
import store from './app/store';
import { setNfo, updateDarkMode } from './features/app/appSlice';
import Nfo from './Nfo';
import NfoForm from './NfoForm';
import { convertToSections, renderToText } from './NfoWriter';
import OptionsJson from './OptionsJson';
import ReturnToTop from './ReturnToTop';


function updateDarkColorScheme() {
    const mode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
    store.dispatch(updateDarkMode({ mode }))
}

const tabsId = "tabs";

function updateCurrentTab() {
    const nfo = window.matchMedia && window.matchMedia("(min-width: 1200px)").matches ? 1 : 0;
    store.dispatch(setNfo({ nfo }));

    const tabIsNfo = document.getElementById(tabsId + '-tab-nfo')!.classList.contains('active');
    if (tabIsNfo) {
        document.getElementById(tabsId + '-tab-form')!.click();
    }
}

function App() {
    useEffect(() => {
        updateDarkColorScheme();
        updateCurrentTab();
        if (window.matchMedia) {
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateDarkColorScheme);
            window.matchMedia("(min-width: 1200px)").addEventListener("change", updateCurrentTab);
        }
    });
    const nfoData = useAppSelector((state) => state.nfoConfig.nfoData);
    const nfoSections = convertToSections(nfoData);
    const nfoText = renderToText(nfoSections);
    return <Container fluid>
        <pre id="nfoText" style={{ position: "absolute", transform: "scale(0)", zIndex: -1 }}>{nfoText}</pre>
        <Row>
            <Col sm="12" xl="6" style={{ height: "100vh", overflowY: "scroll" }}>
                <div id="leftCol" className="px-3 py-3">
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
                                        <Nfo id="content0" sections={nfoSections} />
                                        <ReturnToTop id="leftCol" />
                                    </div>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </div>
            </Col>
            <Col sm="12" xl="6" className="d-none d-xl-block" style={{ height: "100vh", overflowY: "scroll" }}>
                <div id="rightCol" className="mx-auto" style={{ width: "fit-content" }}>
                    <Nfo id="content1" sections={nfoSections} />
                    <ReturnToTop id="rightCol" />
                </div>
            </Col>
        </Row>
    </Container>
}

export default App;
