import { useEffect } from 'react';
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import store from '../app/store';
import { setIsRightNfo, updateDarkMode } from '../features/app/appSlice';
import About from './About';
import CopyNfo from './CopyNfo';
import Nfo from './Nfo';
import NfoForm from './NfoForm';
import OptionsJson from './OptionsJson';
import ReturnToTop from './ReturnToTop';


function updateDarkColorScheme() {
    const mode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', mode);
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
                    <Row>
                        <Col>
                            <Tabs defaultActiveKey="form" id={tabsId} className="mb-3" mountOnEnter={true} unmountOnExit={true}>
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
