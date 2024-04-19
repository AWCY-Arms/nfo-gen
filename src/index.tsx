import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import AppSplash from './AppSplash';
import App from './components/App';
import "./scss/main.scss";
import "bootstrap/scss/bootstrap.scss";


ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <AppSplash />
            <App />
        </React.StrictMode>
    </Provider>,
    document.getElementById('root')
);
