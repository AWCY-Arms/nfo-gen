import { useEffect } from 'react';
import { Badge, Col, Container, Row, Stack, Tab, Tabs } from 'react-bootstrap';
import packageJson from '../package.json';
import About from './components/About';
import store from './app/store';
import CopyNfo from './components/CopyNfo';
import { setIsRightNfo, updateDarkMode } from './features/app/appSlice';
import Nfo from './components/Nfo';
import NfoForm from './components/NfoForm';
import OptionsJson from './components/OptionsJson';
import ReturnToTop from './components/ReturnToTop';


function updateDarkColorScheme() {
    const mode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
    store.dispatch(updateDarkMode({ mode }));
}

const tabsId = "tabs";
const leftNfoId = "content0";
export const rightNfoId = "content1";

const leftColId = "leftCol";
const rightColId = "rightCol";

function updateCurrentTab() {
    const isRightNfo = window.matchMedia && window.matchMedia("(min-width: 1200px)").matches;
    store.dispatch(setIsRightNfo({ isRightNfo }));

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
    return <Container fluid>
        <Row>
            <Col sm="12" xl="6" className="main-col">
                <div id={leftColId} className="px-3 pt-3">
                    <Row className="mb-3">
                        <Col>
                            <Stack direction="horizontal" gap={3}>
                                <h1>AWCY? Readme Generator</h1>
                                <div className="ms-auto">
                                    <Badge bg="light" text="dark">v{packageJson.version}</Badge>
                                </div>
                            </Stack>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Tabs defaultActiveKey="form" id={tabsId} className="mb-3">
                                <Tab eventKey="form" title="Edit">
                                    <NfoForm />
                                    <ReturnToTop id={leftColId} />
                                </Tab>
                                <Tab eventKey="json" title="Save/Load">
                                    <OptionsJson />
                                </Tab>
                                <Tab eventKey="nfo" title="NFO" tabClassName="d-xl-none">
                                    <div className="d-xl-none mx-auto nfo-container">
                                        <CopyNfo />
                                        <Nfo id={leftNfoId} />
                                        <ReturnToTop id={leftColId} />
                                    </div>
                                </Tab>
                                <Tab eventKey="about" title="About">
                                    <About />
                                    <ReturnToTop id={leftColId} />
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </div>
            </Col>
            <Col sm="12" xl="6" className="d-none d-xl-block border-start main-col">
                <div id={rightColId} className="mx-auto pt-3 nfo-container">
                    <CopyNfo />
                    <Nfo id={rightNfoId} />
                    <ReturnToTop id={rightColId} />
                </div>
            </Col>
        </Row>
    </Container>
}

export default App;
