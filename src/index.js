import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import App from './App';
import {MuiThemeProvider} from "material-ui/styles/index";

render(
    <BrowserRouter>
        <MuiThemeProvider>
            <App/>
        </MuiThemeProvider>
    </BrowserRouter>,
    document.getElementById('root')
);
// registerServiceWorker();