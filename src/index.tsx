import React from 'react';
import ReactDOM from 'react-dom';
import AppSplash from './AppSplash';
import App from './App';
import store from './app/store'
import { Provider } from 'react-redux'
import "./scss/vendors/bootstrap-dark.scss";
import "./scss/main.scss";


ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <AppSplash />
            <App />
        </React.StrictMode>
    </Provider>,
    document.getElementById('root')
);
